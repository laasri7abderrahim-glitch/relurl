import fs from "fs"
import path from "path"

const dir = "src/app/[locale]"
const items = fs.readdirSync(dir)
let count = 0

for (const item of items) {
  const p = path.join(dir, item, "page.tsx")
  if (!fs.existsSync(p)) continue
  let c = fs.readFileSync(p, "utf-8")
  if (!c.includes("import URLLandingPage")) continue
  if (c.includes("pageKey={pageKey}")) continue

  c = c.replace(
    /(\s+)(relatedArticles=\{relatedArticles\})(\s*\/>)/,
    "$1$2\n      pageKey={pageKey}$3"
  )
  fs.writeFileSync(p, c)
  count++
  console.log("OK:", item)
}
console.log("Total:", count)
