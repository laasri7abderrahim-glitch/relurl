// Extract all page keys/slugs from the codebase
import fs from "fs"
import path from "path"

const localeDir = path.join(process.cwd(), "src", "app", "[locale]")

// Read all page directories (exclude non-page dirs)
const excludeDirs = new Set([
  "(auth)", "[...rest]", "admin", "api", "dashboard",
  "p", "blog", "features", "pricing", "wordpress",
  "error", "loading", "not-found"
])

const pages = fs.readdirSync(localeDir)
  .filter(f => {
    const stat = fs.statSync(path.join(localeDir, f))
    return stat.isDirectory() && !excludeDirs.has(f) && !f.startsWith("(") && !f.startsWith("[")
  })
  .sort()

// Read url-pages.ts to get the full list with titles
const urlPagesContent = fs.readFileSync(
  path.join(process.cwd(), "src", "lib", "url-pages.ts"),
  "utf-8"
)

// Extract all href values
const hrefMatches = urlPagesContent.matchAll(/href:\s+"\/([^"]+)"/g)
const urlPagesHrefs = [...new Set([...hrefMatches].map(m => m[1]))].sort()

console.log("=== Pages from [locale] directory:", pages.length, "===")
console.log("")
console.log("=== Missing from url-pages.ts (need route config): ===")
const missing = pages.filter(p => {
  // Check if any href in url-pages includes this path
  return !urlPagesHrefs.some(h => h === p)
})
console.log("Count:", missing.length)
missing.forEach(p => console.log("  " + p))

console.log("\n=== All page slugs for translation:", pages.length + urlPagesHrefs.length, "unique ===")
const allSlugs = [...new Set([...pages, ...urlPagesHrefs])].sort()
console.log("Unique total:", allSlugs.length)

// Generate the slug list for both FR and ES
console.log("\n\n// COPY-PASTE READY: Add these slugs to fr.json/es.json under each page entry:")
console.log("\n// Example for one page:")
console.log(`
"free-url-shortener": {
  "slug": "raccourcisseur-d-url-gratuit",   // FR slug
  "title": "...",
  ...
`)

// Now read fr.json to check which pages already exist
const frMessages = JSON.parse(fs.readFileSync(
  path.join(process.cwd(), "messages", "fr.json"),
  "utf-8"
))
const esMessages = JSON.parse(fs.readFileSync(
  path.join(process.cwd(), "messages", "es.json"),
  "utf-8"
))

const frPages = frMessages.pages ? Object.keys(frMessages.pages).sort() : []
const esPages = esMessages.pages ? Object.keys(esMessages.pages).sort() : []

console.log("\n=== Pages in FR messages:", frPages.length, "===")
console.log("=== Pages in ES messages:", esPages.length, "===")

// Find pages that are missing from url-pages.ts but exist in [locale] dir
const pagesNeedingTranslation = [...new Set([...allSlugs])].sort()
console.log("\n\n=== COMPLETE LIST OF", pagesNeedingTranslation.length, "SLUGS NEEDING TRANSLATION ===")
pagesNeedingTranslation.forEach(slug => {
  console.log("pages." + slug + ".slug")
})
