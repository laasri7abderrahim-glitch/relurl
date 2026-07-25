import { readFileSync, writeFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, "..")

const en = JSON.parse(readFileSync(resolve(root, "messages", "en.json"), "utf-8"))
const fr = JSON.parse(readFileSync(resolve(root, "messages", "fr.json"), "utf-8"))

const untranslated = Object.keys(en.pages).filter(
  (k) => en.pages[k]?.title === fr.pages[k]?.title
)
console.log(`Translating ${untranslated.length} pages to French...`)

async function translateBatch(texts, retries = 3) {
  if (!texts.length) return []
  const unique = [...new Set(texts.filter((t) => t && t.trim()))]
  const qs = unique.map((t) => `q=${encodeURIComponent(t)}`).join("&")
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=fr&dt=t&${qs}`
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(30000) })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const results = {}
      data[0].forEach((segment) => {
        const original = segment[1]
        const translated = segment[0]
        if (original && translated) results[original] = translated
      })
      return results
    } catch (e) {
      if (attempt < retries - 1) await new Promise((r) => setTimeout(r, 3000))
      else throw e
    }
  }
  return {}
}

function flattenStrings(obj, prefix = "") {
  const result = []
  if (typeof obj === "string") {
    result.push({ path: prefix, value: obj })
  } else if (Array.isArray(obj)) {
    obj.forEach((item, i) => result.push(...flattenStrings(item, `${prefix}[${i}]`)))
  } else if (obj && typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) {
      result.push(...flattenStrings(v, prefix ? `${prefix}.${k}` : k))
    }
  }
  return result
}

function setByPath(obj, path, value) {
  const parts = path.split(".")
  let current = obj
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i]
    const m = part.match(/^(.*)\[(\d+)\]$/)
    current = m ? current[m[1]][parseInt(m[2])] : current[part]
  }
  const last = parts[parts.length - 1]
  const m = last.match(/^(.*)\[(\d+)\]$/)
  if (m) current[m[1]][parseInt(m[2])] = value
  else current[last] = value
}

let totalStrings = 0
let translatedStrings = 0
let pageCount = 0

for (const key of untranslated) {
  const src = en.pages[key]
  const dst = JSON.parse(JSON.stringify(src))

  const strings = flattenStrings(dst)
  totalStrings += strings.length

  // Translate in batches to speed up
  const texts = strings.map((s) => s.value)
  try {
    const map = await translateBatch(texts)
    for (const s of strings) {
      if (map[s.value] && map[s.value] !== s.value) {
        setByPath(dst, s.path, map[s.value])
        translatedStrings++
      }
    }
    await new Promise((r) => setTimeout(r, 200))
  } catch (e) {
    console.error(`  Error translating ${key}: ${e.message}`)
  }

  fr.pages[key] = dst
  pageCount++
  if (pageCount % 5 === 0) console.log(`  Progress: ${pageCount}/${untranslated.length}`)
}

writeFileSync(resolve(root, "messages", "fr.json"), JSON.stringify(fr, null, 2) + "\n", "utf-8")
console.log(`\nDone! Translated ${translatedStrings}/${totalStrings} strings across ${untranslated.length} pages`)
