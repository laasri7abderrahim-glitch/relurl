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
  return (
    (c.includes("URLLandingPage") || c.includes("QRCodeLandingPage")) &&
    c.includes("getPageContent") &&
    c.includes("pageKey={pageKey}") &&
    !c.includes("moreContent=")
  )
})

console.log("Patching", files.length, "pages for moreContent prop")

for (const f of files) {
  let c = fs.readFileSync(f, "utf-8")
  // Insert moreContent={content.moreContent} right before the pageKey prop line
  const patched = c.replace(/( *)pageKey=\{pageKey\}\n(    \/>)/, "$1moreContent={content.moreContent}\n$1pageKey={pageKey}\n$2")
  if (patched === c) {
    console.log("  WARN no match in", f)
    continue
  }
  fs.writeFileSync(f, patched)
  console.log("  patched", f)
}
