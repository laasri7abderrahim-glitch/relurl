import translate from "@vitalets/google-translate-api"
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
console.log(`Translating ${unique.length} strings...`)

const map = {}
let count = 0
for (const text of unique) {
  try {
    const res = await translate(text, { to: "fr" })
    if (res && res.text && res.text !== text) {
      map[text] = res.text
    }
  } catch (e) {
    // skip
  }
  count++
  if (count % 20 === 0) process.stdout.write(`  ${count}/${unique.length} (${Object.keys(map).length} ok)\r`)
  await new Promise((r) => setTimeout(r, 600))
}

console.log(`\nGot ${Object.keys(map).length} translations`)

let applied = 0
for (const key of needTranslate) {
  fr.pages[key] = applyOne(JSON.parse(JSON.stringify(en.pages[key])), map)
  applied++
}

writeFileSync(resolve(root, "messages", "fr.json"), JSON.stringify(fr, null, 2) + "\n", "utf-8")
console.log(`Written to ${applied} pages`)

const fr2 = JSON.parse(readFileSync(resolve(root, "messages", "fr.json"), "utf-8"))
let descDiff = 0
for (const k of Object.keys(en.pages)) {
  if (en.pages[k].description !== fr2.pages[k].description) descDiff++
}
console.log(`FR descriptions translated: ${descDiff}/137`)
