// Publish all 8 articles to Bluesky only
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const [handle, appPass] = (process.env.BLUESKY_AUTH || "000yasminaton.bsky.social:6uz6-hzwd-p3fe-5iot").split(":")

const ARTICLES = [
  { file: "01-url-shortening-guide.md", tags: ["url-shortener", "link-management", "marketing", "seo"] },
  { file: "02-niche-industry-shorteners.md", tags: ["business", "url-shortener", "saas", "ecommerce"] },
  { file: "03-social-media-link-tools.md", tags: ["social-media", "marketing", "tools", "url-shortener"] },
  { file: "04-qr-code-generator-guide.md", tags: ["qr-code", "marketing", "technology", "tools"] },
  { file: "05-alternatives-comparison.md", tags: ["comparison", "url-shortener", "bitly", "alternatives"] },
  { file: "06-guides-tutorials.md", tags: ["tutorial", "guide", "url-shortener", "how-to"] },
  { file: "07-advanced-features.md", tags: ["security", "link-management", "features", "enterprise"] },
  { file: "08-platform-shorteners.md", tags: ["productivity", "tools", "url-shortener", "automation"] },
]

async function main() {
  // Authenticate with Bluesky
  const sessionRes = await fetch("https://bsky.social/xrpc/com.atproto.server.createSession", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: handle, password: appPass }),
  })
  if (!sessionRes.ok) {
    const err = await sessionRes.text()
    console.error("Bluesky auth failed:", err)
    process.exit(1)
  }
  const { accessJwt, did } = await sessionRes.json()
  console.log("✓ Authenticated with Bluesky as", handle)

  for (const article of ARTICLES) {
    const filepath = path.join(__dirname, article.file)
    const md = fs.readFileSync(filepath, "utf-8")
    const title = md.split("\n")[0].replace(/^#\s+/, "").trim()
    const slug = article.file.replace(/^\d+-/, "").replace(/\.md$/, "")
    const canonicalUrl = `https://relurl.com/en/${slug}`
    const text = `${title}\n\n${canonicalUrl}`

    const res = await fetch("https://bsky.social/xrpc/com.atproto.repo.createRecord", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessJwt}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        repo: did,
        collection: "app.bsky.feed.post",
        record: {
          $type: "app.bsky.feed.post",
          text,
          createdAt: new Date().toISOString(),
          embed: {
            $type: "app.bsky.embed.external",
            external: { uri: canonicalUrl, title, description: "RelURL URL Shortener Guide" },
          },
        },
      }),
    })

    if (res.ok) {
      const data = await res.json()
      const postUrl = `https://bsky.app/profile/${did}/post/${data.uri.split("/").pop()}`
      console.log(`✅ ${title.slice(0, 50)}... → ${postUrl}`)
    } else {
      console.error(`❌ ${title.slice(0, 50)}... → ${await res.text()}`)
    }

    // Small delay between posts
    await new Promise(r => setTimeout(r, 1000))
  }

  console.log("\n✓ All 8 articles published to Bluesky")
}

main().catch(console.error)
