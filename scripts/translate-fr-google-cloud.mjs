import { GoogleAuth } from "google-auth-library"
import { readFileSync, writeFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, "..")

// Load service account
const envRaw = readFileSync(resolve(root, ".env"), "utf-8")
const m = envRaw.match(/GOOGLE_INDEXING_KEY="([^"]+)"/)
const creds = JSON.parse(Buffer.from(m[1], "base64").toString("utf-8"))
const auth = new GoogleAuth({ credentials: creds, scopes: ["https://www.googleapis.com/auth/cloud-translation"] })
const client = await auth.getClient()

const en = JSON.parse(readFileSync(resolve(root, "messages", "en.json"), "utf-8"))
const fr = JSON.parse(readFileSync(resolve(root, "messages", "fr.json"), "utf-8"))

const needTranslate = Object.keys(en.pages).filter(
  (k) => en.pages[k]?.description === fr.pages[k]?.description
)
console.log(`Pages to translate: ${needTranslate.length}`)

async function translateViaGoogle(texts, retries = 3) {
  const toTranslate = texts.filter((t) => t && t.trim().length > 1)
  if (!toTranslate.length) return {}
  
  const body = { q: toTranslate, source: "en", target: "fr", format: "text" }
  
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await client.request({
        url: "https://translation.googleapis.com/language/translate/v2",
        method: "POST",
        data: body,
      })
      const translations = res.data?.data?.translations || []
      const map = {}
      translations.forEach((t, i) => {
        if (t.translatedText && t.translatedText !== toTranslate[i]) {
          map[toTranslate[i]] = t.translatedText
        }
      })
      return map
    } catch (e) {
      console.error(`  Attempt ${attempt + 1} failed:`, e.response?.data?.error?.message || e.message.slice(0, 80))
      if (attempt < retries - 1) await new Promise((r) => setTimeout(r, 3000))
    }
  }
  return {}
}

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

// Translate in batches
const BATCH = 100
const map = {}
for (let i = 0; i < unique.length; i += BATCH) {
  const batch = unique.slice(i, i + BATCH)
  const result = await translateViaGoogle(batch)
  Object.assign(map, result)
  console.log(`  Batch ${Math.floor(i / BATCH) + 1}/${Math.ceil(unique.length / BATCH)}: ${Object.keys(result).length} translated`)
}

console.log(`Got ${Object.keys(map).length} translations`)

// Apply
let applied = 0
for (const key of needTranslate) {
  fr.pages[key] = applyOne(JSON.parse(JSON.stringify(en.pages[key])), map)
  applied++
}

writeFileSync(resolve(root, "messages", "fr.json"), JSON.stringify(fr, null, 2) + "\n", "utf-8")
console.log(`Applied to ${applied} pages`)

// Final verification
const fv = JSON.parse(readFileSync(resolve(root, "messages", "fr.json"), "utf-8"))
let dc = 0
for (const k of Object.keys(en.pages)) {
  if (en.pages[k].description !== fv.pages[k].description) dc++
}
console.log(`FR descriptions translated: ${dc}/137`)
