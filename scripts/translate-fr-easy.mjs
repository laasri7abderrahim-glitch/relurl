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

// Use the free-google-translate package
const { default: EasyGoogleTranslate } = await import("free-google-translate")
const translator = new EasyGoogleTranslate()

// Try translating one by one - but actually let's use the translateFile approach
// that handles batching internally
const map = {}
let count = 0

for (const text of unique) {
  try {
    const result = await translator.translate(text, "fr")
    if (result && result !== text) {
      map[text] = result
    }
  } catch (e) {
    // rate limited, skip
  }
  count++
  if (count % 20 === 0) process.stdout.write(`  ${count}/${unique.length} (${Object.keys(map).length} ok)\r`)
  await new Promise((r) => setTimeout(r, 400))
}

console.log(`\nGot ${Object.keys(map).length} translations`)

for (const key of needTranslate) {
  fr.pages[key] = applyOne(JSON.parse(JSON.stringify(en.pages[key])), map)
}

writeFileSync(resolve(root, "messages", "fr.json"), JSON.stringify(fr, null, 2) + "\n", "utf-8")
console.log("Written fr.json")

const fv = JSON.parse(readFileSync(resolve(root, "messages", "fr.json"), "utf-8"))
let dc = 0
for (const k of Object.keys(en.pages)) {
  if (en.pages[k].description !== fv.pages[k].description) dc++
}
console.log(`FR descriptions translated: ${dc}/137`)
