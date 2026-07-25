import { readFileSync, writeFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, "..")

// Load current messages files
const enMsg = JSON.parse(readFileSync(resolve(root, "messages", "en.json"), "utf-8"))
const esMsg = JSON.parse(readFileSync(resolve(root, "messages", "es.json"), "utf-8"))
const frMsg = JSON.parse(readFileSync(resolve(root, "messages", "fr.json"), "utf-8"))

// Only chunk0-es.json has the pages translations
// Let's try to parse it with error recovery
let chunkRaw = readFileSync(resolve(root, "chunk0-es.json"), "utf-8")
// Fix trailing commas
chunkRaw = chunkRaw.replace(/,(\s*[}\]])/g, "$1")

let esChunk
try {
  esChunk = JSON.parse(chunkRaw)
} catch (e) {
  console.error("ES chunk parse error:", e.message)
  process.exit(1)
}

// Check if it has pages
if (esChunk.pages) {
  const esPageKeys = Object.keys(esChunk.pages)
  console.log(`ES chunk has ${esPageKeys.length} pages`)

  // Merge into esMsg.pages
  let mergedCount = 0
  for (const key of esPageKeys) {
    if (esMsg.pages[key]) {
      esMsg.pages[key] = esChunk.pages[key]
      mergedCount++
    }
  }
  console.log(`Merged ${mergedCount} ES pages`)
}

// Check FR chunks
const frFiles = ["chunk0-fr.json", "chunk1-fr.json"]
let frMerged = 0
for (const f of frFiles) {
  try {
    const raw = readFileSync(resolve(root, f), "utf-8")
    const fixed = raw.replace(/,(\s*[}\]])/g, "$1")
    const chunk = JSON.parse(fixed)
    if (chunk.pages) {
      const keys = Object.keys(chunk.pages)
      console.log(`${f} has ${keys.length} pages`)
      for (const key of keys) {
        if (frMsg.pages[key]) {
          frMsg.pages[key] = chunk.pages[key]
          frMerged++
        }
      }
    } else {
      console.log(`${f}: no pages key, top-level keys: ${Object.keys(chunk).slice(0,5).join(", ")}`)
    }
  } catch (e) {
    console.log(`${f}: error - ${e.message.slice(0, 80)}`)
  }
}
console.log(`Merged ${frMerged} FR pages`)

// Write back
writeFileSync(resolve(root, "messages", "es.json"), JSON.stringify(esMsg, null, 2) + "\n", "utf-8")
writeFileSync(resolve(root, "messages", "fr.json"), JSON.stringify(frMsg, null, 2) + "\n", "utf-8")
console.log("Written es.json and fr.json")
