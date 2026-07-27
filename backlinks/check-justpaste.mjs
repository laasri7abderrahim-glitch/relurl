// Create+verify JustPaste.it
const payload = '<html><head><title>Test URL Shortener</title></head><body><p>Test with <a href="https://relurl.com">RELURL</a></p></body></html>'
const r = await fetch("https://just-paste.it/documents", {
  method: "POST",
  headers: {"Content-Type": "text/plain"},
  body: payload,
})
const data = await r.json()
const key = data.key
console.log("Key:", key)

// Check on both domains
for (const domain of ["just-paste.it", "justpaste.it"]) {
  const u = `https://${domain}/${key}/`
  const r2 = await fetch(u, {headers: {"User-Agent": "Mozilla/5.0"}})
  const text = await r2.text()
  const clean = text.replace(/<script[^>]*>[\s\S]*?<\/script>/g,"").replace(/<style[^>]*>[\s\S]*?<\/style>/g," ").replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim()
  console.log(`${domain}: ${r2.status} | has relurl: ${text.includes("relurl.com")} | preview: ${clean.slice(0,100)}`)
}
