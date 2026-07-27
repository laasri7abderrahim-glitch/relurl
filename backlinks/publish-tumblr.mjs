import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import crypto from "crypto"
import OAuth from "oauth-1.0a"
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Auto-load .env file
try {
  const envPath = path.join(__dirname, ".env")
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith("#")) continue
      const eqIdx = trimmed.indexOf("=")
      if (eqIdx === -1) continue
      const key = trimmed.slice(0, eqIdx).trim()
      const val = trimmed.slice(eqIdx + 1).trim()
      if (!process.env[key]) process.env[key] = val
    }
  }
} catch {}

const CONSUMER_KEY = process.env.TUMBLR_CONSUMER_KEY || "J4eEhh99OUiPznQYdyK4WPIXQBBOfQ50pQ5BBDA729gVMGUEtr"
const CONSUMER_SECRET = process.env.TUMBLR_CONSUMER_SECRET || "QgEGac78ulWPBeJN39beIl8eqcKGwWLbZexCeSCMFzoV1tiu4g"
let ACCESS_TOKEN = process.env.TUMBLR_ACCESS_TOKEN || ""
let ACCESS_TOKEN_SECRET = process.env.TUMBLR_ACCESS_TOKEN_SECRET || ""
const BLOG = process.env.TUMBLR_BLOG || "relurl.tumblr.com"

const oauth = new OAuth({
  consumer: { key: CONSUMER_KEY, secret: CONSUMER_SECRET },
  signature_method: "HMAC-SHA1",
  hash_function(base_string, key) {
    return crypto.createHmac("sha1", key).update(base_string).digest("base64")
  },
})

const ARTICLES = [
  { file: "01-url-shortening-guide.md", tags: ["url shortener", "link management", "marketing", "seo"] },
  { file: "02-niche-industry-shorteners.md", tags: ["business", "url shortener", "saas", "ecommerce"] },
  { file: "03-social-media-link-tools.md", tags: ["social media", "marketing", "tools", "url shortener"] },
  { file: "04-qr-code-generator-guide.md", tags: ["qr code", "marketing", "technology", "tools"] },
  { file: "05-alternatives-comparison.md", tags: ["comparison", "url shortener", "bitly", "alternatives"] },
  { file: "06-guides-tutorials.md", tags: ["tutorial", "guide", "url shortener", "how to"] },
  { file: "07-advanced-features.md", tags: ["security", "link management", "features", "enterprise"] },
  { file: "08-platform-shorteners.md", tags: ["productivity", "tools", "url shortener", "automation"] },
  { file: "09-link-analytics.md", tags: ["analytics", "url shortener", "marketing", "data"] },
  { file: "10-qr-marketing.md", tags: ["qr code", "marketing", "branding", "tools"] },
  { file: "11-branded-links.md", tags: ["branding", "url shortener", "marketing", "custom domain"] },
  { file: "12-api-guide.md", tags: ["api", "url shortener", "developer", "integration"] },
  { file: "batch2-qr-codes-small-business.md", tags: ["qr code", "small business", "marketing", "offline"] },
  { file: "batch2-custom-short-domain.md", tags: ["branding", "url shortener", "custom domain", "marketing"] },
  { file: "batch2-social-media-links.md", tags: ["social media", "link management", "marketing", "tools"] },
  { file: "batch2-restaurant-qr-codes.md", tags: ["qr code", "restaurant", "marketing", "hospitality"] },
  { file: "batch2-email-marketing-links.md", tags: ["email marketing", "url shortener", "branding", "ctr"] },
  { file: "batch2-dynamic-vs-static-qr.md", tags: ["qr code", "dynamic", "static", "marketing"] },
  { file: "batch2-affiliate-link-tracking.md", tags: ["affiliate", "url shortener", "tracking", "marketing"] },
  { file: "batch2-browser-extension-links.md", tags: ["browser extension", "url shortener", "productivity", "tools"] },
]

function mdToHtml(md) {
  return md
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h2>$1</h2>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*?<\/li>)/gs, "<ul>$1</ul>")
    .replace(/<\/ul>\n<ul>/g, "")
    .replace(/\n$/, "")
}

async function oauthFetch(url, method, bodyParams = {}, token = null) {
  const requestData = { url, method, data: bodyParams }
  const oauthParams = oauth.authorize(requestData, token)
  const header = oauth.toHeader(oauthParams)
  const options = {
    method,
    headers: {
      ...header,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  }
  if (Object.keys(bodyParams).length > 0) {
    options.body = new URLSearchParams(bodyParams).toString()
  }
  const res = await fetch(url, options)
  const text = await res.text()
  return { res, text }
}

async function getAccessToken() {
  console.log("\n=== Tumblr OAuth Setup ===")

  // Step 1: Get request token with web callback
  console.log("\n1. Getting request token...")
  const { res: reqRes, text: reqText } = await oauthFetch(
    "https://www.tumblr.com/oauth/request_token",
    "POST",
    { oauth_callback: "https://relurl.com/en/tumblr-auth" }
  )
  if (!reqRes.ok) {
    console.error("Failed to get request token:", reqRes.status, reqText)
    process.exit(1)
  }
  const reqParams = Object.fromEntries(new URLSearchParams(reqText))
  const requestToken = reqParams.oauth_token
  const requestTokenSecret = reqParams.oauth_token_secret
  console.log("✓ Request token obtained")

  // Step 2: User authorizes
  const authUrl = `https://www.tumblr.com/oauth/authorize?oauth_token=${requestToken}`
  console.log(`\n2. Visit this URL in your browser:`)
  console.log(`   ${authUrl}`)
  console.log(`\n   Log in if needed, click "Allow".`)
  console.log(`   You'll be redirected to https://relurl.com/en/tumblr-auth`)
  console.log(`   Copy the verifier code shown on that page.`)

  const { createInterface } = await import("readline")
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  const oauthVerifier = await new Promise((resolve) => {
    rl.question("\n3. Paste the verifier code here: ", (answer) => {
      rl.close()
      resolve(answer.trim())
    })
  })

  // Step 4: Exchange for access token
  console.log("\n4. Exchanging for access token...")
  const reqToken = { key: requestToken, secret: requestTokenSecret }
  const { res: accRes, text: accText } = await oauthFetch(
    "https://www.tumblr.com/oauth/access_token",
    "POST",
    { oauth_verifier: oauthVerifier },
    reqToken
  )
  if (!accRes.ok) {
    console.error("Failed to get access token:", accRes.status, accText)
    process.exit(1)
  }
  const accParams = Object.fromEntries(new URLSearchParams(accText))
  const accessToken = accParams.oauth_token
  const accessTokenSecret = accParams.oauth_token_secret

  console.log("✓ Access token obtained!")

  // Save to .env
  const envPath = path.join(__dirname, ".env")
  let env = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf-8") : ""
  if (!env.includes("TUMBLR_ACCESS_TOKEN")) {
    env += `\nTUMBLR_ACCESS_TOKEN=${accessToken}\nTUMBLR_ACCESS_TOKEN_SECRET=${accessTokenSecret}\n`
    fs.writeFileSync(envPath, env)
    console.log("✓ Saved to backlinks/.env")
  }

  return { key: accessToken, secret: accessTokenSecret }
}

async function publishToTumblr(title, bodyHtml, tags, canonicalUrl, token) {
  const bodyParams = {
    type: "text",
    title,
    body: bodyHtml,
    tags: tags.join(","),
    source_url: canonicalUrl,
  }

  const { res, text } = await oauthFetch(
    `https://api.tumblr.com/v2/blog/${BLOG}/post`,
    "POST",
    bodyParams,
    token
  )

  if (res.ok) {
    const data = JSON.parse(text)
    const postId = data.response?.id
    return { success: true, url: `https://${BLOG}/post/${postId}` }
  }
  return { success: false, error: `${res.status}: ${text.slice(0, 200)}` }
}

async function main() {
  // Get or setup access token
  let token
  if (ACCESS_TOKEN && ACCESS_TOKEN_SECRET) {
    token = { key: ACCESS_TOKEN, secret: ACCESS_TOKEN_SECRET }
    console.log("✓ Using stored Tumblr access token")
  } else {
    token = await getAccessToken()
  }

  // Verify token by fetching blog info
  console.log("\nVerifying access...")
  const { res: infoRes, text: infoText } = await oauthFetch(
    `https://api.tumblr.com/v2/blog/${BLOG}/info`,
    "GET",
    {},
    token
  )
  if (!infoRes.ok) {
    console.error("Auth failed:", infoRes.status, infoText.slice(0, 300))
    process.exit(1)
  }
  const info = JSON.parse(infoText)
  console.log(`✓ Authenticated as blog: ${info.response?.blog?.title || BLOG}`)

  // Publish articles
  console.log(`\nPublishing ${ARTICLES.length} articles to ${BLOG}...\n`)
  let ok = 0, fail = 0

  for (const article of ARTICLES) {
    const filepath = path.join(__dirname, article.file)
    if (!fs.existsSync(filepath)) {
      console.log(`⚠  File not found: ${article.file} (skipping)`)
      continue
    }
    const md = fs.readFileSync(filepath, "utf-8")
    const title = md.split("\n")[0].replace(/^#\s+/, "").trim()
    const slug = article.file.replace(/^\d+-/, "").replace(/\.md$/, "").replace(/^batch2-/, "")
    const canonicalUrl = `https://relurl.com/en/${slug}`
    const bodyHtml = `<p>${mdToHtml(md)}</p>`

    process.stdout.write(`  ${title.slice(0, 50).padEnd(52)}`)
    const result = await publishToTumblr(title, bodyHtml, article.tags, canonicalUrl, token)

    if (result.success) {
      console.log(`✅ ${result.url}`)
      ok++
    } else {
      console.log(`❌ ${result.error}`)
      fail++
    }

    await new Promise((r) => setTimeout(r, 2000))
  }

  console.log(`\n✓ Done: ${ok} published, ${fail} failed`)
}

main().catch(console.error)
