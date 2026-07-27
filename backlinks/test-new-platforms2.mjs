// Follow up: verify PasteFox, fix Rentry.co, find Nonogra.ph API

// PasteFox - verify the paste is live
async function verifyPasteFox() {
  // Get the paste URL from slug
  const r = await fetch("https://pastefox.com/api/v1/pastes/rusnqufz", {headers: {"User-Agent": "Mozilla/5.0"}})
  const json = await r.json()
  console.log("PasteFox GET paste:", r.status, JSON.stringify(json))
  
  // Get the public page
  const slug = json.data?.slug || "rusnqufz"
  const r2 = await fetch("https://pastefox.com/p/" + slug, {headers: {"User-Agent": "Mozilla/5.0"}})
  const text = await r2.text()
  console.log("PasteFox live page:", r2.status, "has relurl:", text.includes("relurl.com"))
  console.log("  has nofollow:", text.includes("nofollow") || text.includes("noindex"))
  console.log("  has dofollow-like:", text.includes('href="https://relurl.com"'))
  
  // Clean up - delete test paste
  // const d = await fetch("https://pastefox.com/api/v1/pastes/rusnqufz", {method: "DELETE"})
  // console.log("Delete:", d.status)
}

// Rentry.co - try correct API format
async function testRentryV2() {
  // From Rentry docs: POST /api/new with form-data: {title, content, edit_code}
  // Or maybe body needs to be different
  const body = new URLSearchParams({
    title: "",
    content: 'Test <a href="https://relurl.com">RELURL</a> URL shortener',
    edit_code: "test123"
  })
  const r = await fetch("https://rentry.co/api/new", {method: "POST", body})
  const json = await r.json()
  console.log("Rentry.co v2:", r.status, JSON.stringify(json))
}

// Nonogra.ph - check the page for clues about API
async function exploreNonograph() {
  const r = await fetch("https://nonogra.ph", {headers: {"User-Agent": "Mozilla/5.0"}})
  const text = await r.text()
  // Check for API routes mentioned in JS
  const apiMatch = text.match(/api\/[a-z]+/gi)
  console.log("Nonogra.ph API hints:", apiMatch ? [...new Set(apiMatch)].join(", ") : "none found")
  // Check for JS files
  const jsMatch = text.match(/src="([^"]+\.js)"/g)
  if (jsMatch) console.log("JS files:", jsMatch.slice(0, 5).join(", "))
  // Check if it loads a specific JS bundle with API code
  const scriptMatch = text.match(/<script[^>]*src="([^"]*\/static\/[^"]*\.js)"[^>]*>/g)
  if (scriptMatch) console.log("Scripts:", scriptMatch.slice(0, 5).join(", "))
  
  // Check for Telegra.ph-style API (POST /api/post/create with form-urlencoded)
  // Try using same format as Telegra.ph (which uses multipart/form-data)
  const FormData = (await import('node:buffer')).Buffer
  const formBody = new URLSearchParams()
  formBody.set("title", "Test")
  formBody.set("content", '<p>Test <a href="https://relurl.com">RELURL</a></p>')
  formBody.set("author_name", "")
  const r2 = await fetch("https://nonogra.ph/api/post/create", {
    method: "POST",
    headers: {"Content-Type": "application/x-www-form-urlencoded"},
    body: formBody
  })
  console.log("Nonogra.ph create with urlencoded:", r2.status, r2.headers.get("location") || (await r2.text()).slice(0, 200))

  // Check robots.txt and sitemap for routes
  const r3 = await fetch("https://nonogra.ph/robots.txt", {headers: {"User-Agent": "Mozilla/5.0"}})
  console.log("Nonogra.ph robots:", r3.status, (await r3.text()).slice(0, 500))
}

await verifyPasteFox()
await testRentryV2()
await exploreNonograph()
