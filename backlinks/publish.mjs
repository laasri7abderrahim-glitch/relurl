import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { createHash } from "crypto"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Import jsonwebtoken for Ghost/Discord if not available, use a simple fallback
let jsonwebtoken

try {
  jsonwebtoken = require("jsonwebtoken")
} catch (e) {
  console.log("   Note: 'jsonwebtoken' not available, using fallback for Ghost API")
  jsonwebtoken = null
}

// Auto-load .env file
try {
  const envPath = path.join(__dirname, ".env")
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8")
    for (const line of envContent.split("\n")) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith("#")) continue
      const eqIdx = trimmed.indexOf("=")
      if (eqIdx === -1) continue
      const key = trimmed.slice(0, eqIdx).trim()
      const val = trimmed.slice(eqIdx + 1).trim()
      if (!process.env[key]) process.env[key] = val
    }
  }
} catch (e) { /* ignore .env load errors */ }

// === CONFIGURATION ===
// Set these in a .env file OR pass as environment variables
// Helper: fetch with timeout and retry
async function fetchWithTimeout(url, options, timeoutMs = 15000, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), timeoutMs)
      const res = await fetch(url, { ...options, signal: controller.signal })
      clearTimeout(timer)
      return res
    } catch (e) {
      if (i === retries) throw e
      console.log(`   ⏳ Retry ${i + 1}/${retries} for ${url.split("/").slice(0, 3).join("/")}...`)
      await new Promise(r => setTimeout(r, 2000))
    }
  }
}

const CONFIG = {
  // Dev.to: get API key at https://dev.to/settings/extensions
  DEVTO_API_KEY: process.env.DEVTO_API_KEY || "",
  // LiveJournal: account credentials (username/password)
  LIVEJOURNAL_USERNAME: process.env.LIVEJOURNAL_USERNAME || "",
  LIVEJOURNAL_PASSWORD: process.env.LIVEJOURNAL_PASSWORD || "",
  // Hashnode: PAT at https://hashnode.com/settings/developer
  HASHNODE_TOKEN: process.env.HASHNODE_TOKEN || "",
  HASHNODE_PUBLICATION: process.env.HASHNODE_PUBLICATION || "",
  // Medium: Integration Token at https://medium.com/me/settings/security
  MEDIUM_TOKEN: process.env.MEDIUM_TOKEN || "",
  // WordPress: Application Password from Users > Application Passwords
  WORDPRESS_URL: process.env.WORDPRESS_URL || "",
  WORDPRESS_USER: process.env.WORDPRESS_USER || "",
  WORDPRESS_APP_PASS: process.env.WORDPRESS_APP_PASS || "",
  // Ghost: Admin API key from Ghost Admin > Integrations
  GHOST_URL: process.env.GHOST_URL || "",
  GHOST_ADMIN_KEY: process.env.GHOST_ADMIN_KEY || "",
  // Blogger: API key from Google Cloud Console
  BLOGGER_API_KEY: process.env.BLOGGER_API_KEY || "",
  BLOGGER_BLOG_ID: process.env.BLOGGER_BLOG_ID || "",
  // LinkedIn: OAuth access token
  LINKEDIN_TOKEN: process.env.LINKEDIN_TOKEN || "",
  // Bluesky: handle:app-password
  BLUESKY_AUTH: process.env.BLUESKY_AUTH || "",
  // Mastodon: instance:access_token
  MASTODON_AUTH: process.env.MASTODON_AUTH || "",
  // Telegram: bot_token:chat_id
  TELEGRAM_AUTH: process.env.TELEGRAM_AUTH || "",
  // Discord webhook URL
  DISCORD_WEBHOOK: process.env.DISCORD_WEBHOOK || "",
  // Scoop.it: API key from scoop.it
  SCOOPIT_KEY: process.env.SCOOPIT_KEY || "",
  // Write.as: no API key needed (anon posts), or get token from write.as/settings
  WRITEAS_TOKEN: process.env.WRITEAS_TOKEN || "",
  // Bear Blog: API key from bearblog.dev/dashboard
  BEARBLOG_KEY: process.env.BEARBLOG_KEY || "",
  // GitHub: PAT from github.com/settings/tokens (gist scope needed)
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || "",
  GITHUB_GIST_USER: process.env.GITHUB_GIST_USER || "",
  // WriteFreely: instance + token
  WRITEFREELY_INSTANCE: process.env.WRITEFREELY_INSTANCE || "",
  WRITEFREELY_TOKEN: process.env.WRITEFREELY_TOKEN || "",
  // Forem (other instances): url + api_key
  FOREM_URL: process.env.FOREM_URL || "",
  FOREM_API_KEY: process.env.FOREM_API_KEY || "",
  // ReadMe: API key from dash.readme.com/api/v1
  README_API_KEY: process.env.README_API_KEY || "",
  README_PROJECT: process.env.README_PROJECT || "",
  // GitBook: API token from gitbook.com/account/tokens
  GITBOOK_TOKEN: process.env.GITBOOK_TOKEN || "",
  GITBOOK_SPACE: process.env.GITBOOK_SPACE || "",
  // Buttons to skip when not configured
  DRY_RUN: process.env.DRY_RUN === "true",
}

// === ARTICLE FILES ===
// All articles (original 12 + batch2 8 = 20 total)
const ARTICLES = [
  { file: "01-url-shortening-guide.md", tags: ["url-shortener", "link-management", "marketing", "seo"] },
  { file: "02-niche-industry-shorteners.md", tags: ["business", "url-shortener", "saas", "ecommerce"] },
  { file: "03-social-media-link-tools.md", tags: ["social-media", "marketing", "tools", "url-shortener"] },
  { file: "04-qr-code-generator-guide.md", tags: ["qr-code", "marketing", "technology", "tools"] },
  { file: "05-alternatives-comparison.md", tags: ["comparison", "url-shortener", "bitly", "alternatives"] },
  { file: "06-guides-tutorials.md", tags: ["tutorial", "guide", "url-shortener", "how-to"] },
  { file: "07-advanced-features.md", tags: ["security", "link-management", "features", "enterprise"] },
  { file: "08-platform-shorteners.md", tags: ["productivity", "tools", "url-shortener", "automation"] },
  { file: "09-link-analytics.md", tags: ["analytics", "url-shortener", "marketing", "data"] },
  { file: "10-qr-marketing.md", tags: ["qr-code", "marketing", "branding", "tools"] },
  { file: "11-branded-links.md", tags: ["branding", "url-shortener", "marketing", "custom-domain"] },
  { file: "12-api-guide.md", tags: ["api", "url-shortener", "developer", "integration"] },
  // Batch 2 — 8 new articles
  { file: "batch2-qr-codes-small-business.md", tags: ["qr-code", "small-business", "marketing", "offline"] },
  { file: "batch2-custom-short-domain.md", tags: ["branding", "url-shortener", "custom-domain", "marketing"] },
  { file: "batch2-social-media-links.md", tags: ["social-media", "link-management", "marketing", "tools"] },
  { file: "batch2-restaurant-qr-codes.md", tags: ["qr-code", "restaurant", "marketing", "hospitality"] },
  { file: "batch2-email-marketing-links.md", tags: ["email-marketing", "url-shortener", "branding", "ctr"] },
  { file: "batch2-dynamic-vs-static-qr.md", tags: ["qr-code", "dynamic", "static", "marketing"] },
  { file: "batch2-affiliate-link-tracking.md", tags: ["affiliate", "url-shortener", "tracking", "marketing"] },
  { file: "batch2-browser-extension-links.md", tags: ["browser-extension", "url-shortener", "productivity", "tools"] },
]

// === PLATFORM PUBLISHERS ===

async function publishDevto(title, body, tags, canonicalUrl) {
  if (!CONFIG.DEVTO_API_KEY) return { platform: "Dev.to", status: "skipped", reason: "No API key" }
  const res = await fetch("https://dev.to/api/articles", {
    method: "POST",
    headers: { "api-key": CONFIG.DEVTO_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      article: {
        title,
        body_markdown: body,
        published: true,
        tags: tags.slice(0, 4).map(t => t.toLowerCase().replace(/[^a-z0-9]/g, "")),
        canonical_url: canonicalUrl,
      },
    }),
  })
  if (!res.ok) return { platform: "Dev.to", status: "error", error: await res.text() }
  const data = await res.json()
  return { platform: "Dev.to", status: "success", url: data.url }
}

async function publishHashnode(title, body, tags, canonicalUrl) {
  if (!CONFIG.HASHNODE_TOKEN) return { platform: "Hashnode", status: "skipped", reason: "No token" }
  const query = `mutation PublishPost($input: PublishPostInput!) { publishPost(input: $input) { post { url } } }`
  const input = {
    title,
    contentMarkdown: body,
    tags: tags.slice(0, 5).map(t => ({ slug: t, name: t })),
    publicationId: CONFIG.HASHNODE_PUBLICATION,
    settings: { canonicalUrl },
  }
  const res = await fetch("https://gql.hashnode.com", {
    method: "POST",
    headers: { Authorization: `Bearer ${CONFIG.HASHNODE_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { input } }),
  })
  if (!res.ok) return { platform: "Hashnode", status: "error", error: await res.text() }
  const data = await res.json()
  if (data.errors) return { platform: "Hashnode", status: "error", error: JSON.stringify(data.errors) }
  return { platform: "Hashnode", status: "success", url: data.data?.publishPost?.post?.url || "published" }
}

async function publishMedium(title, body, tags, canonicalUrl) {
  if (!CONFIG.MEDIUM_TOKEN) return { platform: "Medium", status: "skipped", reason: "No token" }
  // Get user ID
  const me = await fetch("https://api.medium.com/v1/me", {
    headers: { Authorization: `Bearer ${CONFIG.MEDIUM_TOKEN}` },
  })
  if (!me.ok) return { platform: "Medium", status: "error", error: "Auth failed - check token" }
  const { data: user } = await me.json()
  // Convert markdown to HTML
  const htmlBody = body
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\n\n/g, "</p><p>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/<\/li>\n<li>/g, "")
    .replace(/(<li>.*?<\/li>)/gs, "<ul>$1</ul>")
    .replace(/<\/ul>\n<ul>/g, "")
  const payload = { title, contentFormat: "html", content: `<p>${htmlBody}</p>`, tags: tags.slice(0, 5), canonicalUrl, publishStatus: "public" }
  const res = await fetch(`https://api.medium.com/v1/users/${user.id}/posts`, {
    method: "POST",
    headers: { Authorization: `Bearer ${CONFIG.MEDIUM_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) return { platform: "Medium", status: "error", error: await res.text() }
  const { data: post } = await res.json()
  return { platform: "Medium", status: "success", url: post.url }
}

async function publishWordPress(title, body, tags, canonicalUrl) {
  if (!CONFIG.WORDPRESS_URL) return { platform: "WordPress", status: "skipped", reason: "No URL" }
  const url = `${CONFIG.WORDPRESS_URL}/wp-json/wp/v2/posts`
  const auth = Buffer.from(`${CONFIG.WORDPRESS_USER}:${CONFIG.WORDPRESS_APP_PASS}`).toString("base64")
  const htmlBody = body
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\n\n/g, "\n\n")
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify({ title, content: htmlBody, status: "publish", tags: tags.join(",") }),
  })
  if (!res.ok) return { platform: "WordPress", status: "error", error: await res.text() }
  const data = await res.json()
  return { platform: "WordPress", status: "success", url: data.link }
}

async function publishGhost(title, body, tags, canonicalUrl) {
  if (!CONFIG.GHOST_URL || !CONFIG.GHOST_ADMIN_KEY) return { platform: "Ghost", status: "skipped", reason: "No config" }
  const [id, secret] = CONFIG.GHOST_ADMIN_KEY.split(":")
  if (!id || !secret) return { platform: "Ghost", status: "error", error: "Invalid key format" }
  const iat = Math.floor(Date.now() / 1000)
  const jwt = require("jsonwebtoken")?.sign({}, Buffer.from(secret, "hex"), { keyid: id, algorithm: "HS256", expiresIn: "5m", audience: "/admin/" })
  if (!jwt) return { platform: "Ghost", status: "skipped", reason: "Need 'jsonwebtoken' package" }
  const htmlBody = body
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  const res = await fetch(`${CONFIG.GHOST_URL}/ghost/api/admin/posts`, {
    method: "POST",
    headers: { Authorization: `Ghost ${jwt}`, "Content-Type": "application/json" },
    body: JSON.stringify({ posts: [{ title, html: htmlBody, status: "published", tags: tags.map(t => ({ name: t })) }] }),
  })
  if (!res.ok) return { platform: "Ghost", status: "error", error: await res.text() }
  const data = await res.json()
  return { platform: "Ghost", status: "success", url: data.posts?.[0]?.url || "published" }
}

async function publishLinkedIn(title, body, tags, canonicalUrl) {
  if (!CONFIG.LINKEDIN_TOKEN) return { platform: "LinkedIn", status: "skipped", reason: "No token" }
  const me = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: { Authorization: `Bearer ${CONFIG.LINKEDIN_TOKEN}` },
  })
  if (!me.ok) return { platform: "LinkedIn", status: "error", error: "Auth failed" }
  const { sub: person } = await me.json()
  const excerpt = body.replace(/[#*\[\]`>|_-]/g, "").slice(0, 300) + "..."
  const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: { Authorization: `Bearer ${CONFIG.LINKEDIN_TOKEN}`, "X-Restli-Protocol-Version": "2.0.0", "Content-Type": "application/json" },
    body: JSON.stringify({
      author: `urn:li:person:${person}`,
      lifecycleState: "PUBLISHED",
      specificContent: { "com.linkedin.ugc.ShareContent": { shareCommentary: { text: `${title}\n\n${excerpt}\n\n${canonicalUrl}` }, shareMediaCategory: "NONE" } },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
    }),
  })
  if (!res.ok) return { platform: "LinkedIn", status: "error", error: await res.text() }
  const id = await res.text()
  return { platform: "LinkedIn", status: "success", url: `https://linkedin.com/feed/update/${id.replace(/"/g, "")}` }
}

async function publishBluesky(title, body, tags, canonicalUrl) {
  if (!CONFIG.BLUESKY_AUTH) return { platform: "Bluesky", status: "skipped", reason: "No auth" }
  const [handle, appPass] = CONFIG.BLUESKY_AUTH.split(":")
  const session = await fetch("https://bsky.social/xrpc/com.atproto.server.createSession", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: handle, password: appPass }),
  })
  if (!session.ok) return { platform: "Bluesky", status: "error", error: "Auth failed" }
  const { accessJwt, did } = await session.json()
  const text = `${title}\n\n${canonicalUrl}`
  const res = await fetch("https://bsky.social/xrpc/com.atproto.repo.createRecord", {
    method: "POST", headers: { Authorization: `Bearer ${accessJwt}`, "Content-Type": "application/json" },
    body: JSON.stringify({ repo: did, collection: "app.bsky.feed.post", record: { $type: "app.bsky.feed.post", text, createdAt: new Date().toISOString(), embed: { $type: "app.bsky.embed.external", external: { uri: canonicalUrl, title, description: "RelURL URL Shortener Guide" } } } }),
  })
  if (!res.ok) return { platform: "Bluesky", status: "error", error: await res.text() }
  const data = await res.json()
  return { platform: "Bluesky", status: "success", url: `https://bsky.app/profile/${did}/post/${data.uri.split("/").pop()}` }
}

async function publishMastodon(title, body, tags, canonicalUrl) {
  if (!CONFIG.MASTODON_AUTH) return { platform: "Mastodon", status: "skipped", reason: "No auth" }
  const [instance, token] = CONFIG.MASTODON_AUTH.split(":")
  const text = `${title}\n\n${canonicalUrl}\n\n${tags.slice(0, 4).map(t => `#${t.replace(/[^a-z0-9]/gi, "")}`).join(" ")}`
  const res = await fetch(`https://${instance}/api/v1/statuses`, {
    method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ status: text, visibility: "public" }),
  })
  if (!res.ok) return { platform: "Mastodon", status: "error", error: await res.text() }
  const data = await res.json()
  return { platform: "Mastodon", status: "success", url: data.url || `https://${instance}/@${data.account?.acct || "user"}/${data.id}` }
}

async function publishTelegram(title, body, tags, canonicalUrl) {
  if (!CONFIG.TELEGRAM_AUTH) return { platform: "Telegram", status: "skipped", reason: "No auth" }
  const [botToken, chatId] = CONFIG.TELEGRAM_AUTH.split(":")
  const text = `<b>${title}</b>\n\n${body.replace(/[#*\[\]`>|_-]/g, "").slice(0, 300)}...\n\n${canonicalUrl}`
  const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: false }),
  })
  if (!res.ok) return { platform: "Telegram", status: "error", error: await res.text() }
  return { platform: "Telegram", status: "success", url: `https://t.me/c/${chatId.replace("-100", "")}` }
}

// Telegra.ph account token (created once, reused)
let telegraphToken = null

async function getTelegraphToken() {
  if (telegraphToken) return telegraphToken
  // Try to create a new account (this is a one-time thing)
  const res = await fetch("https://api.telegra.ph/createAccount", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      short_name: "RelURL",
      author_name: "RelURL URL Shortener",
      author_url: "https://relurl.com",
    }),
  })
  const data = await res.json()
  if (data.ok) {
    telegraphToken = data.result.access_token
    return telegraphToken
  }
  return null
}

async function publishTelegraph(title, body, tags, canonicalUrl) {
  try {
    const token = await getTelegraphToken()
    if (!token) return { platform: "Telegra.ph", status: "error", error: "Could not create account" }

    const htmlBody = body
      .replace(/^### (.+)$/gm, "<h3>$1</h3>")
      .replace(/^## (.+)$/gm, "<h2>$1</h2>")
      .replace(/^# (.+)$/gm, "<h1>$1</h1>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/\n\n/g, "</p><p>")
      .replace(/^- (.+)$/gm, "<li>$1</li>")
      .replace(/<\/li>\n<li>/g, "")
      .replace(/(<li>.*?<\/li>)/gs, "<ul>$1</ul>")
      .replace(/<\/ul>\n<ul>/g, "")
    const nodes = [{ tag: "p", children: [htmlBody] }]
    const res = await fetch("https://api.telegra.ph/createPage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_token: token,
        title,
        author_name: "RelURL",
        author_url: "https://relurl.com",
        content: JSON.stringify(nodes),
      }),
    })
    const data = await res.json()
    if (!data.ok) return { platform: "Telegra.ph", status: "error", error: data.error || "unknown" }
    return { platform: "Telegra.ph", status: "success", url: data.result.url }
  } catch (e) {
    return { platform: "Telegra.ph", status: "error", error: e.message }
  }
}

async function publishScoopit(title, body, tags, canonicalUrl) {
  if (!CONFIG.SCOOPIT_KEY) return { platform: "Scoop.it", status: "skipped", reason: "No API key" }
  const excerpt = body.replace(/[#*\[\]`>|_-]/g, "").slice(0, 500)
  const res = await fetch("https://api.scoop.it/2/scoops", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apiKey: CONFIG.SCOOPIT_KEY,
      title,
      content: excerpt,
      url: canonicalUrl,
      topic: tags[0] || "marketing",
    }),
  })
  if (!res.ok) return { platform: "Scoop.it", status: "error", error: await res.text() }
  return { platform: "Scoop.it", status: "success", url: `https://scoop.it/t/${tags[0] || "marketing"}` }
}

async function publishDiscord(title, body, tags, canonicalUrl) {
  if (!CONFIG.DISCORD_WEBHOOK) return { platform: "Discord", status: "skipped", reason: "No webhook" }
  const embed = { title, url: canonicalUrl, description: body.replace(/[#*\[\]`>|_-]/g, "").slice(0, 400), color: 0x00aaff, fields: [{ name: "Tags", value: tags.slice(0, 5).join(", "), inline: true }] }
  const res = await fetch(CONFIG.DISCORD_WEBHOOK, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: `📝 **New article published**`, embeds: [embed] }),
  })
  if (!res.ok) return { platform: "Discord", status: "error", error: await res.text() }
  return { platform: "Discord", status: "success", url: "sent" }
}

// === NEW PLATFORM PUBLISHERS ===

async function publishWriteas(title, body, tags, canonicalUrl) {
  if (!CONFIG.WRITEAS_TOKEN && !CONFIG.DRY_RUN) {
    // Can publish anonymously, but token gives you ownership
  }
  const payload = { title, body }
  if (CONFIG.WRITEAS_TOKEN) payload.token = CONFIG.WRITEAS_TOKEN
  const res = await fetchWithTimeout("https://write.as/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }, 8000, 1)
  if (!res.ok) return { platform: "Write.as", status: "error", error: await res.text() }
  const data = await res.json()
  if (data.code !== 201) return { platform: "Write.as", status: "error", error: JSON.stringify(data) }
  return { platform: "Write.as", status: "success", url: data.data.url }
}

async function publishJustPasteIt(title, body, tags, canonicalUrl) {
  // JustPaste.it — DA ~89, dofollow, no auth needed for anonymous pastes
  const html = body
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br>")
  const payload = `<html><head><title>${title}</title></head><body><p>${html}</p></body></html>`
  try {
    const res = await fetch("https://just-paste.it/documents", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: payload,
    })
    if (!res.ok) return { platform: "JustPaste.it", status: "error", error: await res.text() }
    const data = await res.json()
    return { platform: "JustPaste.it", status: "success", url: `https://justpaste.it/${data.key}` }
  } catch (e) {
    return { platform: "JustPaste.it", status: "error", error: e.message }
  }
}

async function publishBearBlog(title, body, tags, canonicalUrl) {
  if (!CONFIG.BEARBLOG_KEY) return { platform: "Bear Blog", status: "skipped", reason: "No API key" }
  const htmlBody = body
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\n\n/g, "</p><p>")
  const res = await fetch("https://bearblog.dev/api/posts/", {
    method: "POST",
    headers: { Authorization: `Token ${CONFIG.BEARBLOG_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ title, content: htmlBody, tags: tags.join(", "), publish: true }),
  })
  if (!res.ok) return { platform: "Bear Blog", status: "error", error: await res.text() }
  const data = await res.json()
  return { platform: "Bear Blog", status: "success", url: data.url }
}

async function publishGitHubGist(title, body, tags, canonicalUrl) {
  if (!CONFIG.GITHUB_TOKEN) return { platform: "GitHub Gist", status: "skipped", reason: "No token" }
  const desc = `${title} — RelURL URL Shortener Guide`
  const filename = `${title.replace(/[^a-z0-9]/gi, "-").toLowerCase().slice(0, 40)}.md`
  const footer = `\n\n---\n*Originally published at [RelURL](${canonicalUrl})*`
  const res = await fetch("https://api.github.com/gists", {
    method: "POST",
    headers: { Authorization: `Bearer ${CONFIG.GITHUB_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      description: desc,
      public: true,
      files: { [filename]: { content: body + footer } },
    }),
  })
  if (!res.ok) return { platform: "GitHub Gist", status: "error", error: await res.text() }
  const data = await res.json()
  return { platform: "GitHub Gist", status: "success", url: data.html_url }
}

async function publishWriteFreely(title, body, tags, canonicalUrl) {
  if (!CONFIG.WRITEFREELY_INSTANCE) return { platform: "WriteFreely", status: "skipped", reason: "No instance" }
  const headers = { "Content-Type": "application/json" }
  if (CONFIG.WRITEFREELY_TOKEN) headers.Authorization = `Token ${CONFIG.WRITEFREELY_TOKEN}`
  const res = await fetch(`${CONFIG.WRITEFREELY_INSTANCE}/api/posts`, {
    method: "POST",
    headers,
    body: JSON.stringify({ title, body }),
  })
  if (!res.ok) return { platform: "WriteFreely", status: "error", error: await res.text() }
  const data = await res.json()
  if (data.code !== 201) return { platform: "WriteFreely", status: "error", error: JSON.stringify(data) }
  return { platform: "WriteFreely", status: "success", url: data.data.url }
}

async function publishForem(title, body, tags, canonicalUrl) {
  if (!CONFIG.FOREM_URL || !CONFIG.FOREM_API_KEY) return { platform: "Forem", status: "skipped", reason: "No config" }
  const res = await fetch(`${CONFIG.FOREM_URL}/api/articles`, {
    method: "POST",
    headers: { "api-key": CONFIG.FOREM_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      article: {
        title,
        body_markdown: body,
        published: true,
        tags: tags.slice(0, 4).map(t => t.toLowerCase().replace(/[^a-z0-9]/g, "")),
        canonical_url: canonicalUrl,
      },
    }),
  })
  if (!res.ok) return { platform: "Forem", status: "error", error: await res.text() }
  const data = await res.json()
  return { platform: "Forem", status: "success", url: data.url }
}

async function publishReadMe(title, body, tags, canonicalUrl) {
  if (!CONFIG.README_API_KEY) return { platform: "ReadMe", status: "skipped", reason: "No API key" }
  const htmlBody = body
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\n\n/g, "\n\n")
  const auth = Buffer.from(CONFIG.README_API_KEY + ":").toString("base64")
  const res = await fetch("https://dash.readme.com/api/v1/guides", {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      body: htmlBody,
      type: "basic",
      hidden: false,
      categorySlug: CONFIG.README_PROJECT || "guides",
    }),
  })
  if (!res.ok) return { platform: "ReadMe", status: "error", error: await res.text() }
  const data = await res.json()
  return { platform: "ReadMe", status: "success", url: `https://${CONFIG.README_PROJECT || "docs"}.readme.io/docs/${data.slug}` }
}

async function publishBlogger(title, body, tags, canonicalUrl) {
  if (!CONFIG.BLOGGER_API_KEY || !CONFIG.BLOGGER_BLOG_ID) return { platform: "Blogger", status: "skipped", reason: "No config" }
  // Blogger v3 POST requires OAuth 2.0 token, not just API key.
  // API key alone only allows reading. To post, generate an OAuth token.
  // See: manual-publish.md for manual steps, or provide GCP OAuth token.
  const htmlBody = body
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\n\n/g, "\n\n")
  try {
    // Try with Bearer token (if user provides an OAuth token in the API key field)
    const res = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${CONFIG.BLOGGER_BLOG_ID}/posts/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${CONFIG.BLOGGER_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ title, content: htmlBody, labels: tags.slice(0, 10) }),
    })
    if (res.ok) {
      const data = await res.json()
      return { platform: "Blogger", status: "success", url: data.url }
    }
    return { platform: "Blogger", status: "error", error: await res.text() }
  } catch (e) {
    return { platform: "Blogger", status: "error", error: e.message }
  }
}

async function publishGitBook(title, body, tags, canonicalUrl) {
  if (!CONFIG.GITBOOK_TOKEN || !CONFIG.GITBOOK_SPACE) return { platform: "GitBook", status: "skipped", reason: "No config" }
  const res = await fetch(`https://api.gitbook.com/v1/spaces/${CONFIG.GITBOOK_SPACE}/content`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${CONFIG.GITBOOK_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      page: { title, body, kind: "page" },
    }),
  })
  // GitBook API returns 200 but page creation may need specific structure
  // Fallback: try creating via the documents endpoint
  if (res.ok) {
    const data = await res.json()
    return { platform: "GitBook", status: "success", url: `https://app.gitbook.com/s/${CONFIG.GITBOOK_SPACE}` }
  }
  return { platform: "GitBook", status: "error", error: await res.text() }
}

async function publishRentry(title, body, tags, canonicalUrl) {
  // Rentry.co — DA ~55, dofollow (rel=""), no auth, anonymous markdown pastebin
  // API: POST /api/new with form-urlencoded {text, edit_code(optional)}
  // Returns: {status, url, url_short, edit_code}
  const editCode = `relurl-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
  try {
    const res = await fetch("https://rentry.co/api/new", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        text: body + `\n\n---\n*Originally published at [RelURL](${canonicalUrl})*`,
        edit_code: editCode,
      }),
    })
    if (!res.ok) return { platform: "Rentry.co", status: "error", error: await res.text() }
    const data = await res.json()
    if (data.status !== "200") return { platform: "Rentry.co", status: "error", error: data.content || data.errors }
    return { platform: "Rentry.co", status: "success", url: data.url }
  } catch (e) {
    return { platform: "Rentry.co", status: "error", error: e.message }
  }
}

async function publishNonograph(title, body, tags, canonicalUrl) {
  // Nonogra.ph — Telegra.ph clone with CSRF protection
  // Links have rel="noopener noreferrer" but NOT nofollow (dofollow equity passes)
  try {
    // Step 1: GET homepage to extract CSRF token
    const homeRes = await fetch("https://nonogra.ph", {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; RelURL/1.0)" },
    })
    const html = await homeRes.text()
    const csrfMatch = html.match(/name="csrf_token"\s+value="([^"]+)"/)
    if (!csrfMatch) return { platform: "Nonogra.ph", status: "error", error: "Could not find CSRF token" }
    const csrfToken = csrfMatch[1]

    // Step 2: Build article title from first heading in body
    const firstLine = body.split("\n")[0].replace(/^#\s+/, "").trim()
    const articleTitle = title || firstLine
    
    // Ensure slug is unique and within reasonable length (alias should be < 64 chars)
    const timestamp = Date.now().toString(36)
    const slug = (
      articleTitle
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 50) +
      "-" +
      timestamp.slice(0, 10)
    ).slice(0, 60)

    // Convert markdown to simple HTML
    let htmlBody = body
      .replace(/^### (.+)$/gm, "<h3>$1</h3>")
      .replace(/^## (.+)$/gm, "<h2>$1</h2>")
      .replace(/^# (.+)$/gm, "<h1>$1</h1>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/\n\n/g, "</p><p>")
      .replace(/\n/g, "<br>")

    const formBody = new URLSearchParams({
      title: articleTitle,
      alias: slug,
      content: `<p>${htmlBody}</p>`,
      csrf_token: csrfToken,
    })

    const res = await fetch("https://nonogra.ph/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (compatible; RelURL/1.0)",
        Referer: "https://nonogra.ph/",
      },
      body: formBody,
      redirect: "manual",
    })

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get("location")
      let url = location?.startsWith("http") ? location : `https://nonogra.ph${location || ""}`
      // Fix URL format - ensure it uses proper path
      if (url.includes('https://nonogra.ph/?error=')) {
        return { platform: "Nonogra.ph", status: "error", error: `URL generation failed: ${url}` }
      }
      if (!url.includes('/')) url = `https://nonogra.ph/${slug}/`
      return { platform: "Nonogra.ph", status: "success", url }
    }
    const text = await res.text()
    return { platform: "Nonogra.ph", status: "error", error: `HTTP ${res.status}: ${text.slice(0, 200)}` }
  } catch (e) {
    return { platform: "Nonogra.ph", status: "error", error: e.message }
  }
}

async function publishLiveJournal(title, body, tags, canonicalUrl) {
  if (!CONFIG.LIVEJOURNAL_USERNAME || !CONFIG.LIVEJOURNAL_PASSWORD) {
    return { platform: "LiveJournal", status: "skipped", reason: "No credentials" }
  }
  const htmlBody = body
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br>")
  const now = new Date()
  const xml = `<?xml version="1.0"?>
<methodCall>
  <methodName>LJ.XMLRPC.postevent</methodName>
  <params>
    <param><value><struct>
      <member><name>username</name><value><string>${CONFIG.LIVEJOURNAL_USERNAME}</string></value></member>
      <member><name>password</name><value><string>${CONFIG.LIVEJOURNAL_PASSWORD}</string></value></member>
      <member><name>subject</name><value><string>${title}</string></value></member>
      <member><name>event</name><value><string><![CDATA[${htmlBody}]]></string></value></member>
      <member><name>lineendings</name><value><string>unix</string></value></member>
      <member><name>year</name><value><int>${now.getFullYear()}</int></value></member>
      <member><name>mon</name><value><int>${now.getMonth() + 1}</int></value></member>
      <member><name>day</name><value><int>${now.getDate()}</int></value></member>
    </struct></value></param>
  </params>
</methodCall>`
  try {
    const res = await fetch("https://www.livejournal.com/interface/xmlrpc", {
      method: "POST",
      headers: { "Content-Type": "text/xml" },
      body: xml,
    })
    const text = await res.text()
    if (text.includes("<fault>")) {
      const match = text.match(/<string>([^<]*)<\/string>/)
      return { platform: "LiveJournal", status: "error", error: match ? match[1] : text.slice(0, 200) }
    }
    const urlMatch = text.match(/https?:\/\/[^<]*/)
    return {
      platform: "LiveJournal",
      status: "success",
      url: urlMatch ? urlMatch[0] : `https://${CONFIG.LIVEJOURNAL_USERNAME}.livejournal.com`,
    }
  } catch (e) {
    return { platform: "LiveJournal", status: "error", error: e.message }
  }
}

// === MAIN ===

async function main() {
  console.log("=== Multi-Platform Publisher ===\n")

  // DOFOLLOW platforms first (pass link equity)
  // NOFOLLOW platforms second (brand visibility)
  const publishers = [
    // Dofollow article platforms
    publishDevto, publishTelegraph, publishJustPasteIt, publishRentry,
    publishNonograph, publishWordPress,
    publishGhost, publishScoopit, publishLiveJournal,
    publishWriteas, publishBearBlog, publishBlogger,
    publishWriteFreely, publishForem,
    publishReadMe, publishGitBook,
    // Nofollow / social platforms
    publishHashnode, publishMedium, publishLinkedIn,
    publishBluesky, publishMastodon,
    publishTelegram, publishDiscord,
    // Utility
    publishGitHubGist,
  ]

  for (const [idx, article] of ARTICLES.entries()) {
    const filepath = path.join(__dirname, article.file)
    if (!fs.existsSync(filepath)) { console.log(`SKIP ${article.file} — not found`); continue }
    let content = fs.readFileSync(filepath, "utf-8")
    // Strip {{REF}} placeholders for automated publishing
    content = content.replace(/^\{\{REF=platform-name\}\}\s*\n/gm, "").replace(/ref=\{\{REF\}\}/g, "ref=auto")
    // Append ref=auto to plain URLs in the links section that don't have ref yet
    const lines = content.split("\n")
    const title = lines[0].replace(/^#\s+/, "").trim()
    const canonicalUrl = `https://relurl.com/en/${article.file.replace(/^\d+-/, "").replace(/\.md$/, "")}`

    console.log(`\n── [${idx + 1}/${ARTICLES.length}] ${title} ──`)
    console.log(`   Canonical: ${canonicalUrl}`)

    if (CONFIG.DRY_RUN) {
      console.log("   DRY RUN — skipping publish")
      console.log(`   Content length: ${content.length} chars, ${content.split(/\n/).length} lines`)
      continue
    }

    // Stagger publishers to avoid rate limits
    const results = []
    for (const p of publishers) {
      let r
      try {
        r = await p(title, content, article.tags, canonicalUrl)
      } catch (e) {
        r = { platform: p.name?.replace(/^publish/, "") || "Unknown", status: "error", error: e.message }
      }
      results.push(r)
      const icon = r.status === "success" ? "✅" : r.status === "skipped" ? "⏭️" : "❌"
      const url = r.url || ""
      const reason = r.reason || r.error || ""
      console.log(`   ${icon} ${r.platform}: ${r.status} ${url ? url : reason}`)
      // Small delay between platforms to avoid rate limiting
      await new Promise(r => setTimeout(r, 500))
    }

    // Longer delay between articles
    if (idx < ARTICLES.length - 1) {
      console.log(`   ⏳ Waiting 10s before next article...`)
      await new Promise(r => setTimeout(r, 10000))
    }
  }

  console.log("\n=== Done ===")
}

main().catch(console.error)
