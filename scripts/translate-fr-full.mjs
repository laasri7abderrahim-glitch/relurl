import { readFileSync, writeFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, "..")

const en = JSON.parse(readFileSync(resolve(root, "messages", "en.json"), "utf-8"))
const fr = JSON.parse(readFileSync(resolve(root, "messages", "fr.json"), "utf-8"))

// Find pages where description is still English
const needTranslate = Object.keys(en.pages).filter(
  (k) => en.pages[k]?.description === fr.pages[k]?.description
)
console.log(`Pages needing full translation: ${needTranslate.length}`)

async function translateAll(texts, batchSize = 10) {
  const map = {}
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize)
    const qs = batch.map((t) => `q=${encodeURIComponent(t)}`).join("&")
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=fr&dt=t&${qs}`
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const res = await fetch(url, { signal: AbortSignal.timeout(20000) })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        data[0].forEach((segment) => {
          const orig = segment[1]
          const trans = segment[0]
          if (orig && trans) map[orig] = trans
        })
        break
      } catch (e) {
        if (attempt < 4) await new Promise((r) => setTimeout(r, 5000))
        else console.error(`  Batch failed after 5 retries: ${e.message}`)
      }
    }
    await new Promise((r) => setTimeout(r, 800))
    if ((i / batchSize) % 10 === 0) {
      process.stdout.write(`  ${i + batchSize}/${texts.length}\r`)
    }
  }
  return map
}

function getAllStrings(obj) {
  const result = []
  if (typeof obj === "string") result.push(obj)
  else if (Array.isArray(obj)) obj.forEach((item) => result.push(...getAllStrings(item)))
  else if (obj && typeof obj === "object") Object.values(obj).forEach((v) => result.push(...getAllStrings(v)))
  return result
}

function applyTranslation(obj, map) {
  if (typeof obj === "string") return map[obj] || obj
  if (Array.isArray(obj)) return obj.map((item) => applyTranslation(item, map))
  if (obj && typeof obj === "object") {
    const result = {}
    for (const [k, v] of Object.entries(obj)) result[k] = applyTranslation(v, map)
    return result
  }
  return obj
}

// Collect all English strings from these pages
const allStrings = []
for (const key of needTranslate) {
  const src = en.pages[key]
  allStrings.push(...getAllStrings(src))
}
const uniqueStrings = [...new Set(allStrings)].filter((s) => s && s.trim())
console.log(`Unique strings to translate: ${uniqueStrings.length}`)

const translationMap = await translateAll(uniqueStrings)
console.log(`\nGot ${Object.keys(translationMap).length} translations`)

// Apply translations
let applied = 0
for (const key of needTranslate) {
  const src = en.pages[key]
  const translated = applyTranslation(JSON.parse(JSON.stringify(src)), translationMap)
  fr.pages[key] = translated
  applied++
}

writeFileSync(resolve(root, "messages", "fr.json"), JSON.stringify(fr, null, 2) + "\n", "utf-8")
console.log(`Applied to ${applied} pages`)
