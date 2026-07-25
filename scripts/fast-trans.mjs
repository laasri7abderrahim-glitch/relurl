import fs from "fs"
import path from "path"
import { translate } from "free-google-translate"

const DIR = path.join(import.meta.dirname, "..", "messages")

function load(l) { return JSON.parse(fs.readFileSync(path.join(DIR, `${l}.json`), "utf8")) }
function save(l, d) { fs.writeFileSync(path.join(DIR, `${l}.json`), JSON.stringify(d, null, 2) + "\n", "utf8") }

async function trans(text, to) {
  if (!text || text.trim() === "") return text
  try { return (await translate(text, { from: "en", to })).text } catch { return text }
}

async function translateLocale(locale, to) {
  const en = load("en")
  const target = load(locale)
  const slugs = Object.keys(en.pages || {})
  const FIELDS = ["longDescription", "whyChoose", "benefits", "comparisonPoints", "tips"]
  let count = 0

  for (const slug of slugs) {
    const ep = en.pages[slug]
    const tp = target.pages?.[slug]
    if (!tp) continue

    const todo = FIELDS.filter(f => ep[f] && JSON.stringify(tp[f]) === JSON.stringify(ep[f]))
    if (!todo.length) continue
    count++
    process.stdout.write(`[${count}] ${slug}... `)

    // Translate field by field
    for (const f of todo) {
      const val = ep[f]
      if (typeof val === "string") {
        tp[f] = await trans(val, to)
      } else if (Array.isArray(val)) {
        tp[f] = await Promise.all(val.map(async item => {
          if (typeof item === "string") return await trans(item, to)
          if (typeof item === "object") {
            const obj = {}
            for (const [k, v] of Object.entries(item))
              obj[k] = typeof v === "string" ? await trans(v, to) : v
            return obj
          }
          return item
        }))
      }
    }
    console.log("OK")
  }

  save(locale, target)
  console.log(`\n${locale.toUpperCase()}: ${count} pages done`)
}

await translateLocale("es", "es")
await translateLocale("fr", "fr")
console.log("ALL DONE")
