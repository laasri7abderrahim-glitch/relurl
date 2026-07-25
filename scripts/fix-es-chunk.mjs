import { readFileSync, writeFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, "..")

let c = readFileSync(resolve(root, "chunk0-es.json"), "utf-8")

// Fix common JSON issues from AI-generated content
c = c.replace(/,(\s*[}\]])/g, "$1")
c = c.replace(/[\u2018\u2019]/g, "'")
c = c.replace(/[\u201c\u201d]/g, '"')
c = c.replace(/[\u2013\u2014]/g, "-")
c = c.replace(/^\uFEFF/, "")

// Try multiple times - fix and re-parse
for (let attempt = 0; attempt < 3; attempt++) {
  try {
    const d = JSON.parse(c)
    const keys = Object.keys(d.pages)
    console.log(`SUCCESS: ${keys.length} pages`)
    console.log(`First: ${d.pages[keys[0]].title}`)
    console.log(`Last: ${d.pages[keys[keys.length - 1]].title}`)

    // Write fixed version
    writeFileSync(resolve(root, "messages", "es-pages-fixed.json"), JSON.stringify(d.pages, null, 2))
    console.log("Written es-pages-fixed.json")
    process.exit(0)
  } catch (e) {
    const msg = e.message
    const posMatch = msg.match(/position (\d+)/)
    if (posMatch) {
      const pos = parseInt(posMatch[1])
      console.log(`Attempt ${attempt + 1}: Error at ${pos}, char codes around it:`)
      for (let i = Math.max(0, pos - 5); i < Math.min(c.length, pos + 5); i++) {
        process.stdout.write(`${c.charCodeAt(i)} `)
      }
      console.log()
      console.log(`Context: ${c.slice(Math.max(0, pos - 20), Math.min(c.length, pos + 20))}`)

      // Remove the problematic char
      if (pos < c.length) {
        c = c.slice(0, pos) + c.slice(pos + 1)
        console.log(`Removed char at ${pos}, retrying...`)
      }
    }
  }
}
console.log("Failed to fix JSON")
