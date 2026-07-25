import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const files = fs.readdirSync(__dirname).filter(f => f.endsWith(".md")).sort()
let total = 0

for (const file of files) {
  const content = fs.readFileSync(path.join(__dirname, file), "utf-8")
  const matches = content.match(/https:\/\/relurl\.com\/en[^\s)"'\]]+/g) || []
  console.log(`${file}: ${matches.length} backlinks`)
  total += matches.length
}

console.log(`\nTotal: ${total} backlinks across ${files.length} articles`)
