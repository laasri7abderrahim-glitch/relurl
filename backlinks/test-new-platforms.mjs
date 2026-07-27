// Test more platforms for automated publishing

// 1. Rentry.co (DA ~55, no auth)
async function testRentry() {
  const body = new URLSearchParams()
  body.set("title", "Test RELURL URL Shortener")
  body.set("content", 'Test <a href="https://relurl.com">RELURL</a> URL shortener tool')
  body.set("edit_code", "test123")
  const r = await fetch("https://rentry.co/api/new", {method: "POST", body})
  const json = await r.json()
  console.log("Rentry.co:", r.status, JSON.stringify(json))
  if (json.url) {
    const r2 = await fetch(json.url, {headers: {"User-Agent": "Mozilla/5.0"}})
    const text = await r2.text()
    console.log("  Live:", r2.status, "has relurl:", text.includes("relurl.com"))
  }
}

// 2. Nonogra.ph - check homepage first
async function checkNonograph() {
  const r = await fetch("https://nonogra.ph", {headers: {"User-Agent": "Mozilla/5.0"}})
  const text = await r.text()
  console.log("Nonogra.ph homepage:", r.status, text.slice(0, 300))
  // Try a different endpoint pattern
  const r2 = await fetch("https://nonogra.ph/api/new", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({title:"test", content:"test"})})
  console.log("Nonogra.ph /api/new:", r2.status, (await r2.text()).slice(0, 200))
  // Try telegra.ph-style
  const r3 = await fetch("https://nonogra.ph/api/create", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({title:"test", content:"test"})})
  console.log("Nonogra.ph /api/create:", r3.status, (await r3.text()).slice(0, 200))
}

// 3. PasteFox API
async function testPasteFox() {
  const r = await fetch("https://pastefox.com/api/v1/pastes", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({content: 'Test <a href="https://relurl.com">RELURL</a>', title: "Test"})
  })
  console.log("PasteFox:", r.status, (await r.text()).slice(0, 200))
}

// 4. tnypst.xyz (minimal markdown pastebin)
async function testTnypst() {
  const r = await fetch("https://tnypst.xyz/api/upload", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({content: 'Test [RELURL](https://relurl.com)', language: "markdown"})
  })
  console.log("tnypst.xyz:", r.status, (await r.text()).slice(0, 200))
}

// 5. CodeThis (codethis.dev)
async function testCodeThis() {
  const r = await fetch("https://codethis.dev/api/paste", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({content: 'Test <a href="https://relurl.com">RELURL</a>'})
  })
  console.log("CodeThis:", r.status, (await r.text()).slice(0, 200))
}

// 6. LikeDo (like.do) Posts API
async function testLikeDo() {
  const r = await fetch("https://like.do/api/posts", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({title: "Test RELURL", content: 'Test <a href="https://relurl.com">RELURL</a>', published: true})
  })
  console.log("LikeDo:", r.status, (await r.text()).slice(0, 200))
}

await testRentry()
await checkNonograph()
await testPasteFox()
await testTnypst()
await testCodeThis()
await testLikeDo()
