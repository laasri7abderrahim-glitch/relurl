// Generate platform-specific HTML files for manual publishing
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const ARTICLES = [
  "01-url-shortening-guide.md",
  "02-niche-industry-shorteners.md",
  "03-social-media-link-tools.md",
  "04-qr-code-generator-guide.md",
  "05-alternatives-comparison.md",
  "06-guides-tutorials.md",
  "07-advanced-features.md",
  "08-platform-shorteners.md",
]

function mdToHtml(md) {
  const lines = md.split("\n")
  const out = []
  let inList = false

  for (const raw of lines) {
    const line = raw.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')

    if (line.startsWith("### ")) {
      if (inList) { out.push("</ul>"); inList = false }
      out.push(`<h3>${line.slice(4)}</h3>`)
    } else if (line.startsWith("## ")) {
      if (inList) { out.push("</ul>"); inList = false }
      out.push(`<h2>${line.slice(3)}</h2>`)
    } else if (line.startsWith("# ")) {
      if (inList) { out.push("</ul>"); inList = false }
      out.push(`<h1>${line.slice(2)}</h1>`)
    } else if (line.startsWith("- ")) {
      if (!inList) { out.push("<ul>"); inList = true }
      out.push(`<li>${line.slice(2)}</li>`)
    } else if (line.startsWith("---")) {
      if (inList) { out.push("</ul>"); inList = false }
      out.push("<hr>")
    } else if (line.trim() === "") {
      if (inList) { out.push("</ul>"); inList = false }
    } else {
      if (inList) { out.push("</ul>"); inList = false }
      out.push(`<p>${line}</p>`)
    }
  }
  if (inList) out.push("</ul>")

  return out.join("\n")
}

function changeRef(md, platform) {
  return md.replace(/\?ref=hackernoon\.com/g, `?ref=${platform}`)
}

const platforms = {
  linkedin: {
    label: "LinkedIn Articles (DA 98)",
    ref: "linkedin",
    intro: "Open this file in a browser → copy rendered article content → paste into LinkedIn article editor (rich text paste works). Each article has its own box.",
  },
  blogger: {
    label: "Blogger (DA 89)",
    ref: "blogger",
    intro: "Open in browser → copy rendered content → paste into Blogger's HTML editor tab (not Compose).",
  },
  wordpress: {
    label: "WordPress.com (DA 92)",
    ref: "wordpress-com",
    intro: "Open in browser → copy → paste into WordPress custom HTML block or Classic editor.",
  },
}

for (const [key, platform] of Object.entries(platforms)) {
  const sections = [`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>RelURL Articles — ${platform.label}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; background: #f3f4f6; color: #111827; line-height: 1.6; }
  .instructions { background: #eff6ff; border: 1px solid #93c5fd; border-radius: 8px; padding: 20px; margin-bottom: 30px; }
  .instructions h2 { margin-top: 0; color: #1e40af; }
  .article-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,.08); }
  h1 { font-size: 24px; color: #1a56db; margin: 0 0 8px 0; }
  h2 { font-size: 20px; color: #111827; margin: 20px 0 8px 0; }
  h3 { font-size: 17px; color: #374151; margin: 16px 0 6px 0; }
  p { margin: 0 0 12px 0; }
  ul { margin: 0 0 12px 0; padding-left: 24px; }
  li { margin-bottom: 4px; }
  a { color: #2563eb; text-decoration: none; }
  a:hover { text-decoration: underline; }
  hr { border: none; border-top: 2px solid #e5e7eb; margin: 24px 0; }
  .article-num { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
</style>
</head>
<body>
<div class="instructions">
  <h2>${platform.label}</h2>
  <p>${platform.intro}</p>
  <p><strong>8 articles · ${platform.ref === "linkedin" ? "linkedin" : platform.ref} backlink source · Copy each article separately</strong></p>
</div>`]

  for (const article of ARTICLES) {
    const filepath = path.join(__dirname, article)
    if (!fs.existsSync(filepath)) continue
    let md = fs.readFileSync(filepath, "utf-8")
    const title = md.split("\n")[0].replace(/^#\s+/, "").trim()
    md = changeRef(md, platform.ref)
    const html = mdToHtml(md)
    sections.push(`<div class="article-card"><div class="article-num">${article.replace(/\.md$/, "")}</div>`)
    sections.push(html)
    sections.push(`</div>`)
  }

  sections.push(`</body></html>`)
  const outPath = path.join(__dirname, `articles-${key}.html`)
  fs.writeFileSync(outPath, sections.join("\n"), "utf-8")
  console.log(`✓ Generated: articles-${key}.html (${platform.label})`)
}

console.log("\nDone! Open these HTML files in a browser, copy content, and paste into each platform.")
