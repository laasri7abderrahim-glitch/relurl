const { GoogleAuth } = require("google-auth-library")
const { readFileSync } = require("fs")
const env = readFileSync(".env", "utf-8")
const m = env.match(/GOOGLE_INDEXING_KEY="([^"]+)"/)
const creds = JSON.parse(Buffer.from(m[1], "base64").toString("utf-8"))

;(async () => {
  const auth = new GoogleAuth({ credentials: creds, scopes: ["https://www.googleapis.com/auth/webmasters"] })
  const c = await auth.getClient()
  const r = await c.request({
    url: "https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2Frelurl.com%2F/sitemaps",
    method: "GET",
  })
  const list = r.data.sitemap || []
  console.log("Sitemaps in GSC:")
  for (const s of list) {
    console.log(`  ${s.path}`)
    console.log(`     submitted: ${s.lastSubmitted}, isPending: ${s.isPending}, errors: ${s.errors}, warnings: ${s.warnings}`)
  }
  if (!list.length) console.log("  (none)")
})().catch((e) => console.error("ERR:", e.message))
