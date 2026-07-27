import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BASE = "https://just-paste.it"

const articles = [
  { file: "01-url-shortening-guide.md", tags: ["URL shortener", "link management"] },
  { file: "02-niche-industry-shorteners.md", tags: ["URL shortener", "business"] },
  { file: "03-social-media-link-tools.md", tags: ["social media", "URL shortener"] },
  { file: "04-qr-code-generator-guide.md", tags: ["QR code", "generator"] },
  { file: "05-alternatives-comparison.md", tags: ["Bitly", "TinyURL", "alternatives"] },
  { file: "06-guides-tutorials.md", tags: ["URL shortener", "tutorial"] },
  { file: "07-advanced-features.md", tags: ["URL shortener", "features"] },
  { file: "08-platform-shorteners.md", tags: ["URL shortener", "platform"] },
  { file: "09-link-analytics.md", tags: ["analytics", "link tracking"] },
  { file: "10-qr-marketing.md", tags: ["QR code", "marketing"] },
  { file: "11-branded-links.md", tags: ["branded links", "URL shortener"] },
  { file: "12-api-guide.md", tags: ["API", "URL shortener"] },
  { file: "13-education.md", tags: ["education", "URL shortener"] },
  { file: "14-real-estate.md", tags: ["real estate", "URL shortener"] },
  { file: "15-healthcare.md", tags: ["healthcare", "URL shortener"] },
  { file: "16-nonprofit.md", tags: ["nonprofit", "URL shortener"] },
  { file: "17-recruitment.md", tags: ["recruitment", "URL shortener"] },
  { file: "18-events.md", tags: ["events", "URL shortener"] },
  { file: "19-financial.md", tags: ["financial", "URL shortener"] },
  { file: "20-travel.md", tags: ["travel", "URL shortener"] },
  // batch2
  { file: "batch2-custom-short-domain.md", tags: ["custom domain", "URL shortener"] },
  { file: "batch2-qr-codes-small-business.md", tags: ["QR code", "small business"] },
  { file: "batch2-social-media-links.md", tags: ["social media", "links"] },
  { file: "batch2-restaurant-qr-codes.md", tags: ["QR code", "restaurant"] },
  { file: "batch2-email-marketing-links.md", tags: ["email marketing", "links"] },
  { file: "batch2-dynamic-vs-static-qr.md", tags: ["dynamic QR", "static QR"] },
  { file: "batch2-affiliate-link-tracking.md", tags: ["affiliate", "link tracking"] },
  { file: "batch2-browser-extension-links.md", tags: ["browser extension", "URL"] },
]

function mdToHtml(text) {
  // Remove {{REF}} placeholders
  text = text.replace(/^\{\{REF=platform-name\}\}\s*\n/gm, "").replace(/ref=\{\{REF\}\}/g, "ref=just-paste")
  const lines = text.split("\n")
  const title = lines[0].replace(/^#\s+/, "").trim()
  let body = lines.slice(1).join("\n")
  body = body
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br>")
  return { title, html: `<html><head><title>${title}</title></head><body><p>${body}</p></body></html>` }
}

async function publishOne(title, html) {
  const r = await fetch(BASE + "/documents", {
    method: "POST",
    headers: {"Content-Type": "text/plain"},
    body: html,
  })
  if (!r.ok) return { status: "error", error: await r.text() }
  const data = await r.json()
  return { status: "success", key: data.key, url: BASE + "/" + data.key + "/" }
}

let ok = 0, fail = 0
for (const article of articles) {
  const filepath = path.join(__dirname, article.file)
  if (!fs.existsSync(filepath)) { console.log("SKIP", article.file, "— not found"); continue }
  const content = fs.readFileSync(filepath, "utf-8")
  const { title, html } = mdToHtml(content)
  const result = await publishOne(title, html)
  if (result.status === "success") {
    ok++
    console.log("✓", title.slice(0, 50).padEnd(52), result.url)
  } else {
    fail++
    console.log("✗", title.slice(0, 50).padEnd(52), result.error)
  }
  await new Promise(r => setTimeout(r, 1000))
}
console.log(`\nDone: ${ok} OK, ${fail} FAIL`)
