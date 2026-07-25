import { readFileSync, writeFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, "..")

let c = readFileSync(resolve(root, "chunk0-es.json"), "utf-8")

// Fix smart quotes
c = c.replace(/[\u2018\u2019]/g, "'")
c = c.replace(/[\u201c\u201d]/g, '"')
c = c.replace(/[\u2013\u2014]/g, "-")
c = c.replace(/^\uFEFF/, "")

// Fix: close faqs arrays with ] instead of } 
c = c.replace(/\}\n(\s*)\}\n(\s*)},\n(\s*)"/g, "}\n$1]\n$2},\n$3\"")

// Clean trailing commas
c = c.replace(/,(\s*[}\]])/g, "$1")

try {
  const d = JSON.parse(c)
  console.log(`Parsed OK. Top keys: ${Object.keys(d).slice(0, 5).join(", ")}`)
  if (d.pages) {
    const keys = Object.keys(d.pages)
    console.log(`Pages: ${keys.length}`)
    console.log(`First: ${d.pages[keys[0]].title}`)
    console.log(`Last: ${d.pages[keys[keys.length - 1]].title}`)
    writeFileSync(resolve(root, "messages", "es-pages.json"), JSON.stringify(d.pages, null, 2))
    console.log("Written es-pages.json")
  }
} catch (e) {
  console.log(`FAIL: ${e.message.slice(0, 200)}`)
  const pm = e.message.match(/position (\d+)/)
  if (pm) {
    const pos = parseInt(pm[1])
    const lines = c.slice(0, pos).split("\n")
    const lineNum = lines.length
    const col = pos - c.lastIndexOf("\n", pos) - 1
    console.log(`At line ${lineNum}, column ${col}`)
    console.log(`Context: ${JSON.stringify(c.slice(Math.max(0, pos - 50), Math.min(c.length, pos + 50)))}`)
  }
}
