import { NextResponse } from "next/server"
import { readFileSync } from "fs"
import { GoogleAuth } from "google-auth-library"
import { getAllSlugs } from "@/lib/blog/posts"

let client: any = null

function getKeyData(): Record<string, unknown> {
  const keyEnv = process.env.GOOGLE_INDEXING_KEY
  if (keyEnv) {
    try {
      return JSON.parse(Buffer.from(keyEnv, "base64").toString("utf-8"))
    } catch {
      try {
        return JSON.parse(keyEnv)
      } catch {
        throw new Error("GOOGLE_INDEXING_KEY is not valid base64-encoded JSON or raw JSON")
      }
    }
  }

  const keyPath = process.env.GOOGLE_INDEXING_KEY_PATH
  if (keyPath) {
    return JSON.parse(readFileSync(keyPath, "utf-8"))
  }

  throw new Error("Set GOOGLE_INDEXING_KEY (base64 JSON) or GOOGLE_INDEXING_KEY_PATH (file path)")
}

async function getIndexingClient() {
  if (client) return client
  const keyData = getKeyData()
  const auth = new GoogleAuth({
    credentials: keyData,
    scopes: ["https://www.googleapis.com/auth/indexing"],
  })
  client = await auth.getClient()
  return client
}

async function submitUrl(url: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const c = await getIndexingClient()
    await c.request({
      url: "https://indexing.googleapis.com/v3/urlNotifications:publish",
      method: "POST",
      data: { url, type: "URL_UPDATED" },
    })
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: { url?: string; urls?: string[] }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const urlsToSubmit = body.urls || (body.url ? [body.url] : [])

  if (urlsToSubmit.length === 0) {
    return NextResponse.json({ error: "Provide 'url' or 'urls' field" }, { status: 400 })
  }

  if (urlsToSubmit.length > 200) {
    return NextResponse.json({ error: "Max 200 URLs per request (Google daily quota)" }, { status: 400 })
  }

  const results = []
  for (const url of urlsToSubmit) {
    const result = await submitUrl(url)
    results.push({ url, ...result })
  }

  const ok = results.filter((r) => r.ok).length
  const fail = results.filter((r) => !r.ok).length

  return NextResponse.json({ submitted: urlsToSubmit.length, ok, fail, results })
}

function isAuthorized(req: Request): boolean {
  if (req.headers.get("x-vercel-cron") === "1") return true
  const authHeader = req.headers.get("authorization")
  if (authHeader === `Bearer ${process.env.CRON_SECRET}`) return true
  return false
}

const staticPaths = [
  "", "/features", "/pricing", "/integrations", "/changelog",
  "/blog", "/contact", "/privacy", "/terms", "/cookies", "/gdpr", "/dmca", "/wordpress",
  "/login", "/register", "/forgot-password", "/reset-password",
  "/custom-url-shortener", "/branded-link-shortener", "/bulk-url-shortener",
  "/affiliate-link-shortener", "/marketing-url-shortener", "/free-url-shortener",
  "/url-tracking-tool", "/campaign-link-generator", "/short-url-analytics",
  "/custom-alias-generator", "/ecommerce-url-shortener", "/real-estate-link-shortener",
  "/saas-link-shortener", "/podcast-link-shortener", "/event-link-shortener",
  "/news-link-shortener", "/education-link-shortener", "/healthcare-link-shortener",
  "/nonprofit-link-shortener", "/travel-link-shortener", "/restaurant-link-shortener",
  "/music-link-shortener", "/photography-link-shortener", "/gaming-link-shortener",
  "/crypto-link-shortener", "/agency-link-shortener", "/startup-link-shortener",
  "/ebook-link-shortener", "/course-link-shortener", "/webinar-link-shortener",
  "/password-protected-links", "/link-expiration", "/url-shortener-api",
  "/custom-domain-links", "/link-in-bio",
  "/shorten-pdf-link", "/shorten-image-url", "/shorten-video-url",
  "/shorten-github-url", "/shorten-google-drive-link", "/shorten-google-docs-link",
  "/shorten-dropbox-link", "/shorten-spotify-link", "/shorten-amazon-link",
  "/shorten-shopify-link", "/shorten-medium-link", "/shorten-notion-link",
  "/shorten-figma-link", "/shorten-calendly-link", "/shorten-patreon-link",
  "/shorten-etsy-link", "/shorten-airbnb-link", "/shorten-substack-link",
  "/signal-link-generator", "/wechat-link-generator", "/slack-link-generator",
  "/tiktok-bio-link-generator", "/youtube-link-generator", "/facebook-url-generator",
  "/linkedin-url-generator", "/pinterest-link-generator", "/snapchat-link-generator",
  "/reddit-link-generator", "/discord-link-generator", "/twitch-link-generator",
  "/twitter-link-generator", "/threads-link-generator", "/mastodon-link-generator",
  "/shorten-youtube-url", "/shorten-instagram-url", "/shorten-facebook-url",
  "/shorten-whatsapp-link", "/shorten-linkedin-url", "/shorten-tiktok-url",
  "/shorten-x-url", "/shorten-discord-invite-link",
  "/bitly-alternative", "/tinyurl-alternative", "/rebrandly-alternative",
  "/short-io-alternative", "/best-url-shortener",
  "/how-to-shorten-a-url", "/how-to-create-short-links",
  "/how-to-track-link-clicks", "/how-to-create-qr-codes",
  "/how-to-create-branded-links", "/how-to-use-utm-parameters",
  "/qr-code-generator", "/dynamic-qr-code-generator", "/free-qr-code-generator",
  "/relurl-vs-tinyurl", "/relurl-vs-bitly",
  "/how-to-create-qr-codes-for-business", "/how-to-make-money-with-url-shortener",
  "/url-shortener-no-signup", "/url-shortener-without-signup",
  "/url-shortener-for-business", "/url-shortener-for-marketers",
  "/url-shortener-for-social-media",
  "/url-shortener-in-india", "/url-shortener-in-uk", "/url-shortener-in-canada",
  "/url-shortener-with-qr-codes", "/url-shortener-with-analytics", "/url-shortener-no-ads",
  "/qr-code-for-wifi", "/qr-code-for-vcard", "/qr-code-for-business-card",
  "/qr-code-for-restaurant-menu", "/qr-code-for-app-download", "/qr-code-for-google-maps",
  "/qr-code-for-google-reviews", "/qr-code-for-facebook", "/qr-code-for-instagram",
  "/qr-code-for-linkedin", "/qr-code-for-youtube", "/qr-code-for-whatsapp",
  "/qr-code-for-email", "/qr-code-for-sms", "/qr-code-for-phone", "/qr-code-for-event",
  "/qr-code-for-pdf", "/qr-code-for-restaurant", "/qr-code-for-hotel", "/qr-code-for-gym",
  "/qr-code-for-salon", "/qr-code-for-store", "/qr-code-for-resume", "/qr-code-for-portfolio",
  "/qr-code-for-wedding", "/qr-code-for-birthday", "/qr-code-for-concert", "/qr-code-for-class",
  "/qr-code-for-fundraiser",
]

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://relurl.com"
  const locales = ["en", "fr"]
  const slugs = getAllSlugs()

  const urls: string[] = []
  for (const locale of locales) {
    for (const path of staticPaths) {
      urls.push(`${baseUrl}/${locale}${path}`)
    }
    for (const slug of slugs) {
      urls.push(`${baseUrl}/${locale}/blog/${slug}`)
    }
  }

  // Rotate through all URLs each day to avoid submitting the same 200
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  const batchSize = 200
  const startIndex = (dayOfYear * batchSize) % urls.length
  const batch = []
  for (let i = 0; i < batchSize && i < urls.length; i++) {
    batch.push(urls[(startIndex + i) % urls.length])
  }

  const results = []
  for (let i = 0; i < batch.length; i++) {
    const result = await submitUrl(batch[i])
    results.push({ url: batch[i], ...result })
  }

  const ok = results.filter((r) => r.ok).length
  const fail = results.filter((r) => !r.ok).length

  return NextResponse.json({
    totalAvailable: urls.length,
    submitted: batch.length,
    ok,
    fail,
    batchStart: startIndex,
    batchEnd: (startIndex + batch.length) % urls.length,
    note: "Google daily quota is 200 URLs. URLs rotate daily to cover all pages over ~4 days.",
  })
}
