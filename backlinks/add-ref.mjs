import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const files = fs.readdirSync(__dirname).filter(f => f.endsWith(".md")).sort()

for (const file of files) {
  const filepath = path.join(__dirname, file)
  let content = fs.readFileSync(filepath, "utf-8")
  const before = content
  content = content.replace(
    /https:\/\/relurl\.com\/en\/([^\s)"'\]>]+)/g,
    "https://relurl.com/en/$1?ref=hackernoon.com"
  )
  if (content !== before) {
    fs.writeFileSync(filepath, content, "utf-8")
    const count = (content.match(/ref=hackernoon\.com/g) || []).length
    console.log(`${file}: ${count} links updated`)
  } else {
    console.log(`${file}: no changes`)
  }
}
