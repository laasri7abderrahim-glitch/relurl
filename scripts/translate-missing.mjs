import fs from "fs"
import path from "path"

const DIR = path.join(import.meta.dirname, "..", "messages")
const en = JSON.parse(fs.readFileSync(path.join(DIR, "en.json"), "utf8"))
const es = JSON.parse(fs.readFileSync(path.join(DIR, "es.json"), "utf8"))
const fr = JSON.parse(fs.readFileSync(path.join(DIR, "fr.json"), "utf8"))

const slugs = Object.keys(en.pages).filter(slug => {
  const ep = en.pages[slug]
  if (!ep.longDescription) return false
  const esp = es.pages[slug]
  return !(esp && esp.longDescription && esp.benefits)
})

console.log(`Need to translate ${slugs.length} pages`)

async function translateOne(text, target) {
  const q = encodeURIComponent(text)
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${target}&dt=t&q=${q}`
  const res = await fetch(url)
  const data = await res.json()
  return data[0].map(s => s[0]).filter(Boolean).join("")
}

async function translatePage(slug) {
  const ep = en.pages[slug]
  if (!es.pages[slug]) es.pages[slug] = {}
  if (!fr.pages[slug]) fr.pages[slug] = {}
  const esp = es.pages[slug]
  const frp = fr.pages[slug]

  const results = await Promise.all([
    // longDescription
    translateOne(ep.longDescription, "es").then(v => { esp.longDescription = v }).catch(() => {}),
    translateOne(ep.longDescription, "fr").then(v => { frp.longDescription = v }).catch(() => {}),
    // whyChoose
    translateOne(ep.whyChoose, "es").then(v => { esp.whyChoose = v }).catch(() => {}),
    translateOne(ep.whyChoose, "fr").then(v => { frp.whyChoose = v }).catch(() => {}),
  ])

  // comparisonPoints (translate each string in parallel)
  if (ep.comparisonPoints) {
    const esCp = await Promise.all(ep.comparisonPoints.map(t => translateOne(t, "es")))
    const frCp = await Promise.all(ep.comparisonPoints.map(t => translateOne(t, "fr")))
    esp.comparisonPoints = esCp
    frp.comparisonPoints = frCp
  }

  // benefits (translate title+description pairs)
  if (ep.benefits) {
    const flat = ep.benefits.flatMap(b => [b.title, b.description])
    const esFlat = await Promise.all(flat.map(t => translateOne(t, "es")))
    const frFlat = await Promise.all(flat.map(t => translateOne(t, "fr")))
    esp.benefits = ep.benefits.map((_, i) => ({ title: esFlat[i*2], description: esFlat[i*2+1] }))
    frp.benefits = ep.benefits.map((_, i) => ({ title: frFlat[i*2], description: frFlat[i*2+1] }))
  }

  // tips (translate title+description pairs)
  if (ep.tips) {
    const flat = ep.tips.flatMap(t => [t.title, t.description])
    const esFlat = await Promise.all(flat.map(t => translateOne(t, "es")))
    const frFlat = await Promise.all(flat.map(t => translateOne(t, "fr")))
    esp.tips = ep.tips.map((_, i) => ({ title: esFlat[i*2], description: esFlat[i*2+1] }))
    frp.tips = ep.tips.map((_, i) => ({ title: frFlat[i*2], description: frFlat[i*2+1] }))
  }
}

let done = 0
for (const slug of slugs) {
  await translatePage(slug)
  done++
  if (done % 20 === 0) {
    console.log(`  ${done}/${slugs.length}`)
    fs.writeFileSync(path.join(DIR, "es.json"), JSON.stringify(es, null, 2) + "\n", "utf8")
    fs.writeFileSync(path.join(DIR, "fr.json"), JSON.stringify(fr, null, 2) + "\n", "utf8")
  }
  await new Promise(r => setTimeout(r, 300))
}

fs.writeFileSync(path.join(DIR, "es.json"), JSON.stringify(es, null, 2) + "\n", "utf8")
fs.writeFileSync(path.join(DIR, "fr.json"), JSON.stringify(fr, null, 2) + "\n", "utf8")
console.log(`\nDone! ${done} pages translated`)
