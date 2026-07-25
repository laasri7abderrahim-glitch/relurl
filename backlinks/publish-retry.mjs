// Publish remaining 2 articles
const DEVTO_KEY = "4gvQZnCrsJTWKUNd7qWcz92R"
import fs from "fs"

const articles = [
  { file: "11-branded-links.md", tags: ["branding", "marketing", "seo", "business"] },
  { file: "12-api-guide.md", tags: ["api", "developer", "programming", "webdev"] },
]

for (const article of articles) {
  const content = fs.readFileSync(`backlinks/${article.file}`, "utf-8")
  const title = content.split("\n")[0].replace(/^#\s+/, "").trim()
  console.log(`Publishing: ${title}`)
  const res = await fetch("https://dev.to/api/articles", {
    method: "POST",
    headers: { "api-key": DEVTO_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ article: { title, body_markdown: content, published: true, tags: article.tags } }),
  })
  if (res.ok) console.log(`  ✅ ${(await res.json()).url}`)
  else console.error(`  ❌ ${await res.text()}`)
  await new Promise(r => setTimeout(r, 5000))
}
