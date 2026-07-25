import { GoogleAuth } from "google-auth-library"
import { readFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load service account key from .env
const envPath = resolve(__dirname, "..", ".env")
const envRaw = readFileSync(envPath, "utf-8")
const match = envRaw.match(/GOOGLE_INDEXING_KEY="([^"]+)"/)
if (!match) throw new Error("GOOGLE_INDEXING_KEY not found in .env")
const keyJson = Buffer.from(match[1], "base64").toString("utf-8")
const credentials = JSON.parse(keyJson)

const SCOPES = ["https://www.googleapis.com/auth/indexing"]
const BASE_URL = "https://relurl.com"

const PRIORITY_URLS = [
  "/",
  "/en/",
  "/fr/",
  "/es/",
  "/en/pricing",
  "/en/features",
  "/en/blog",
  "/en/custom-url-shortener",
  "/en/qr-code-generator",
  "/en/contact",
  "/en/browser-extension",
  "/sitemap.xml",
]

async function submitUrl(auth, url, type = "URL_UPDATED") {
  const client = await auth.getClient()
  const fullUrl = `${BASE_URL}${url}`
  try {
    const res = await client.request({
      url: "https://indexing.googleapis.com/v3/urlNotifications:publish",
      method: "POST",
      data: { url: fullUrl, type },
    })
    return { url, status: "✅", notificationType: res.data?.urlNotificationMetadata?.latestUpdate?.type || type }
  } catch (err) {
    return { url, status: "❌", error: err.message }
  }
}

async function main() {
  const auth = new GoogleAuth({
    credentials,
    scopes: SCOPES,
  })

  console.log("Submitting to Google Indexing API...\n")
  const results = await Promise.all(PRIORITY_URLS.map((u) => submitUrl(auth, u)))

  console.log("Results:")
  console.log("=".repeat(60))
  for (const r of results) {
    const icon = r.status === "✅" ? "✓" : "✗"
    console.log(`  ${icon} ${BASE_URL}${r.url}`)
    if (r.error) console.log(`     Error: ${r.error}`)
  }
  console.log("=".repeat(60))
  console.log(`\nSubmitted ${results.filter(r => r.status === "✅").length}/${results.length} URLs`)
}

main().catch(console.error)
