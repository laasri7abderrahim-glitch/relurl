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

async function translateOne(text, retries = 5) {
  if (!text || text.trim().length === 0 || text.length < 3) return text
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=fr&dt=t&q=${encodeURIComponent(text)}`
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(15000) })
      if (res.status === 429) {
        await new Promise((r) => setTimeout(r, 5000 * (attempt + 1)))
        continue
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const translated = data[0].map((s) => s[0]).join("")
      return translated || text
    } catch (e) {
      if (attempt < retries - 1) await new Promise((r) => setTimeout(r, 3000))
      else return text
    }
  }
  return text
}

function getAllStrings(obj) {
  const result = []
  if (typeof obj === "string") result.push(obj)
  else if (Array.isArray(obj)) obj.forEach((item) => result.push(...getAllStrings(item)))
  else if (obj && typeof obj === "object") Object.values(obj).forEach((v) => result.push(...getAllStrings(v)))
  return result
}

function applyOne(obj, map) {
  if (typeof obj === "string") return map[obj] || obj
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
const unique = [...new Set(allStrings)].filter((s) => s && s.trim() && s.length > 2)
console.log(`Translating ${unique.length} strings one-by-one...`)

const map = {}
let count = 0
for (const s of unique) {
  const t = await translateOne(s)
  if (t !== s) map[s] = t
  count++
  if (count % 25 === 0) console.log(`  ${count}/${unique.length} (${Object.keys(map).length} translated)`)
  await new Promise((r) => setTimeout(r, 500))
}

console.log(`Got ${Object.keys(map).length} translations`)

let applied = 0
for (const key of needTranslate) {
  fr.pages[key] = applyOne(JSON.parse(JSON.stringify(en.pages[key])), map)
  applied++
}

writeFileSync(resolve(root, "messages", "fr.json"), JSON.stringify(fr, null, 2) + "\n", "utf-8")
console.log(`Applied to ${applied} pages`)

// Verify
const fr2 = JSON.parse(readFileSync(resolve(root, "messages", "fr.json"), "utf-8"))
let descDiff = 0
for (const k of Object.keys(en.pages)) {
  if (en.pages[k].description !== fr2.pages[k].description) descDiff++
}
console.log(`Descriptions translated: ${descDiff}/137`)
