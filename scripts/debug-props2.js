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
const files = walk(ROOT)
let qrCount = 0, qrPatched = 0, qrUnpatched = 0
for (const f of files) {
  const c = fs.readFileSync(f, "utf-8")
  if (c.includes("QRCodeLandingPage") && c.includes("getPageContent")) {
    qrCount++
    if (c.includes("moreContent=")) qrPatched++
    else { qrUnpatched++; if (qrUnpatched <= 3) { const idx = c.indexOf("pageKey={pageKey"); console.log("UNPATCHED:", f); console.log("  ", JSON.stringify(c.slice(idx-30, idx+20))) } }
  }
}
console.log("QR pages:", qrCount, "patched:", qrPatched, "unpatched:", qrUnpatched)
