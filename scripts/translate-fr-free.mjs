import pkg from "free-google-translate"
const { translateBatch } = pkg
import { readFileSync, writeFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, "..")

const en = JSON.parse(readFileSync(resolve(root, "messages", "en.json"), "utf-8"))
const fr = JSON.parse(readFileSync(resolve(root, "messages", "fr.json"), "utf-8"))

const needTranslate = Object.keys(en.pages).filter(
  (k) => en.pages[k]?.description === fr.pages[k]?.description
)
console.log(`Pages to translate: ${needTranslate.length}`)

function getAllStrings(obj) {
  const result = []
  if (typeof obj === "string") result.push(obj)
  else if (Array.isArray(obj)) obj.forEach((item) => result.push(...getAllStrings(item)))
  else if (obj && typeof obj === "object") Object.values(obj).forEach((v) => result.push(...getAllStrings(v)))
  return result
}

function applyOne(obj, map) {
  if (typeof obj === "string") return map[obj] ?? obj
  if (Array.isArray(obj)) return obj.map((item) => applyOne(item, map))
  if (obj && typeof obj === "object") {
    const res = {}
    for (const [k, v] of Object.entries(obj)) res[k] = applyOne(v, map)
    return res
  }
  return obj
}

const allStrings = []
for (const key of needTranslate) {
  allStrings.push(...getAllStrings(en.pages[key]))
}
const unique = [...new Set(allStrings)].filter((s) => s?.trim() && s.length > 2)
console.log(`Unique strings: ${unique.length}`)

// Translate in batches of 50
const BATCH = 50
const map = {}
for (let i = 0; i < unique.length; i += BATCH) {
  const batch = unique.slice(i, i + BATCH)
  try {
    const results = await translateBatch(batch, { to: "fr", batchSize: BATCH })
    for (const r of results) {
      if (r.translated && r.translated !== r.text) {
        map[r.text] = r.translated
      }
    }
    process.stdout.write(`  ${Math.min(i + BATCH, unique.length)}/${unique.length} (${Object.keys(map).length} ok)\r`)
  } catch (e) {
    console.error(`\nBatch error at ${i}: ${e.message}`)
  }
  await new Promise((r) => setTimeout(r, 200))
}

console.log(`\nGot ${Object.keys(map).length} translations`)

// Apply
for (const key of needTranslate) {
  fr.pages[key] = applyOne(JSON.parse(JSON.stringify(en.pages[key])), map)
}

writeFileSync(resolve(root, "messages", "fr.json"), JSON.stringify(fr, null, 2) + "\n", "utf-8")
console.log("Written fr.json")

// Final verification
const fv = JSON.parse(readFileSync(resolve(root, "messages", "fr.json"), "utf-8"))
let dc = 0
for (const k of Object.keys(en.pages)) {
  if (en.pages[k].description !== fv.pages[k].description) dc++
}
console.log(`FR descriptions translated: ${dc}/137`)
