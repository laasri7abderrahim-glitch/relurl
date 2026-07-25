import { readFileSync, writeFileSync, existsSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, "..")
const PROGRESS_FILE = resolve(root, "scripts", "fr-translation-progress.json")
const { default: EasyGoogleTranslate } = await import("free-google-translate")

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

// Load progress
let startFrom = 0
let map = {}
if (existsSync(PROGRESS_FILE)) {
  const saved = JSON.parse(readFileSync(PROGRESS_FILE, "utf-8"))
  map = saved.map || {}
  startFrom = saved.index || 0
  console.log(`Resuming from index ${startFrom} with ${Object.keys(map).length} translations`)
}

console.log(`Total: ${unique.length} strings`)

const translator = new EasyGoogleTranslate()
let count = startFrom

for (let i = startFrom; i < unique.length; i++) {
  const text = unique[i]
  try {
    const result = await translator.translate(text, "fr")
    if (result && result !== text) map[text] = result
  } catch (e) {
    // skip on error
  }
  count++

  // Save progress every 30 strings
  if (count % 30 === 0) {
    writeFileSync(PROGRESS_FILE, JSON.stringify({ map, index: count }))
    process.stdout.write(`  ${count}/${unique.length} (${Object.keys(map).length} ok)\r`)
  }

  // Minimal delay
  await new Promise((r) => setTimeout(r, 150))
}

console.log(`\nDone! ${Object.keys(map).length} translations`)

// Apply
for (const key of needTranslate) {
  fr.pages[key] = applyOne(JSON.parse(JSON.stringify(en.pages[key])), map)
}

writeFileSync(resolve(root, "messages", "fr.json"), JSON.stringify(fr, null, 2) + "\n", "utf-8")
console.log("Written fr.json")

// Cleanup progress file
try { writeFileSync(PROGRESS_FILE, JSON.stringify({})) } catch {}

const fv = JSON.parse(readFileSync(resolve(root, "messages", "fr.json"), "utf-8"))
let dc = 0
for (const k of Object.keys(en.pages)) {
  if (en.pages[k].description !== fv.pages[k].description) dc++
}
console.log(`FR descriptions translated: ${dc}/137`)
