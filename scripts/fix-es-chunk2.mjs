import { readFileSync, writeFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, "..")

let c = readFileSync(resolve(root, "chunk0-es.json"), "utf-8")

// Smart quote cleanup
c = c.replace(/[\u2018\u2019]/g, "'")
c = c.replace(/[\u201c\u201d]/g, '"')
c = c.replace(/[\u2013\u2014]/g, "-")
c = c.replace(/^\uFEFF/, "")

// Fix known structural issue: } closing an array instead of ]
// Find "},\n    \"how-to-create-short-links\"" and fix the preceding }
c = c.replace(/}(\s*\n\s*"how-to-create-short-links")/g, "]$1")

// Also check for any remaining } before a page key (this is the faqs array closing issue)
c = c.replace(/}(\s*\n\s*"[a-z][a-z0-9-]+":\s*\{)/g, "]$1")

// Clean trailing commas after fixing brackets
c = c.replace(/,(\s*[}\]])/g, "$1")

try {
  const d = JSON.parse(c)
  const keys = Object.keys(d.pages)
  console.log(`SUCCESS: ${keys.length} pages`)
  console.log(`First: ${d.pages[keys[0]].title}`)
  console.log(`Last: ${d.pages[keys[keys.length - 1]].title}`)

  // Verify a few Spanish translations
  const sampleKeys = ["custom-url-shortener", "qr-code-generator", "free-url-shortener", "link-expiration"]
  for (const k of sampleKeys) {
    if (d.pages[k]) {
      console.log(`  ${k}: ${d.pages[k].title}`)
    }
  }

  // Write fixed pages to a file
  writeFileSync(resolve(root, "messages", "es-pages-fixed.json"), JSON.stringify(d.pages, null, 2))
  console.log("\nWritten es-pages-fixed.json")
} catch (e) {
  console.log(`FAIL: ${e.message.slice(0, 120)}`)
  const pm = e.message.match(/position (\d+)/)
  if (pm) {
    const pos = parseInt(pm[1])
    console.log(`Context: ${c.slice(Math.max(0, pos - 30), Math.min(c.length, pos + 30))}`)
  }
}
