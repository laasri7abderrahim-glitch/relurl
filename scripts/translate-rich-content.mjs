import fs from "fs"
import path from "path"
import { translate } from "free-google-translate"

const DIR = path.join(import.meta.dirname, "..", "messages")

function load(locale) { return JSON.parse(fs.readFileSync(path.join(DIR, `${locale}.json`), "utf-8")) }
function save(locale, data) { fs.writeFileSync(path.join(DIR, `${locale}.json`), JSON.stringify(data, null, 2) + "\n", "utf-8") }

async function translateText(text, to) {
  if (!text || text.trim() === "") return text
  try {
    const res = await translate(text, { from: "en", to })
    return res.text
  } catch { return text }
}

async function translateField(value, to) {
  if (!value) return value
  if (typeof value === "string") return await translateText(value, to)
  if (Array.isArray(value)) {
    const results = []
    for (const item of value) {
      if (typeof item === "string") results.push(await translateText(item, to))
      else if (typeof item === "object") {
        const obj = {}
        for (const [k, v] of Object.entries(item)) obj[k] = typeof v === "string" ? await translateText(v, to) : v
        results.push(obj)
      } else results.push(item)
    }
    return results
  }
  return value
}

async function translateLocale(locale, to) {
  console.log(`\n=== Translating to ${locale.toUpperCase()} ===`)
  const en = load("en")
  const target = load(locale)
  const pages = en.pages || {}
  const keys = Object.keys(pages)
  const FIELDS = ["longDescription", "whyChoose", "benefits", "comparisonPoints", "tips"]

  let translated = 0
  for (const [idx, slug] of keys.entries()) {
    const enPage = pages[slug]
    const tPage = target.pages?.[slug]
    if (!tPage) continue

    // Find fields that need translation (identical to EN)
    const fieldsToTranslate = FIELDS.filter(f => enPage[f] && JSON.stringify(tPage[f]) === JSON.stringify(enPage[f]))
    if (fieldsToTranslate.length === 0) continue
    
    translated++
    console.log(`  [${idx + 1}/${keys.length}] ${slug} → ${fieldsToTranslate.length} fields...`)
    
    const results = await Promise.all(fieldsToTranslate.map(f => translateField(enPage[f], to)))
    for (let i = 0; i < fieldsToTranslate.length; i++) {
      tPage[fieldsToTranslate[i]] = results[i]
    }

    // Save every 5 pages
    if (translated % 5 === 0) { save(locale, target); console.log(`  Progress: ${translated} pages`) }
    await new Promise(r => setTimeout(r, 2000))
  }

  save(locale, target)
  console.log(`\nDone! ${translated} pages translated to ${locale.toUpperCase()}`)
}

async function main() {
  await translateLocale("es", "es")
  await translateLocale("fr", "fr")
  console.log("\n=== ALL DONE ===")
}

main().catch(console.error)
