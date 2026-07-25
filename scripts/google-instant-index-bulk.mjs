import { GoogleAuth } from "google-auth-library"
import { readFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const envRaw = readFileSync(resolve(__dirname, "..", ".env"), "utf-8")
const m = envRaw.match(/GOOGLE_INDEXING_KEY="([^"]+)"/)
const creds = JSON.parse(Buffer.from(m[1], "base64").toString("utf-8"))

const BASE = "https://relurl.com"
const MORE_URLS = [
  "/en/about", "/en/faq", "/en/terms", "/en/privacy",
  "/en/api", "/en/integrations", "/en/changelog",
  "/en/link-management", "/en/analytics", "/en/social-media",
  "/en/branded-links", "/en/link-shortener-enterprise",
  "/en/campaign-tracking", "/en/affiliate-links",
  "/en/url-shortener-analytics", "/en/marketing-analytics",
  "/en/trackable-links", "/en/smart-links",
  "/en/url-shortener", "/en/link-shortener",
  "/en/short-link", "/en/short-url",
  "/en/qr-code", "/en/qr-codes",
  "/en/qr-code-scanner", "/en/qr-code-for-url",
  "/en/dynamic-qr-code", "/en/qr-code-tracking",
  "/en/qr-code-link-shortener", "/en/qr-code-generator-with-logo",
  "/en/bulk-qr-code", "/en/custom-qr-code",
  "/en/qr-code-link", "/en/qr-code-digital-business-card",
  "/en/qr-code-marketing", "/en/qr-code-bio-link",
  "/en/free-qr-code-generator", "/en/qr-code-generator-online",
  "/en/qr-code-api", "/en/qr-code-link-generator",
  "/en/qr-code-generator-dynamic", "/en/qr-menu",
  "/en/custom-url", "/en/custom-short-links",
  "/en/branded-short-links", "/en/vanity-url",
  "/en/url-shortener-custom-domain", "/en/domain-renaming-service",
  "/en/url-shortener-for-business", "/en/url-shortener-for-marketers",
  "/en/url-shortener-for-social-media", "/en/url-shortener-for-instagram",
  "/en/url-shortener-for-tiktok", "/en/url-shortener-for-facebook",
  "/en/url-shortener-for-twitter", "/en/url-shortener-for-linkedin",
  "/en/url-shortener-for-whatsapp", "/en/url-shortener-for-sms",
  "/en/url-shortener-for-email", "/en/url-shortener-for-podcasts",
  "/en/url-shortener-for-qr-codes", "/en/url-shortener-for-agencies",
  "/en/url-shortener-for-real-estate", "/en/url-shortener-for-ecommerce",
  "/en/url-shortener-for-content-creators",
  "/en/url-shortener-for-influencers", "/en/url-shortener-for-realtors",
  "/en/url-shortener-for-educators", "/en/url-shortener-for-recruiters",
  "/en/url-shortener-for-nonprofits", "/en/url-shortener-for-restaurants",
  "/en/url-shortener-for-hotels", "/en/url-shortener-startup",
  "/en/small-business-url-shortener",
  "/en/link-shortener-for-digital-marketing",
  "/en/link-shortener-for-instagram", "/en/link-shortener-for-tiktok",
  "/en/link-shortener-for-facebook", "/en/link-shortener-for-twitter",
  "/en/link-shortener-for-linkedin", "/en/link-shortener-for-whatsapp",
  "/en/link-shortener-email-marketing",
  "/en/link-shortener-content-creators",
  "/en/link-shortener-social-media-managers",
  "/en/link-shortener-agencies",
]

async function run() {
  const auth = new GoogleAuth({ credentials: creds, scopes: ["https://www.googleapis.com/auth/indexing"] })
  const client = await auth.getClient()
  let ok = 0, fail = 0
  for (const url of MORE_URLS) {
    try {
      await client.request({
        url: "https://indexing.googleapis.com/v3/urlNotifications:publish",
        method: "POST",
        data: { url: BASE + url, type: "URL_UPDATED" },
      })
      ok++
      process.stdout.write(".")
    } catch (e) {
      fail++
      if (e.response?.data?.error?.message?.includes("quota")) {
        console.log(`\nQUOTA EXCEEDED at ${url} after ${ok} OK, ${fail} FAIL`)
        break
      }
      process.stdout.write("x")
    }
  }
  console.log(`\nOK: ${ok}, FAIL: ${fail}`)
}
run().catch(console.error)
