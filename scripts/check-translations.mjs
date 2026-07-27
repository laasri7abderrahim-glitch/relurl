import fs from "fs"

const en = JSON.parse(fs.readFileSync("messages/en.json", "utf-8"))
const fr = JSON.parse(fs.readFileSync("messages/fr.json", "utf-8"))
const es = JSON.parse(fs.readFileSync("messages/es.json", "utf-8"))
const ar = JSON.parse(fs.readFileSync("messages/ar.json", "utf-8"))

function flatten(obj, prefix = "") {
  const result = {}
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === "object" && v !== null) {
      Object.assign(result, flatten(v, prefix + k + "."))
    } else {
      result[prefix + k] = v
    }
  }
  return result
}

const enFlat = flatten(en)
const frFlat = flatten(fr)
const esFlat = flatten(es)
const arFlat = flatten(ar)

console.log("=== Total Keys ===")
console.log("EN:", Object.keys(enFlat).length)
console.log("FR:", Object.keys(frFlat).length)
console.log("ES:", Object.keys(esFlat).length)
console.log("AR:", Object.keys(arFlat).length)

console.log("\n=== Missing in French ===")
const missingFr = Object.keys(enFlat).filter(k => !frFlat[k])
console.log(missingFr.length + " keys missing")
missingFr.forEach(k => console.log("  " + k + " -> " + enFlat[k]))

console.log("\n=== Missing in Spanish ===")
const missingEs = Object.keys(enFlat).filter(k => !esFlat[k])
console.log(missingEs.length + " keys missing")
missingEs.forEach(k => console.log("  " + k + " -> " + enFlat[k]))

console.log("\n=== Missing in Arabic ===")
const missingAr = Object.keys(enFlat).filter(k => !arFlat[k])
console.log(missingAr.length + " keys missing")
missingAr.forEach(k => console.log("  " + k + " -> " + enFlat[k]))
