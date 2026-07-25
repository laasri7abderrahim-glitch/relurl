import { readFileSync, writeFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, "..")

// Load messages
const esMsg = JSON.parse(readFileSync(resolve(root, "messages", "es.json"), "utf-8"))
const frMsg = JSON.parse(readFileSync(resolve(root, "messages", "fr.json"), "utf-8"))

// Load and fix ES chunk
let esRaw = readFileSync(resolve(root, "chunk0-es.json"), "utf-8")
esRaw = esRaw.replace(/[\u2018\u2019]/g, "'")
esRaw = esRaw.replace(/[\u201c\u201d]/g, '"')
esRaw = esRaw.replace(/[\u2013\u2014]/g, "-")
esRaw = esRaw.replace(/^\uFEFF/, "")
esRaw = esRaw.replace(/\}\n(\s*)\}\n(\s*)},\n(\s*)"/g, "}\n$1]\n$2},\n$3\"")
esRaw = esRaw.replace(/,(\s*[}\]])/g, "$1")

const esPages = JSON.parse(esRaw)
console.log(`ES pages loaded: ${Object.keys(esPages).length}`)

// Merge into esMsg.pages
let count = 0
for (const [key, val] of Object.entries(esPages)) {
  if (esMsg.pages[key]) {
    esMsg.pages[key] = val
    count++
  }
}
console.log(`Merged ${count} ES translations`)

// FR: no chunk with pages key found, write note
console.log("FR: no translation chunks with pages content found - keeping English")

// Write back
writeFileSync(resolve(root, "messages", "es.json"), JSON.stringify(esMsg, null, 2) + "\n", "utf-8")
console.log("Written es.json")

// Verify
const verify = JSON.parse(readFileSync(resolve(root, "messages", "es.json"), "utf-8"))
const esCustom = verify.pages["custom-url-shortener"]
console.log(`\nVerification:`)
console.log(`  custom-url-shortener.title (ES): ${esCustom?.title}`)
console.log(`  custom-url-shortener.title (EN): ${JSON.parse(readFileSync(resolve(root, "messages", "en.json"), "utf-8")).pages["custom-url-shortener"]?.title}`)
