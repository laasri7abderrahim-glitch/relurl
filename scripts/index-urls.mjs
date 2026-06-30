import { readFileSync } from "fs"
import { GoogleAuth } from "google-auth-library"

const BASE_URL = "https://relurl.com"

function getKeyData() {
  const keyEnv = process.env.GOOGLE_INDEXING_KEY
  if (keyEnv) {
    try {
      return JSON.parse(Buffer.from(keyEnv, "base64").toString("utf-8"))
    } catch {
      try {
        return JSON.parse(keyEnv)
      } catch {
        console.error("ERROR: GOOGLE_INDEXING_KEY is not valid base64-encoded JSON or raw JSON")
        process.exit(1)
      }
    }
  }

  const keyPath = process.env.GOOGLE_INDEXING_KEY_PATH
  if (keyPath) {
    try {
      return JSON.parse(readFileSync(keyPath, "utf-8"))
    } catch {
      console.error("ERROR: Could not read key file at", keyPath)
      process.exit(1)
    }
  }

  console.error("ERROR: Set GOOGLE_INDEXING_KEY (base64 JSON) or GOOGLE_INDEXING_KEY_PATH (file path)")
  process.exit(1)
}

const keyData = getKeyData()

const auth = new GoogleAuth({
  credentials: keyData,
  scopes: ["https://www.googleapis.com/auth/indexing"],
})

const urls = [
  // Static pages
  "", "/features", "/pricing", "/integrations", "/changelog",
  "/blog", "/contact", "/privacy", "/terms", "/cookies", "/gdpr", "/dmca", "/wordpress",

  // URL shortener landing pages
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

  // Social media pages
  "/instagram-link-generator", "/whatsapp-link-generator", "/telegram-link-generator",
  "/tiktok-bio-link-generator", "/youtube-link-generator", "/facebook-url-generator",
  "/linkedin-url-generator", "/pinterest-link-generator", "/snapchat-link-generator",
  "/reddit-link-generator", "/discord-link-generator", "/twitch-link-generator",
  "/twitter-link-generator", "/threads-link-generator", "/mastodon-link-generator",

  // QR code pages
  "/qr-code-generator", "/dynamic-qr-code-generator", "/free-qr-code-generator",
  "/qr-code-for-wifi", "/qr-code-for-vcard", "/qr-code-for-business-card",
  "/qr-code-for-restaurant-menu", "/qr-code-for-app-download", "/qr-code-for-google-maps",
  "/qr-code-for-google-reviews", "/qr-code-for-facebook", "/qr-code-for-instagram",
  "/qr-code-for-linkedin", "/qr-code-for-youtube", "/qr-code-for-whatsapp",
  "/qr-code-for-email", "/qr-code-for-sms", "/qr-code-for-phone", "/qr-code-for-event",
  "/qr-code-for-pdf", "/qr-code-for-restaurant", "/qr-code-for-hotel", "/qr-code-for-gym",
  "/qr-code-for-salon", "/qr-code-for-store", "/qr-code-for-resume", "/qr-code-for-portfolio",
  "/qr-code-for-wedding", "/qr-code-for-birthday", "/qr-code-for-concert", "/qr-code-for-class",
  "/qr-code-for-fundraiser",

  // Blog landing
  "/blog",
]

// Blog article slugs (from the 180 articles)
const blogSlugs = [
  "free-url-shortener-no-sign-up", "free-url-shortener-custom-alias",
  "free-url-shortener-for-social-media", "free-url-shortener-unlimited-links",
  "free-url-shortener-vs-paid", "free-url-shortener-with-analytics",
  "free-url-shortener-for-students", "free-url-shortener-link-never-expires",
  "free-url-shortener-without-ads", "free-url-shortener-bulk",
  "qr-code-generator-with-logo", "qr-code-generator-for-business-cards",
  "qr-code-generator-custom-design", "qr-code-generator-for-restaurant-menu",
  "qr-code-generator-for-marketing", "qr-code-generator-with-analytics",
  "qr-code-generator-for-event", "qr-code-generator-for-real-estate",
  "qr-code-generator-for-social-media", "qr-code-generator-for-wedding",
  "custom-url-shortener-for-business", "custom-url-shortener-with-analytics",
  "custom-url-shortener-for-brand", "custom-url-shortener-vs-generic",
  "custom-url-shortener-for-marketing-campaigns", "custom-url-shortener-for-small-business",
  "custom-url-shortener-with-custom-domain", "custom-url-shortener-for-affiliate-marketing",
  "custom-url-shortener-for-email-marketing", "custom-url-shortener-for-portfolio",
  "branded-link-shortener-for-business", "branded-short-link-trust",
  "branded-link-shortener-click-through-rate", "branded-url-shortener-vs-generic",
  "branded-link-shortener-for-social-media", "branded-short-link-seo",
  "branded-link-shortener-for-email", "branded-link-shortener-for-affiliate",
  "branded-link-shortener-custom-domain", "branded-short-link-best-practices",
  "bulk-url-shortener-csv-upload", "bulk-shorten-urls-api",
  "bulk-url-shortener-free-unlimited", "bulk-url-shortener-for-seo",
  "bulk-url-shortener-for-ecommerce", "bulk-url-shortener-python-script",
  "bulk-url-shortener-google-sheets", "bulk-url-shortener-for-affiliate-marketing",
  "bulk-url-shortener-for-marketing-campaigns", "bulk-url-shortener-enterprise",
  "instagram-link-generator-bio", "instagram-link-generator-story",
  "instagram-link-generator-for-business", "instagram-link-click-tracking",
  "instagram-link-generator-multiple-links", "instagram-link-generator-for-influencer",
  "instagram-link-generator-for-shop", "instagram-link-generator-for-content-creator",
  "instagram-link-generator-analytics", "instagram-link-generator-landing-page",
  "whatsapp-link-generator-for-business", "whatsapp-click-to-chat-link",
  "whatsapp-link-with-pre-filled-message", "whatsapp-link-generator-for-customer-support",
  "whatsapp-link-generator-for-marketing", "whatsapp-link-without-saving-number",
  "whatsapp-link-generator-for-ecommerce", "whatsapp-link-generator-for-api",
  "whatsapp-link-generator-for-lead-generation", "whatsapp-link-generator-bulk",
  "youtube-link-generator-for-description", "youtube-link-generator-for-channel",
  "youtube-link-generator-for-affiliate", "youtube-link-generator-with-analytics",
  "youtube-link-generator-for-social-media", "youtube-link-generator-for-cta",
  "youtube-link-generator-for-cards-and-end-screens", "youtube-link-generator-for-playlist",
  "youtube-link-generator-for-email", "youtube-link-generator-for-live-stream",
  "best-url-shortener-2026-comparison", "free-url-shortener-shorten-links-online",
  "bitly-alternative-marketers-switching-relurl", "tinyurl-alternative-modern-features",
  "link-shortener-complete-guide", "url-shortener-with-custom-domain",
  "best-free-link-shortener-10-features", "link-shortener-no-sign-up",
  "short-link-generator-create-compact-urls", "url-shortener-no-account-anonymous",
  "url-shortener-with-analytics-free", "google-url-shortener-alternative",
  "rebrandly-alternative", "short-io-alternative", "link-tracking-and-analytics",
  "cuttly-alternative-comparison", "url-shortener-for-instagram-bio-stories",
  "link-shortener-for-tiktok-traffic", "url-shortener-for-whatsapp-chats",
  "link-shortener-for-twitter-x-characters", "url-shortener-for-linkedin",
  "link-shortener-for-facebook", "url-shortener-for-youtube",
  "short-link-for-sms-marketing", "url-shortener-for-email-marketing",
  "link-shortener-for-affiliate-marketing", "url-shortener-for-small-business",
  "link-shortener-for-influencers", "url-shortener-for-ecommerce",
  "link-shortener-for-whatsapp-business", "how-to-shorten-a-url-step-by-step",
  "how-to-create-a-custom-short-link", "how-to-make-a-link-shorter-methods",
  "how-to-create-a-branded-link-custom-domain", "how-to-track-link-clicks-analytics",
  "api-url-shortener-integration", "webhook-link-tracking-real-time-notifications",
  "team-link-management-collaboration",
  "url-shortener-seo-impact", "do-short-links-hurt-seo", "301-redirect-seo",
  "branded-links-increase-ctr", "link-shortener-marketing-strategy",
  "url-shortener-social-media-strategy", "short-link-best-practices",
]

const locales = ["en", "fr"]

function fullUrl(path) {
  return `${BASE_URL}${path}`
}

async function submitUrl(client, url) {
  try {
    const res = await client.request({
      url: "https://indexing.googleapis.com/v3/urlNotifications:publish",
      method: "POST",
      data: { url, type: "URL_UPDATED" },
    })
    return { url, ok: true, data: res.data }
  } catch (err) {
    return { url, ok: false, error: err.message }
  }
}

async function main() {
  const client = await auth.getClient()

  const allPaths = []

  // Add all locale-prefixed URLs
  for (const locale of locales) {
    for (const path of urls) {
      allPaths.push(`/${locale}${path}`)
    }
    for (const slug of blogSlugs) {
      allPaths.push(`/${locale}/blog/${slug}`)
    }
  }

  console.log(`Submitting ${allPaths.length} URLs to Google Indexing API...`)
  console.log("Daily quota: 200 URLs. Submitting in batches.\n")

  const results = { ok: 0, fail: 0, errors: [] }
  let batchCount = 0

  for (const path of allPaths) {
    const url = fullUrl(path)
    const result = await submitUrl(client, url)
    if (result.ok) {
      results.ok++
    } else {
      results.fail++
      results.errors.push({ url, error: result.error })
    }
    batchCount++
    if (batchCount % 50 === 0) {
      console.log(`  ${batchCount}/${allPaths.length} submitted...`)
    }
    // Small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 200))
  }

  console.log(`\nDone! ${results.ok} OK, ${results.fail} failed`)
  if (results.errors.length > 0) {
    console.log("\nErrors:")
    results.errors.slice(0, 10).forEach((e) => console.log(`  ${e.url}: ${e.error}`))
    if (results.errors.length > 10) {
      console.log(`  ... and ${results.errors.length - 10} more`)
    }
  }
}

main().catch(console.error)
