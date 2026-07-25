import { readFileSync, writeFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, "..")

let c = readFileSync(resolve(root, "chunk0-es.json"), "utf-8")
const orig = c

// Fix smart quotes
c = c.replace(/[\u2018\u2019]/g, "'")
c = c.replace(/[\u201c\u201d]/g, '"')
c = c.replace(/[\u2013\u2014]/g, "-")
c = c.replace(/^\uFEFF/, "")

// Fix: close faqs arrays with ] instead of }
// Pattern: end of last FAQ object, then a } that should be ]
// We need to find: "}\n<whitespace>}\n<whitespace>},\n<whitespace>"next-page-key"
c = c.replace(/\}\n(\s*)\}\n(\s*)},\n(\s*)"/g, "}\n$1]\n$2},\n$3\"")

// Clean trailing commas
c = c.replace(/,(\s*[}\]])/g, "$1")

try {
  const d = JSON.parse(c)
  const keys = Object.keys(d.pages)
  console.log(`SUCCESS: ${keys.length} pages`)
  console.log(`First: ${d.pages[keys[0]].title}`)
  console.log(`Last: ${d.pages[keys[keys.length - 1]].title}`)

  // Verify translations
  const checks = ["custom-url-shortener", "qr-code-generator", "free-url-shortener", "link-expiration"]
  for (const k of checks) {
    if (d.pages[k]) console.log(`  ${k}: ${d.pages[k].title}`)
  }

  writeFileSync(resolve(root, "messages", "es-pages.json"), JSON.stringify(d.pages, null, 2))
  console.log("\nWritten es-pages.json")
  process.exit(0)
} catch (e) {
  console.log(`FAIL: ${e.message.slice(0, 120)}`)
  const pm = e.message.match(/position (\d+)/)
  if (pm) {
    const pos = parseInt(pm[1])
    console.log(`Context: ${JSON.stringify(c.slice(Math.max(0, pos - 20), Math.min(c.length, pos + 20)))}`)
  }
  // Try even more aggressive fixes
  const lines = c.split("\n")
  // Find lines that have } but should be ]
  // Look at the context around each }
  for (let i = Math.max(0, 1060); i < Math.min(lines.length, 1070); i++) {
    console.log(`Line ${i + 1}: ${JSON.stringify(lines[i])}`)
  }
}
