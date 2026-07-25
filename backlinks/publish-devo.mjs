import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const KEY = "4gvQZnCrsJTWKUNd7qWcz92R"
const files = fs.readdirSync(__dirname).filter(f => /^\d+-.*\.md$/.test(f)).sort()
const tagSets = {
  2: ["social-media", "marketing", "tools"],
  3: ["qr-code", "technology", "tools"],
  4: ["comparison", "alternatives", "url-shortener"],
  5: ["tutorial", "how-to", "guide"],
  6: ["security", "features", "link-management"],
  7: ["productivity", "tools", "automation"],
}

async function main() {
  for (let i = 2; i < files.length; i++) {
    const filepath = path.join(__dirname, files[i])
    const content = fs.readFileSync(filepath, "utf-8")
    const title = content.split("\n")[0].replace(/^#\s+/, "").trim()
    const slug = files[i].replace(/^\d+-/, "").replace(/\.md$/, "")
    const canonical = `https://relurl.com/en/${slug}`
    const tags = tagSets[i] || ["general"]

    const res = await fetch("https://dev.to/api/articles", {
      method: "POST",
      headers: { "api-key": KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        article: {
          title,
          body_markdown: content,
          published: true,
          tags: tags.map(t => t.toLowerCase().replace(/[^a-z0-9]/g, "")),
          canonical_url: canonical,
        },
      }),
    })

    if (res.ok) {
      const data = await res.json()
      console.log(`✅ ${files[i]} → ${data.url}`)
    } else {
      const text = await res.text()
      console.log(`❌ ${files[i]} → ${text.slice(0, 100)}`)
    }

    if (i < files.length - 1) {
      console.log("   waiting 40s...")
      await new Promise(r => setTimeout(r, 40000))
    }
  }
  console.log("\nDone!")
}

main().catch(e => console.error("ERROR:", e))
