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

async function translateText(text, retries = 3) {
  if (!text || text.trim().length === 0) return text
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=fr&dt=t&q=${encodeURIComponent(text)}`
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      return data[0].map((s) => s[0]).join("")
    } catch (e) {
      if (attempt < retries - 1) await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)))
      else throw e
    }
  }
}

function collectStrings(obj, path = "") {
  const strings = []
  if (typeof obj === "string") {
    strings.push({ path, value: obj })
  } else if (Array.isArray(obj)) {
    obj.forEach((item, i) => {
      if (typeof item === "string") strings.push({ path: `${path}[${i}]`, value: item })
      else if (typeof item === "object") strings.push(...collectStrings(item, `${path}[${i}]`))
    })
  } else if (obj && typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) {
      strings.push(...collectStrings(v, path ? `${path}.${k}` : k))
    }
  }
  return strings
}

function setByPath(obj, path, value) {
  const parts = path.split(".")
  let current = obj
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i]
    const arrMatch = part.match(/^(.*)\[(\d+)\]$/)
    if (arrMatch) {
      current = current[arrMatch[1]][parseInt(arrMatch[2])]
    } else {
      current = current[part]
    }
  }
  const last = parts[parts.length - 1]
  const arrMatch = last.match(/^(.*)\[(\d+)\]$/)
  if (arrMatch) {
    current[arrMatch[1]][parseInt(arrMatch[2])] = value
  } else {
    current[last] = value
  }
}

let totalStrings = 0
let translatedStrings = 0

for (const key of untranslated) {
  const src = JSON.parse(JSON.stringify(en.pages[key]))
  const dst = {}

  // Structure: title, subtitle, description, metaDescription
  dst.title = src.title
  dst.subtitle = src.subtitle
  dst.description = src.description
  dst.metaDescription = src.metaDescription

  // keywords array
  dst.keywords = [...(src.keywords || [])]

  // features array
  dst.features = [...(src.features || [])]

  // howItWorks array
  dst.howItWorks = (src.howItWorks || []).map((h) => ({ desc: h.desc, step: h.step }))

  // useCases array
  dst.useCases = [...(src.useCases || [])]

  // faqs array
  dst.faqs = (src.faqs || []).map((f) => ({ q: f.q, a: f.a }))

  // Collect all strings
  const strings = collectStrings(dst)
  totalStrings += strings.length

  // Translate each string
  for (const s of strings) {
    try {
      const translated = await translateText(s.value)
      if (translated && translated !== s.value) {
        setByPath(dst, s.path, translated)
        translatedStrings++
      }
    } catch (e) {
      console.error(`  Error translating [${key}].${s.path}: ${e.message}`)
    }
    // Small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 300))
  }

  fr.pages[key] = dst
  console.log(`  ${key}: ${src.title} -> ${dst.title}`)
}

writeFileSync(resolve(root, "messages", "fr.json"), JSON.stringify(fr, null, 2) + "\n", "utf-8")
console.log(`\nDone! Translated ${translatedStrings}/${totalStrings} strings across ${untranslated.length} pages`)
