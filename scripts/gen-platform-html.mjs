import fs from "fs"
import path from "path"

const OUT = path.join(import.meta.dirname, "..", "backlinks")

// R E A D  all batch2 markdown files
const files = fs.readdirSync(OUT).filter(f => f.startsWith("batch2-") && f.endsWith(".md"))
const articles = files.map(f => {
  const raw = fs.readFileSync(path.join(OUT, f), "utf8")
  const lines = raw.split("\n")
  const title = lines[0].replace(/^#\s*/, "").trim()
  const contentLines = lines.slice(2).filter(l => !l.startsWith("---") && !l.startsWith("*Links:") && !l.startsWith("{{REF"))
  const body = contentLines.join("\n").trim()
  return { title, body, file: f }
})

function toHtml(articles, ref) {
  return articles.map((a, i) => {
    const body = a.body
      .replace(/\{\{REF=platform-name\}\}/g, `ref=${ref}`)
      .replace(/ref=\{\{REF\}\}/g, `ref=${ref}`)
    return `<!-- ARTICLE ${i + 1} --><article>
<h2>${a.title}</h2>
<p>${body.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>
</article>`
  }).join("\n\n")
}

// Platform-specific HTML files
const platforms = [
  { name: "scoopit", ref: "scoop.it", label: "Scoop.it", da: "84" },
  { name: "bizsugar", ref: "bizsugar", label: "BizSugar", da: "73" },
  { name: "livejournal", ref: "livejournal", label: "LiveJournal", da: "92" },
  { name: "growthhackers", ref: "growthhackers", label: "GrowthHackers", da: "80" },
  { name: "apsense", ref: "apsense", label: "APSense", da: "73" },
  { name: "vocalmedia", ref: "vocal.media", label: "Vocal.media", da: "72" },
]

for (const p of platforms) {
  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>8 Articles for ${p.label}</title></head>
<body>
<h1>8 Articles for ${p.label} (DA ${p.da}, Dofollow)</h1>
<p>Copy each article below into a new post on ${p.label}. Replace <code>ref=${p.ref}</code> as needed.</p>
<hr>
${toHtml(articles, p.ref)}
</body></html>`
  const filePath = path.join(OUT, `articles-${p.name}.html`)
  fs.writeFileSync(filePath, html, "utf8")
  console.log(`Wrote ${filePath}`)
}
