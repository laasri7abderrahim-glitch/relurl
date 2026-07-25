import { GoogleAuth } from "google-auth-library"
import { readFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const envRaw = readFileSync(resolve(__dirname, "..", ".env"), "utf-8")
const m = envRaw.match(/GOOGLE_INDEXING_KEY="([^"]+)"/)
const creds = JSON.parse(Buffer.from(m[1], "base64").toString("utf-8"))

async function run() {
  const auth = new GoogleAuth({
    credentials: creds,
    scopes: ["https://www.googleapis.com/auth/webmasters", "https://www.googleapis.com/auth/indexing"],
  })
  const client = await auth.getClient()

  const siteUrl = "https://relurl.com/"

  // Try URL Inspection API
  console.log("=== URL Inspection ===")
  try {
    const insp = await client.request({
      url: `https://searchconsole.googleapis.com/v1/urlInspection/index:inspect`,
      method: "POST",
      data: {
        inspectionUrl: "https://relurl.com/en/custom-url-shortener",
        siteUrl: siteUrl,
      },
    })
    const r = insp.data.inspectionResult
    console.log("Index status:", r?.indexStatusResult?.coverageState || "unknown")
    console.log("Verdict:", r?.indexStatusResult?.verdict || "unknown")
    console.log("Crawled:", r?.indexStatusResult?.crawledTime || "never")
  } catch (e) {
    console.log("Inspection API not available:", e.response?.data?.error?.message || e.message)
  }

  // Try sitemap details
  console.log("\n=== Sitemap Details ===")
  try {
    const sitemaps = await client.request({
      url: `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps`,
      method: "GET",
    })
    for (const s of (sitemaps.data.sitemap || []).slice(0, 5)) {
      console.log(`\n${s.path}`)
      console.log(JSON.stringify(s.contents, null, 2))
    }
  } catch (e) {
    console.log("Error:", e.response?.data?.error?.message || e.message)
  }

  // Search Analytics - see how many pages got impressions
  console.log("\n=== Search Analytics (last 30 days) ===")
  try {
    const sa = await client.request({
      url: `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
      method: "POST",
      data: {
        startDate: "2024-06-24",
        endDate: "2026-07-24",
        dimensions: ["page"],
        rowLimit: 5000,
      },
    })
    const totalPages = sa.data.rows?.length || 0
    console.log(`Pages with data: ${totalPages}`)
    // Show sample
    if (totalPages > 0) {
      console.log("\nSample pages:")
      sa.data.rows.slice(0, 5).forEach(r => console.log(`  ${r.keys[0]} (${r.impressions} impressions)`))
    }
  } catch (e) {
    console.log("Error:", e.response?.data?.error?.message || e.message)
  }
}
run()
