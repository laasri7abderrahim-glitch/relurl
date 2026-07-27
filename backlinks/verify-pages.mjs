// Verify live pages
async function check() {
  // 1. PasteFox - check the public page at /rusnqufz
  let r = await fetch("https://pastefox.com/rusnqufz", {headers:{"User-Agent":"Mozilla/5.0"}})
  let text = await r.text()
  console.log("=== PasteFox /rusnqufz ===")
  console.log("Status:", r.status)
  console.log("Has relurl:", text.includes("relurl.com"))
  console.log("Has nofollow:", text.includes("nofollow"))
  console.log("Has noreferrer:", text.includes("noreferrer"))
  console.log("Has noopener:", text.includes("noopener"))
  console.log("Link sample:", text.match(/<a[^>]*href="https:\/\/relurl\.com"[^>]*>/gi) || ["none"])
  console.log("rel attribute:", (text.match(/rel="[^"]*"/gi) || []).slice(0, 5))
  console.log("")

  // 2. Rentry.co - check the public page
  r = await fetch("https://rentry.co/dyprzq3z", {headers:{"User-Agent":"Mozilla/5.0"}})
  text = await r.text()
  console.log("=== Rentry.co /dyprzq3z ===")
  console.log("Status:", r.status)
  console.log("Has relurl:", text.includes("relurl.com"))
  console.log("Has nofollow:", text.includes("nofollow"))
  console.log("Has noreferrer:", text.includes("noreferrer"))
  console.log("Has noopener:", text.includes("noopener"))
  console.log("Link sample:", text.match(/<a[^>]*href="https:\/\/relurl\.com"[^>]*>/gi) || ["none"])
  console.log("rel attribute:", (text.match(/rel="[^"]*"/gi) || []).slice(0, 5))
  
  // 3. Nonogra.ph - check if you can create by POST to root
  r = await fetch("https://nonogra.ph/api", {method:"POST", headers:{"Content-Type":"application/x-www-form-urlencoded"}, body: new URLSearchParams({title:"test", content:"<p>test</p>"})})
  console.log("\n=== Nonogra.ph /api POST form ===")
  console.log("Status:", r.status)
  console.log("Location:", r.headers.get("location"))
  const body = await r.text()
  console.log("Body:", body.slice(0, 200))
  
  // Try with different content-type
  r = await fetch("https://nonogra.ph/api", {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({title:"test", content:"test"})})
  console.log("\n=== Nonogra.ph /api POST JSON ===")
  console.log("Status:", r.status)
  console.log("Body:", (await r.text()).slice(0, 200))
  
  // Check what the site actually does - look at the main page
  r = await fetch("https://nonogra.ph", {headers:{"User-Agent":"Mozilla/5.0"}})
  text = await r.text()
  const formAction = text.match(/action="([^"]+)"/)
  console.log("\n=== Nonogra.ph form action ===", formAction ? formAction[1] : "none")
  const inputs = [...text.matchAll(/name="([^"]+)"/g)]
  console.log("Input names:", inputs.map(i => i[1]))
  console.log("Body:", text.slice(0, 1000))
}
await check()
