// Test JustPaste.it publish + verify
const payload = '<html><head><title>URL Shortener Guide 2026</title></head><body><p>Welcome to the complete guide to <a href="https://relurl.com">RELURL</a> URL shortener. Learn how to shorten links effectively with relurl.com.</p></body></html>'
const r = await fetch("https://just-paste.it/documents", {
  method: "POST",
  headers: {"Content-Type": "text/plain"},
  body: payload,
})
console.log("POST status:", r.status)
const data = await r.json()
console.log("Key:", data.key)
const url = "https://justpaste.it/" + data.key
console.log("URL:", url)

// Verify immediately
const r2 = await fetch(url, {headers: {"User-Agent": "Mozilla/5.0"}, redirect: "manual"})
console.log("GET status:", r2.status, r2.statusText)
console.log("Location:", r2.headers.get("location") || "none")

const text = await r2.text()
const clean = text.replace(/<script[^>]*>[\s\S]*?<\/script>/g, "").replace(/<style[^>]*>[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
console.log("Content:", clean.slice(0, 400))
console.log("Has relurl:", clean.includes("relurl") || clean.includes("RELURL") || clean.includes("RelURL"))
