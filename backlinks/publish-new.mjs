// Publish 4 new articles to Dev.to
const DEVTO_KEY = "4gvQZnCrsJTWKUNd7qWcz92R"

const ARTICLES = [
  { file: "09-link-analytics.md", tags: ["analytics", "marketing", "seo", "metrics"] },
  { file: "10-qr-marketing.md", tags: ["marketing", "business", "technology", "design"] },
  { file: "11-branded-links.md", tags: ["branding", "marketing", "seo", "business"] },
  { file: "12-api-guide.md", tags: ["api", "developer", "programming", "webdev"] },
]

import fs from "fs"

async function main() {
  for (const article of ARTICLES) {
    const content = fs.readFileSync(`backlinks/${article.file}`, "utf-8")
    const lines = content.split("\n")
    const title = lines[0].replace(/^#\s+/, "").trim()

    console.log(`\nPublishing: ${title}`)

    const res = await fetch("https://dev.to/api/articles", {
      method: "POST",
      headers: { "api-key": DEVTO_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        article: {
          title,
          body_markdown: content,
          published: true,
          tags: article.tags,
        },
      }),
    })

    if (res.ok) {
      const data = await res.json()
      console.log(`  ✅ Published: ${data.url}`)
    } else {
      const err = await res.text()
      console.error(`  ❌ Failed: ${err.slice(0, 200)}`)
    }

    // Delay to respect Dev.to rate limit (10 per 30s)
    await new Promise(r => setTimeout(r, 5000))
  }

  console.log("\n✅ All 4 articles published!")
}

main().catch(console.error)
