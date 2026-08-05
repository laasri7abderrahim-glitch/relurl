const fs = require("fs")
const ROOT = "src/app/[locale]"
function walk(dir) {
  const out = []
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = `${dir}/${e.name}`
    if (e.isDirectory()) out.push(...walk(p))
    else if (e.name === "page.tsx") out.push(p)
  }
  return out
}
const files = walk(ROOT).filter((f) => {
  const c = fs.readFileSync(f, "utf-8")
  return (c.includes("URLLandingPage") || c.includes("QRCodeLandingPage")) && c.includes("getPageContent")
})
const patched = files.filter((f) => fs.readFileSync(f, "utf-8").includes("moreContent={content.moreContent}"))
const unpatched = files.filter((f) => !fs.readFileSync(f, "utf-8").includes("moreContent={content.moreContent}"))
console.log("Total candidates:", files.length)
console.log("Already have moreContent:", patched.length)
console.log("Missing moreContent:", unpatched.length)
for (const f of unpatched) {
  const c = fs.readFileSync(f, "utf-8")
  const idx = c.indexOf("pageKey={pageKey}")
  console.log("\n---", f, "---")
  console.log("around pageKey:", JSON.stringify(c.slice(idx-40, idx+20)))
}
