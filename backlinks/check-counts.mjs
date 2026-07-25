// Verify backlink counts in generated HTML
import fs from "fs"

const ARTICLES = [
  "01-url-shortening-guide",
  "02-niche-industry-shorteners",
  "03-social-media-link-tools",
  "04-qr-code-generator-guide",
  "05-alternatives-comparison",
  "06-guides-tutorials",
  "07-advanced-features",
  "08-platform-shorteners",
]

const html = fs.readFileSync("backlinks/articles-linkedin.html", "utf-8")
let totalMd = 0
let totalHtml = 0

for (const a of ARTICLES) {
  const md = fs.readFileSync(`backlinks/${a}.md`, "utf-8")
  const mdCount = (md.match(/relurl\.com/g) || []).length
  totalMd += mdCount

  const start = html.indexOf(`article-num>${a}`)
  if (start >= 0) {
    const remaining = html.slice(start + 20)
    const next = remaining.indexOf("article-num>")
    const section = next >= 0 ? remaining.slice(0, next) : remaining
    const htmlCount = (section.match(/relurl\.com/g) || []).length
    totalHtml += htmlCount
    const status = mdCount === htmlCount ? "OK" : "MISMATCH"
    console.log(`${a}.md: md=${mdCount} html=${htmlCount} ${status}`)
  } else {
    console.log(`${a}: NOT FOUND in HTML`)
  }
}

console.log(`\nTotal: md=${totalMd} html=${totalHtml}`)
