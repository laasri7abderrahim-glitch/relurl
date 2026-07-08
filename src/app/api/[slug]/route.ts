import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { trackClick } from "@/lib/analytics";
import { getCachedOrFetch } from "@/lib/cache";
import { rateLimit } from "@/lib/rate-limit";

type ShortLink = {
  id: string;
  url: string;
  slug: string;
  domain: string;
  userId: string;
  password: string | null;
  expiresAt: Date | null;
  isActive: boolean;
  scheduledAt: Date | null;
  geoTargeting: string | null;
  deviceTargeting: string | null;
  languageTargeting: string | null;
  facebookPixel: string | null;
  googlePixel: string | null;
  tiktokPixel: string | null;
  linkedinPixel: string | null;
  twitterPixel: string | null;
  customPixels: string | null;
};

function detectDevice(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (/mobile|android|iphone|ipod/i.test(ua)) return "mobile";
  if (/ipad|tablet/i.test(ua)) return "tablet";
  return "desktop";
}

function detectCountry(req: NextRequest): string | null {
  return (
    req.headers.get("x-vercel-ip-country")?.toUpperCase() ||
    (() => {
      const forwarded = req.headers.get("x-forwarded-for");
      return forwarded ? forwarded.split(",")[0].trim().toUpperCase() : null;
    })()
  );
}

function detectLanguage(req: NextRequest): string | null {
  const acceptLanguage = req.headers.get("accept-language") || "";
  return (
    acceptLanguage
      .split(",")[0]
      ?.split(";")[0]
      ?.split("-")[0]
      ?.trim()
      ?.toLowerCase() || null
  );
}

function checkTargeting(
  link: ShortLink,
  req: NextRequest
): { allowed: boolean; reason?: string } {
  if (link.password) {
    return { allowed: false, reason: "password_required" };
  }

  if (link.expiresAt && link.expiresAt < new Date()) {
    return { allowed: false, reason: "expired" };
  }

  if (link.scheduledAt && link.scheduledAt > new Date()) {
    return { allowed: false, reason: "not_yet_active" };
  }

  if (link.geoTargeting) {
    try {
      const geo = JSON.parse(link.geoTargeting);
      if (geo.enabled && geo.countries?.length > 0) {
        const country = detectCountry(req);
        if (country && !geo.countries.includes(country)) {
          return { allowed: false, reason: "geo_blocked" };
        }
      }
    } catch {}
  }

  if (link.deviceTargeting) {
    try {
      const device = JSON.parse(link.deviceTargeting);
      if (device.enabled && device.devices?.length > 0) {
        const userAgent = req.headers.get("user-agent") || "";
        const detected = detectDevice(userAgent);
        if (!device.devices.includes(detected)) {
          return { allowed: false, reason: "device_blocked" };
        }
      }
    } catch {}
  }

  if (link.languageTargeting) {
    try {
      const lang = JSON.parse(link.languageTargeting);
      if (lang.enabled && lang.languages?.length > 0) {
        const primary = detectLanguage(req);
        if (primary && !lang.languages.includes(primary)) {
          return { allowed: false, reason: "language_blocked" };
        }
      }
    } catch {}
  }

  return { allowed: true };
}

function timeMatchesRange(hour: number, start: string, end: string): boolean {
  const startHour = parseInt(start.split(":")[0]);
  const startMin = parseInt(start.split(":")[1] || "0");
  const endHour = parseInt(end.split(":")[0]);
  const endMin = parseInt(end.split(":")[1] || "0");

  const currentMinutes = hour * 60;
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  if (startMinutes <= endMinutes) {
    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  }
  // Overnight range (e.g., 22:00 - 06:00)
  return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
}

function checkRouteConditions(
  conditions: Record<string, unknown>,
  country: string | null,
  device: string,
  language: string | null,
  hour: number,
  day: number
): boolean {
  const c = conditions as {
    countries?: string[];
    devices?: string[];
    languages?: string[];
    timeRanges?: { start: string; end: string; days?: number[] }[];
  };

  if (c.countries?.length && country) {
    if (!c.countries.includes(country)) return false;
  }
  if (c.devices?.length) {
    if (!c.devices.includes(device)) return false;
  }
  if (c.languages?.length && language) {
    if (!c.languages.includes(language)) return false;
  }
  if (c.timeRanges?.length) {
    const timeMatch = c.timeRanges.some((tr) => {
      const dayMatch = !tr.days?.length || tr.days.includes(day);
      return dayMatch && timeMatchesRange(hour, tr.start, tr.end);
    });
    if (!timeMatch) return false;
  }
  return true;
}

function appendUtmParams(url: string, utmParams: string | null): string {
  if (!utmParams) return url;
  try {
    const utm = JSON.parse(utmParams);
    const urlObj = new URL(url);
    if (utm.source) urlObj.searchParams.set("utm_source", utm.source);
    if (utm.medium) urlObj.searchParams.set("utm_medium", utm.medium);
    if (utm.campaign) urlObj.searchParams.set("utm_campaign", utm.campaign);
    if (utm.content) urlObj.searchParams.set("utm_content", utm.content);
    if (utm.term) urlObj.searchParams.set("utm_term", utm.term);
    return urlObj.toString();
  } catch {
    return url;
  }
}

interface ResolvedRoute {
  destination: string;
  routeId: string;
}

async function resolveSmartRoute(
  linkId: string,
  req: NextRequest
): Promise<ResolvedRoute | null> {
  const routes = await prisma.smartRoute.findMany({
    where: { linkId, isActive: true },
    orderBy: [{ routeGroup: "asc" }, { priority: "desc" }],
  });

  if (routes.length === 0) return null;

  const country = detectCountry(req);
  const device = detectDevice(req.headers.get("user-agent") || "");
  const language = detectLanguage(req);
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();

  // Group routes by routeGroup number
  const grouped = new Map<number, typeof routes>();
  for (const route of routes) {
    const g = route.routeGroup || 0;
    if (!grouped.has(g)) grouped.set(g, []);
    grouped.get(g)!.push(route);
  }

  // Evaluate groups in order (lower routeGroup number = higher priority)
  const sortedGroups = Array.from(grouped.entries()).sort(([a], [b]) => a - b);

  for (const [groupId, groupRoutes] of sortedGroups) {
    if (groupRoutes.length === 0) continue;

    const firstRoute = groupRoutes[0];
    const matchMode = firstRoute.matchMode || "first";

    if (matchMode === "all") {
      // AND logic: ALL routes in the group must match
      const allMatch = groupRoutes.every((route) => {
        const conditions = JSON.parse(route.conditions);
        return checkRouteConditions(conditions, country, device, language, hour, day);
      });

      if (allMatch) {
        const winner = groupRoutes[groupRoutes.length - 1];
        const destination = appendUtmParams(winner.destination, winner.utmParams);
        // Fire-and-forget hit counting
        prisma.smartRoute.update({
          where: { id: winner.id },
          data: { hitCount: { increment: 1 }, lastHitAt: new Date() },
        }).catch(() => {});
        return { destination, routeId: winner.id };
      }
    } else {
      // OR logic (first match wins within group)
      for (const route of groupRoutes) {
        const conditions = JSON.parse(route.conditions);
        if (checkRouteConditions(conditions, country, device, language, hour, day)) {
          const destination = appendUtmParams(route.destination, route.utmParams);
          prisma.smartRoute.update({
            where: { id: route.id },
            data: { hitCount: { increment: 1 }, lastHitAt: new Date() },
          }).catch(() => {});
          return { destination, routeId: route.id };
        }
      }
    }
  }

  return null;
}

function resolveABTest(urls: string[], weights: number[] | null): string {
  if (!weights || weights.length === 0) {
    return urls[Math.floor(Math.random() * urls.length)];
  }

  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < urls.length; i++) {
    random -= weights[i] || 0;
    if (random <= 0) return urls[i];
  }

  return urls[urls.length - 1];
}

function buildRetargetingScript(link: ShortLink): string {
  const scripts: string[] = [];

  if (link.facebookPixel) {
    scripts.push(`
      <script>
        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
        n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
        document,'script','https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${link.facebookPixel}');
        fbq('track', 'PageView');
      </script>
    `);
  }

  if (link.googlePixel) {
    scripts.push(`
      <script async src="https://www.googletagmanager.com/gtag/js?id=${link.googlePixel}"></script>
      <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${link.googlePixel}');
      </script>
    `);
  }

  if (link.tiktokPixel) {
    scripts.push(`
      <script>
        !function (w, d, t) { w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._=r,ttq._t=ttq._t||{},ttq._t[e+""]=+new Date,ttq._o=ttq._o||{},ttq._o[e+""]=n||{};var a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src=r+"?sdkid="+e+"&lib="+t;var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(a,s)};
        ttq.load('${link.tiktokPixel}');
        ttq.page();
      </script>
    `);
  }

  if (link.linkedinPixel) {
    scripts.push(`
      <script>
        _linkedin_partner_id = "${link.linkedinPixel}";
        window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
        window._linkedin_data_partner_ids.push(_linkedin_partner_id);
      </script>
      <script type="text/javascript">
        (function(l) { if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])}; window.lintrk.q=[]} var s = document.getElementsByTagName("script")[0]; var b = document.createElement("script"); b.type = "text/javascript"; b.async = true; b.src = "https://snap.licdn.com/li.lins-analytics/analytics.min.js"; s.parentNode.insertBefore(b, s);})(window.lintrk);
      </script>
    `);
  }

  if (link.twitterPixel) {
    scripts.push(`
      <script>
        !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);},s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='//static.ads-twitter.com/uwt.js',a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
        twq('init','${link.twitterPixel}');
        twq('track','PageView');
      </script>
    `);
  }

  if (link.customPixels) {
    try {
      const customs = JSON.parse(link.customPixels);
      if (Array.isArray(customs)) {
        customs.forEach((pixel: string) => {
          if (pixel.startsWith("<script")) {
            scripts.push(pixel);
          } else {
            scripts.push(`<script async src="${pixel}"></script>`);
          }
        });
      }
    } catch {}
  }

  return scripts.join("\n");
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               req.headers.get('x-real-ip') || 
               '127.0.0.1';
    const { success } = await rateLimit(ip, { maxRequests: 50, windowMs: 60_000 });
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const link = await getCachedOrFetch(
      `link:slug:${slug}`,
      () => prisma.shortLink.findUnique({
        where: { slug },
        include: { abTests: { where: { isActive: true }, take: 1 } },
      }),
      300
    );
    if (!link || !link.isActive) {
      return NextResponse.json({ data: null, error: "Link not found" }, { status: 404 });
    }

    const check = checkTargeting(link as ShortLink, req);
    if (!check.allowed) {
      if (check.reason === "password_required") {
        return NextResponse.redirect(new URL(`/p/${slug}`, req.url));
      }
      if (check.reason === "expired") {
        return NextResponse.json({ data: null, error: "Link has expired" }, { status: 410 });
      }
      if (check.reason === "not_yet_active") {
        return NextResponse.json(
          { data: null, error: "Link is not yet active" },
          { status: 410 }
        );
      }
      return NextResponse.json(
        { data: null, error: "Access denied" },
        { status: 403 }
      );
    }

    let destinationUrl = link.url;

    const smartRoute = await resolveSmartRoute(link.id, req);
    if (smartRoute) {
      destinationUrl = smartRoute.destination;
    } else if (link.abTests.length > 0) {
      const test = link.abTests[0];
      const urls = JSON.parse(test.urls);
      const weights = test.weights ? JSON.parse(test.weights) : null;
      destinationUrl = resolveABTest(urls, weights);

      await prisma.aBTest.update({
        where: { id: test.id },
        data: { totalClicks: { increment: 1 } },
      });
    }

    const hasPixels =
      link.facebookPixel ||
      link.googlePixel ||
      link.tiktokPixel ||
      link.linkedinPixel ||
      link.twitterPixel ||
      link.customPixels;

    trackClick(link.id, req, {
      country: req.headers.get('x-vercel-ip-country'),
      userId: link.userId
    }).catch(() => {});

    if (hasPixels) {
      const pixelScript = buildRetargetingScript(link as ShortLink);
      const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="refresh" content="0;url=${destinationUrl}">
  <title>Redirecting...</title>
  ${pixelScript}
  <script>
    setTimeout(function() { window.location.href = "${destinationUrl}"; }, 100);
  </script>
</head>
<body>
  <p>Redirecting to <a href="${destinationUrl}">${destinationUrl}</a>...</p>
</body>
</html>`;
      return new NextResponse(html, {
        status: 200,
        headers: { "Content-Type": "text/html" },
      });
    }

    return NextResponse.redirect(destinationUrl, 301);
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
