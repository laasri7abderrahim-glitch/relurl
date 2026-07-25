import fs from "fs"
import path from "path"
import { translate } from "free-google-translate"

const DIR = path.join(import.meta.dirname, "..", "messages")
const FIELDS = ["longDescription", "whyChoose", "benefits", "comparisonPoints", "tips"]

function load(l) { return JSON.parse(fs.readFileSync(path.join(DIR, `${l}.json`), "utf8")) }
function save(l, d) { fs.writeFileSync(path.join(DIR, `${l}.json`), JSON.stringify(d, null, 2) + "\n", "utf8") }

async function t(text, to) {
  if (!text) return text
  try { return (await translate(text, { from: "en", to })).text } catch { return text }
}

async function tv(value, to) {
  if (!value) return value
  if (typeof value === "string") return t(value, to)
  if (Array.isArray(value)) return Promise.all(value.map(async v => {
    if (typeof v === "string") return t(v, to)
    if (typeof v === "object") { const o = {}; for (const [k, x] of Object.entries(v)) o[k] = typeof x === "string" ? await t(x, to) : x; return o }
    return v
  }))
  return value
}

async function go(locale, to) {
  console.log(`\n=== ${locale.toUpperCase()} ===`)
  const en = load("en"), target = load(locale)
  const slugs = Object.keys(en.pages || {})
  let done = 0

  for (const slug of slugs) {
    const ep = en.pages[slug], tp = target.pages?.[slug]
    if (!tp) continue
    const todo = FIELDS.filter(f => ep[f] && JSON.stringify(tp[f]) === JSON.stringify(ep[f]))
    if (!todo.length) continue
    done++
    console.log(`  [${done}] ${slug} (${todo.length} fields)`)
    for (const f of todo) tp[f] = await tv(ep[f], to)
    if (done % 5 === 0) { save(locale, target); console.log(`  saved progress (${done})`) }
    await new Promise(r => setTimeout(r, 2000))
  }
  save(locale, target)
  console.log(`Done! ${done} pages`)
}

go("es", "es").then(() => go("fr", "fr")).then(() => console.log("\nALL DONE"))
