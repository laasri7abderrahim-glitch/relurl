// Full audit: check all landing pages, count backlinks, find gaps
const xmlUrls = [
  "https://relurl.com/sitemap/translated.xml",
  "https://relurl.com/sitemap/landing.xml",
  "https://relurl.com/sitemap/tools.xml",
  "https://relurl.com/sitemap/static.xml",
]

// Collect all /en/ URLs from sitemaps
const allPages = []
for (const url of xmlUrls) {
  const r = await fetch(url)
  const text = await r.text()
  const locs = [...text.matchAll(/<loc>(https:\/\/relurl\.com[^<]+)<\/loc>/g)].map(m => m[1])
  for (const loc of locs) {
    const path = new URL(loc).pathname
    if (path.startsWith("/en/")) allPages.push(loc)
  }
}

console.log(`Total /en/ pages in sitemaps: ${allPages.length}`)

// Check all return 200
console.log("\n=== Checking all pages for 200 OK ===")
let ok = 0, fail = 0, failUrls = []
for (const url of allPages) {
  try {
    const r = await fetch(url, { redirect: "manual" })
    if (r.status === 200) ok++
    else { fail++; failUrls.push(`${r.status}: ${url}`) }
  } catch { fail++; failUrls.push(`ERROR: ${url}`) }
}
console.log(`200 OK: ${ok}/${allPages.length}`)
if (fail > 0) {
  console.log(`Failed (${fail}):`)
  failUrls.forEach(u => console.log(`  ${u}`))
}

// Extract all backlink paths from existing articles
import fs from "fs"
const articleFiles = [
  "01-url-shortening-guide.md", "02-niche-industry-shorteners.md",
  "03-social-media-link-tools.md", "04-qr-code-generator-guide.md",
  "05-alternatives-comparison.md", "06-guides-tutorials.md",
  "07-advanced-features.md", "08-platform-shorteners.md",
]
const linkedPaths = new Set()
for (const f of articleFiles) {
  const content = fs.readFileSync(`backlinks/${f}`, "utf-8")
  for (const m of content.match(/\/en\/([^?)\s]+)/g) || []) linkedPaths.add(m)
}

// Find which /en/ pages from sitemap are NOT linked
const notLinked = allPages.filter(u => {
  const path = new URL(u).pathname
  return !linkedPaths.has(path) && !path.includes("/blog/") && 
         !["/en/", "/en/features", "/en/pricing", "/en/contact", "/en/browser-extension",
           "/en/integrations", "/en/changelog", "/en/api-reference"].includes(path) &&
         !path.includes("/en/p/") && !path.includes("/en/admin/") && !path.includes("/en/dashboard/")
})

console.log(`\n=== Pages WITHOUT backlinks (${notLinked.length}) ===`)
notLinked.forEach(u => console.log(`  ${u}`))

console.log(`\n=== SUMMARY ===`)
console.log(`Total /en/ pages: ${allPages.length}`)
console.log(`Pages with backlinks: ${linkedPaths.size}`)
console.log(`Pages without backlinks: ${notLinked.length}`)
console.log(`Pages returning 200 OK: ${ok}/${allPages.length}`)
