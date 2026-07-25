// Delete old Bluesky posts and recreate with correct URLs
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const [handle, appPass] = "000yasminaton.bsky.social:6uz6-hzwd-p3fe-5iot".split(":")

// Old post rkeys (from previously published)
const OLD_RKEYS = [
  "3mrf4o27xbk2o", "3mrf4o3ey2a2l", "3mrf4o4jh652v", "3mrf4o5okdx2p",
  "3mrf4o6t2ck2o", "3mrf4o7x5y323", "3mrf4ob3srm2u", "3mrf4oca7oj25",
]

// Correct URLs mapping - each article links to a real landing page
const REAL_URLS = [
  "https://relurl.com/en/custom-url-shortener",
  "https://relurl.com/en/best-url-shortener",
  "https://relurl.com/en/url-shortener-for-social-media",
  "https://relurl.com/en/qr-code-generator",
  "https://relurl.com/en/bitly-alternative",
  "https://relurl.com/en/how-to-shorten-a-url",
  "https://relurl.com/en/password-protected-links",
  "https://relurl.com/en/url-shortener-no-signup",
]

const ARTICLES = [
  { file: "01-url-shortening-guide.md" },
  { file: "02-niche-industry-shorteners.md" },
  { file: "03-social-media-link-tools.md" },
  { file: "04-qr-code-generator-guide.md" },
  { file: "05-alternatives-comparison.md" },
  { file: "06-guides-tutorials.md" },
  { file: "07-advanced-features.md" },
  { file: "08-platform-shorteners.md" },
]

async function main() {
  // Authenticate
  const sessionRes = await fetch("https://bsky.social/xrpc/com.atproto.server.createSession", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: handle, password: appPass }),
  })
  if (!sessionRes.ok) { console.error("Auth failed", await sessionRes.text()); process.exit(1) }
  const { accessJwt, did } = await sessionRes.json()
  console.log("✓ Authenticated as", handle)

  // Delete old posts
  console.log("\n--- Deleting old posts ---")
  for (const rkey of OLD_RKEYS) {
    const delRes = await fetch("https://bsky.social/xrpc/com.atproto.repo.deleteRecord", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessJwt}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        repo: did,
        collection: "app.bsky.feed.post",
        rkey,
      }),
    })
    if (delRes.ok) console.log(`  ✗ Deleted post ${rkey}`)
    else console.error(`  ✗ Failed to delete ${rkey}: ${await delRes.text()}`)
    await new Promise(r => setTimeout(r, 500))
  }

  // Create new posts with correct URLs
  console.log("\n--- Creating new posts ---")
  for (let i = 0; i < ARTICLES.length; i++) {
    const filepath = path.join(__dirname, ARTICLES[i].file)
    const md = fs.readFileSync(filepath, "utf-8")
    const title = md.split("\n")[0].replace(/^#\s+/, "").trim()
    const correctUrl = REAL_URLS[i]
    const text = `${title}\n\n${correctUrl}`

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
            external: { uri: correctUrl, title, description: "RelURL URL Shortener Guide" },
          },
        },
      }),
    })

    if (res.ok) {
      const data = await res.json()
      const postUrl = `https://bsky.app/profile/${did}/post/${data.uri.split("/").pop()}`
      console.log(`  ✓ ${title.slice(0, 50)}... → ${correctUrl}`)
    } else {
      console.error(`  ✗ ${title.slice(0, 50)}... → ${await res.text()}`)
    }
    await new Promise(r => setTimeout(r, 1000))
  }

  console.log("\n✓ Done! Old posts deleted, new posts created with real URLs.")
}

main().catch(console.error)
