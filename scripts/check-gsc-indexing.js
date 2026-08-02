const { GoogleAuth } = require("google-auth-library")
const { readFileSync } = require("fs")
const env = readFileSync(".env", "utf-8")
const m = env.match(/GOOGLE_INDEXING_KEY="([^"]+)"/)
const creds = JSON.parse(Buffer.from(m[1], "base64").toString("utf-8"))

;(async () => {
  const auth = new GoogleAuth({ credentials: creds, scopes: ["https://www.googleapis.com/auth/webmasters"] })
  const c = await auth.getClient()

  // Delete broken sitemaps
  for (const sm of ["sitemap.xml", "sitemap.ts"]) {
    const encoded = encodeURIComponent(`https://relurl.com/${sm}`)
    try {
      await c.request({
        url: `https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2Frelurl.com%2F/sitemaps/${encoded}`,
        method: "DELETE",
      })
      console.log(`Deleted broken sitemap: ${sm}`)
    } catch (e) {
      console.log(`Could not delete ${sm}: ${e.response?.data?.error?.message || e.message}`)
    }
  }

  // URL Inspection API - check a few key URLs
  const checkUrls = [
    "https://relurl.com/en",
    "https://relurl.com/en/custom-url-shortener",
    "https://relurl.com/en/blog/how-to-shorten-a-url",
    "https://relurl.com/en/free-url-shortener",
  ]

  for (const u of checkUrls) {
    try {
      const res = await c.request({
        url: `https://searchconsole.googleapis.com/v1/urlInspection/index:inspect`,
        method: "POST",
        data: { inspectionUrl: u, siteUrl: "https://relurl.com/", languageCode: "en-US" },
      })
      const r = res.data.inspectionResult
      if (r) {
        const idx = r.indexStatusResult
        console.log(`\n${u}`)
        console.log(`  verdict: ${r.verdict}`)
        console.log(`  indexStatus: ${idx?.indexingState} | crawlAllowed: ${idx?.crawlAllowed}`)
        console.log(`  coverage: ${idx?.coverageState}`)
        console.log(`  googleCanonical: ${idx?.googleCanonical}`)
        if (idx?.indexingState === "EXCLUDED") {
          console.log(`  exclusionReason: ${idx?.robotsTxtState || "n/a"} / ${idx?.lastCrawlTime || "never crawled"}`)
        }
      } else {
        console.log(`\n${u}: no inspection result - ${JSON.stringify(res.data).slice(0, 300)}`)
      }
    } catch (e) {
      console.log(`\n${u}: ERROR ${e.response?.data?.error?.message || e.message}`)
    }
  }
})().catch((e) => console.error("FATAL:", e.message))
