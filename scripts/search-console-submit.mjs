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
    scopes: ["https://www.googleapis.com/auth/webmasters"],
  })
  const client = await auth.getClient()

  try {
    const sites = await client.request({
      url: "https://www.googleapis.com/webmasters/v3/sites",
      method: "GET",
    })
    const siteList = sites.data.siteEntry || []
    if (siteList.length === 0) {
      console.log("No sites found. Service account has no Search Console access.")
      console.log("\n--- MANUAL STEPS ---")
      console.log("1. Go to https://search.google.com/search-console")
      console.log('2. Add property: Domain → "relurl.com"')
      console.log("3. Verify ownership (DNS or HTML file)")
      return
    }
    console.log("Sites with access:")
    for (const site of siteList) {
      console.log(`  ${site.siteUrl} (${site.permissionLevel})`)
    }

    // Submit sitemap
    const siteUrl = siteList[0].siteUrl
    try {
      await client.request({
        url: `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent("https://relurl.com/sitemap.xml")}`,
        method: "PUT",
      })
      console.log("\nSitemap submitted to Google Search Console!")
    } catch (e2) {
      console.log("\nNote: Could not submit sitemap via API:", e2.response?.data?.error?.message || e2.message)
    }
  } catch (e) {
    console.error("API Error:", e.response?.data?.error?.message || e.message)
    console.log("\n--- MANUAL STEPS ---")
    console.log("1. Go to https://search.google.com/search-console")
    console.log('2. Add property: Domain → "relurl.com"')
    console.log("3. Submit sitemap: https://relurl.com/sitemap.xml")
  }
}
run()
