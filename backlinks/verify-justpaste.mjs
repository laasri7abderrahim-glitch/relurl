// Verify JustPaste.it articles
const urls = [
  "https://just-paste.it/btP99GMa9f/",
  "https://just-paste.it/G61C73ry5N/",
  "https://just-paste.it/YSB5xbm66r/",
  "https://just-paste.it/H3TStMDXH1/",
  "https://just-paste.it/JW6SmKMirY/",
]

let live = 0
for (const url of urls) {
  try {
    const r = await fetch(url, {headers: {"User-Agent": "Mozilla/5.0"}})
    const text = await r.text()
    const hasLink = text.includes("relurl.com") || text.includes("RELURL") || text.includes("relurl")
    if (r.status === 200) {
      live++
      console.log("✓", url.slice(0, 45), r.status, hasLink ? "(has backlink)" : "(NO backlink)")
    } else {
      console.log("✗", url.slice(0, 45), r.status)
    }
  } catch(e) {
    console.log("✗", url.slice(0, 45), e.message.slice(0, 30))
  }
}
console.log(`\n${live}/${urls.length} live`)
