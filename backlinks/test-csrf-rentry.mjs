// Test Nonogra.ph CSRF flow and Rentry.co bulk publish

// Nonogra.ph: get CSRF token, then create
async function testNonographCSRF() {
  // Step 1: GET homepage to get CSRF token
  const r = await fetch("https://nonogra.ph", {headers:{"User-Agent":"Mozilla/5.0"}})
  const html = await r.text()
  
  // Extract CSRF token
  const csrfMatch = html.match(/name="csrf_token"\s+value="([^"]+)"/)
  if (!csrfMatch) {
    console.log("No CSRF token found in page")
    console.log("Form HTML:", html.match(/<form[^>]*>[\s\S]*?<\/form>/)?.[0]?.slice(0, 500) || "no form")
    return
  }
  const csrfToken = csrfMatch[1]
  console.log("CSRF Token:", csrfToken)
  
  // Step 2: POST to /create with CSRF token
  const body = new URLSearchParams()
  body.set("title", "Test RELURL URL Shortener")
  body.set("alias", "")
  body.set("content", '<p>Test <a href="https://relurl.com">RELURL</a></p>')
  body.set("csrf_token", csrfToken)
  
  const r2 = await fetch("https://nonogra.ph/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "Mozilla/5.0",
      "Referer": "https://nonogra.ph/"
    },
    body,
    redirect: "manual" // Don't follow redirect
  })
  console.log("Create status:", r2.status)
  console.log("Location:", r2.headers.get("location"))
  console.log("Headers:", [...r2.headers.entries()].filter(([k]) => k === "location" || k === "set-cookie").join(", "))
  const text = await r2.text()
  console.log("Response body:", text.slice(0, 300))
  
  // If redirect, follow it
  if (r2.status >= 300 && r2.status < 400) {
    const url = r2.headers.get("location")
    const fullUrl = url.startsWith("http") ? url : "https://nonogra.ph" + url
    const r3 = await fetch(fullUrl, {headers:{"User-Agent":"Mozilla/5.0"}})
    const pageText = await r3.text()
    console.log("Published URL:", fullUrl)
    console.log("Has relurl:", pageText.includes("relurl.com"))
    console.log("Has nofollow:", pageText.includes("nofollow"))
    console.log("Has noreferrer:", pageText.includes("noreferrer"))
    console.log("Link:", (pageText.match(/<a[^>]*href="https:\/\/relurl\.com"[^>]*>/gi) || ["none"]).join(", "))
  }
}

// Rentry.co - test with a real article
async function testRentryReal() {
  const article = {
    title: "Test: What is a URL Shortener?",
    text: 'A URL shortener is a tool that converts long URLs into short, manageable links. Services like <a href="https://relurl.com">RELURL</a> make it easy to share links. Short URLs are useful for social media, SMS, and printed materials.'
  }
  
  const body = new URLSearchParams()
  body.set("text", article.text)
  body.set("title", article.title)
  body.set("edit_code", "test_rentry_relurl")
  
  const r = await fetch("https://rentry.co/api/new", {method: "POST", body})
  const json = await r.json()
  console.log("\nRentry response:", JSON.stringify(json))
  
  if (json.url) {
    const r2 = await fetch(json.url, {headers:{"User-Agent":"Mozilla/5.0"}})
    const pageText = await r2.text()
    console.log("Rentry published URL:", json.url)
    console.log("Status:", r2.status)
    console.log("Has relurl:", pageText.includes("relurl.com"))
    console.log("Has nofollow:", pageText.includes("nofollow") || pageText.includes("noreferrer"))
    console.log("Link:", (pageText.match(/<a[^>]*href="https:\/\/relurl\.com"[^>]*>/gi) || ["none"]).join(", "))
    console.log("Title:", pageText.match(/<h1[^>]*>([^<]+)<\/h1>/)?.[1] || "none")
  }
}

await testNonographCSRF()
await testRentryReal()
