import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "RELURL vs TinyURL (2026) — Which Is Better?",
    description: "Compare RELURL vs TinyURL: Free plan analytics vs zero, 5,000 active links vs 500, team collaboration vs none, geo-targeting, QR codes, and more. See why thousands switch.",
    path: "/relurl-vs-tinyurl",
    keywords: ["relurl vs tinyurl", "tinyurl alternative", "relurl or tinyurl", "compare url shorteners", "tinyurl free plan no analytics"],
    locale,
  })
}

export default function Page() {
  const href = "/relurl-vs-tinyurl"
  const relatedArticles = getPostsByLandingPage("/free-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="RELURL vs TinyURL (2026)"
      subtitle="The Honest Comparison"
      description="TinyURL is great for one-off shortening — it's fast and has been around since 2002. But if you need analytics, team tools, branded domains, or any marketing features, RELURL wins on every front. Here's the breakdown."
      placeholder="Compare features now..."
      generateLabel="See the difference"
      features={[
        "Free plan includes full click analytics (TinyURL Free = zero analytics)",
        "5,000 active links on Pro — TinyURL caps you at 500",
        "Team collaboration with role-based access — TinyURL has none",
        "Geo & device targeting for international campaigns",
        "Link-in-bio pages for social media profiles",
        "Webhook notifications on every click"
      ]}
      howItWorks={[
        { step: "Free Plan Analytics", desc: "RELURL Free includes click tracking, geo data, devices, and referrers. TinyURL Free gives you nothing — not even basic click counts." },
        { step: "Scale Without Limits", desc: "RELURL Pro gives 5,000 active links and 50,000 tracked clicks/month. TinyURL Pro caps you at 500 links with no explicit click allowance." },
        { step: "Team & Marketing Tools", desc: "RELURL includes team workspaces, UTM builder, link health monitoring, and bio pages. TinyURL offers none of these." },
      ]}
      useCases={[
        "Get real analytics on your free plan — TinyURL Free has zero tracking",
        "Scale beyond 500 links without hitting a cap",
        "Collaborate with your team on link campaigns",
        "Route users by country or device type",
        "Build link-in-bio pages for Instagram, TikTok, YouTube",
        "Monitor link health and get broken link alerts"
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "Does RELURL's free plan really have analytics?", a: "Yes. Unlike TinyURL's free plan which offers zero click tracking, RELURL Free includes full analytics: total clicks, unique visitors, geographic data, device breakdown, browser info, and referrer tracking — all at no cost." },
        { q: "How many links can I create on each platform?", a: "RELURL Free: unlimited links. RELURL Pro: 5,000 active links. TinyURL Free: unlimited (but no editing or analytics). TinyURL Pro: only 500 active URLs — 10x less than RELURL Pro for a comparable price." },
        { q: "Does TinyURL have team collaboration?", a: "No. TinyURL has no team features whatsoever. RELURL offers multi-user workspaces with role-based access (Owner, Admin, Member), shared link libraries, team analytics, and centralized billing." },
        { q: "Which is better for international campaigns?", a: "RELURL. You can route users to different destinations based on their country or device type. TinyURL has no geo-targeting or device routing capabilities." },
        { q: "Can I use my own branded domain?", a: "Both support branded domains. But RELURL Pro includes up to 3 custom domains, and Business includes up to 10. TinyURL Pro only allows 1 branded domain." },
        { q: "Do links expire on either platform?", a: "RELURL links never expire on any plan. TinyURL Free and Pro links are permanent, but their Bulk ($99+/mo) plan has a 90-day expiration — links stop working after 90 days unless you actively manage them." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
