import { readFileSync, writeFileSync, existsSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, "..")

function loadAndFix(filePath) {
  if (!existsSync(filePath)) return null
  let c = readFileSync(filePath, "utf-8")
  c = c.replace(/[\u2018\u2019]/g, "'")
  c = c.replace(/[\u201c\u201d]/g, '"')
  c = c.replace(/[\u2013\u2014]/g, "-")
  c = c.replace(/^\uFEFF/, "")
  c = c.replace(/\}\n(\s*)\}\n(\s*)},\n(\s*)"/g, "}\n$1]\n$2},\n$3\"")
  c = c.replace(/,(\s*[}\]])/g, "$1")
  try { return JSON.parse(c) }
  catch (e) { console.error(`Parse error in ${filePath}: ${e.message.slice(0, 100)}`); return null }
}

const esMsg = JSON.parse(readFileSync(resolve(root, "messages", "es.json"), "utf-8"))
const frMsg = JSON.parse(readFileSync(resolve(root, "messages", "fr.json"), "utf-8"))

// Merge ES chunks
let esTotal = 0
for (let i = 0; i <= 3; i++) {
  const data = loadAndFix(resolve(root, `chunk${i}-es.json`))
  if (data) {
    for (const [key, val] of Object.entries(data)) {
      if (esMsg.pages[key]) {
        esMsg.pages[key] = val
        esTotal++
      }
    }
    console.log(`chunk${i}-es.json: merged ${Object.keys(data).length} pages`)
  }
}
console.log(`Total ES pages merged: ${esTotal}`)

// Merge FR chunks
let frTotal = 0
for (let i = 0; i <= 1; i++) {
  const data = loadAndFix(resolve(root, `chunk${i}-fr.json`))
  if (data) {
    for (const [key, val] of Object.entries(data)) {
      if (frMsg.pages[key]) {
        frMsg.pages[key] = val
        frTotal++
      }
    }
    console.log(`chunk${i}-fr.json: merged ${Object.keys(data).length} pages`)
  }
}
console.log(`Total FR pages merged: ${frTotal}`)

// Write back
writeFileSync(resolve(root, "messages", "es.json"), JSON.stringify(esMsg, null, 2) + "\n", "utf-8")
writeFileSync(resolve(root, "messages", "fr.json"), JSON.stringify(frMsg, null, 2) + "\n", "utf-8")
console.log("\nWritten es.json and fr.json")

// Verify
const esV = JSON.parse(readFileSync(resolve(root, "messages", "es.json"), "utf-8"))
const frV = JSON.parse(readFileSync(resolve(root, "messages", "fr.json"), "utf-8"))
const esTitles = Object.values(esV.pages).map((p) => p.title)
const frTitles = Object.values(frV.pages).map((p) => p.title)
const enData = JSON.parse(readFileSync(resolve(root, "messages", "en.json"), "utf-8"))
const enTitles = Object.values(enData.pages).map((p) => p.title)

const esTranslated = esTitles.filter((t) => t !== enTitles[esTitles.indexOf(t)] || true).length
const frTranslated = frTitles.filter((t) => t !== enTitles[frTitles.indexOf(t)] || true).length

console.log(`\nSample checks:`)
const checks = ["custom-url-shortener", "free-url-shortener", "link-expiration", "bulk-url-shortener"]
for (const k of checks) {
  console.log(`  ${k}:`)
  console.log(`    EN: ${enData.pages[k]?.title}`)
  console.log(`    ES: ${esV.pages[k]?.title}`)
  console.log(`    FR: ${frV.pages[k]?.title}`)
}
