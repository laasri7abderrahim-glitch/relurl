// Deep explore platform APIs

// fetch is globally available in Node 18+

// Nonogra.ph - try /api endpoint and /markup
async function explore() {
  // Try /api directly
  let r = await fetch("https://nonogra.ph/api", {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({title:"t",content:"t"})})
  console.log("/api POST:", r.status, (await r.text()).slice(0,100))
  
  // Try /markup as API
  r = await fetch("https://nonogra.ph/markup", {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({title:"t",content:"t"})})
  console.log("/markup POST:", r.status, (await r.text()).slice(0,100))
  
  // GET the JS file
  r = await fetch("https://nonogra.ph", {headers:{"User-Agent":"Mozilla/5.0"}})
  const html = await r.text()
  const scripts = [...html.matchAll(/src="([^"]+\.js)"/g)].map(m => m[1])
  console.log("Scripts:", scripts)
  
  // Load main JS bundle
  for (const s of scripts) {
    const url = s.startsWith("http") ? s : "https://nonogra.ph" + s
    r = await fetch(url, {headers:{"User-Agent":"Mozilla/5.0"}})
    const js = await r.text()
    // Look for fetch/API patterns
    const apis = [...js.matchAll(/['"]([^'"]*api[^'"]+)['"]/g)]
    if (apis.length) console.log("Found in " + s + ":", apis.map(a => a[1]).filter(a => a.includes("api")).join(", "))
  }
  
  // Try PasteFox URL with different format
  r = await fetch("https://pastefox.com/rusnqufz", {headers:{"User-Agent":"Mozilla/5.0"}})
  console.log("PasteFox /slug:", r.status)
  r = await fetch("https://pastefox.com/raw/rusnqufz", {headers:{"User-Agent":"Mozilla/5.0"}})
  console.log("PasteFox /raw/slug:", r.status, (await r.text()).slice(0,200))
  
  // Rentry.co - try different field names
  let body = new URLSearchParams({text: 'Test <a href="https://relurl.com">RELURL</a>', edit_code: "test456"})
  r = await fetch("https://rentry.co/api/new", {method:"POST", body})
  console.log("Rentry text:", r.status, await r.text())
  
  body = new URLSearchParams({respond: "1", text: "Test"})
  r = await fetch("https://rentry.co/api/new", {method:"POST", body})
  console.log("Rentry respond:", r.status, await r.text())
}
await explore()
