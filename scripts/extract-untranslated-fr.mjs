import { readFileSync, writeFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, "..")

const en = JSON.parse(readFileSync(resolve(root, "messages", "en.json"), "utf-8"))
const fr = JSON.parse(readFileSync(resolve(root, "messages", "fr.json"), "utf-8"))

// Find FR pages still in English
const untranslated = []
for (const key of Object.keys(en.pages)) {
  if (en.pages[key].title === fr.pages[key]?.title) {
    untranslated.push(key)
  }
}
console.log(`Pages to translate: ${untranslated.length}`)

// Write a JSON file with just the EN content for these pages
const extract = {}
for (const key of untranslated) {
  extract[key] = en.pages[key]
}
writeFileSync(resolve(root, "scripts", "fr-to-translate.json"), JSON.stringify(extract, null, 2))
console.log(`Written fr-to-translate.json with ${untranslated.length} pages`)

// Also create a blank FR template
const frTemplate = {}
for (const key of untranslated) {
  frTemplate[key] = null
}
writeFileSync(resolve(root, "scripts", "fr-template.json"), JSON.stringify(frTemplate, null, 2))
console.log(`Written fr-template.json`)
