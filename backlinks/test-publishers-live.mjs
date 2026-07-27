// Test new publishers with real article content
const fs = require("fs")
const path = require("path")

const __dirname = path.dirname(path.resolve(import.meta.url))

// Set DRY_RUN=false to actually test publishing to Rentry.co and Nonogra.ph
const DRY_RUN = false

// Test only the new platforms (Rentry.co and Nonogra.ph) for now
testNewPublishers()

async function testNewPublishers() {
  console.log("=== Testing New Publishers ===\n")
  
  // Test with first 2 articles to be efficient
  const ARTICLES = [
    { file: "01-url-shortening-guide.md", tags: ["url-shortener", "link-management", "marketing", "seo"] },
    { file: "02-niche-industry-shorteners.md", tags: ["business", "url-shortener", "saas", "ecommerce"] },
  ]
  
  for (const [idx, article] of ARTICLES.entries()) {
    const filepath = path.join(__dirname, article.file)
    if (!fs.existsSync(filepath)) { console.log(`SKIP ${article.file} — not found`); continue }
    let content = fs.readFileSync(filepath, "utf-8")
    
    // Strip {{REF}} placeholders
    content = content.replace(/^\{\{REF=platform-name\}\}\s*\n/gm, "").replace(/ref=\{\{REF\}\}/g, "ref=auto")
    const lines = content.split("\n")
    const title = lines[0].replace(/^#\s+/, "").trim()
    
    console.log(`\n── [${idx + 1}/${ARTICLES.length}] ${title} ──`)
    
    if (DRY_RUN) {
      console.log("   DRY RUN — testing Rentry.co only (cannot test Nonogra.ph CSRF easily)")
      await testRentryNonDry(title, content, article.tags)
      continue
    }
    
    // Test both platforms
    await testRentryNonDry(title, content, article.tags)
    await testNonographNonDry(title, content, article.tags)
  }
  
  console.log("\n=== Tests Complete ===")
}

async function testRentryNonDry(title, body, tags) {
  const canonicalUrl = `https://relurl.com/en/${title.replace(/[^a-zA-Z0-9\-]/g, "-").toLowerCase()}`
  const editCode = `relurl-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
  
  const res = await fetch("https://rentry.co/api/new", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      text: body + `\n\n---\n*Originally published at [RelURL](${canonicalUrl})*`,
      edit_code: editCode,
    }),
  })
  
  const data = await res.json()
  if (data.status !== "200") {
    console.log("   ❌ Rentry.co: FAILED -", data.errors || data.content)
    return
  }
  
  console.log("   ✅ Rentry.co: SUCCESS")
  console.log("      URL:", data.url)
  
  const verify = await fetch(data.url, { headers: { "User-Agent": "Mozilla/5.0" } })
  const html = await verify.text()
  console.log("      Has relurl:", html.includes("relurl.com"))
  console.log("      Has dofollow:", !html.includes("nofollow") && !html.includes("noreferrer"))
}

async function testNonographNonDry(title, body, tags) {
  // Get CSRF token
  const homeRes = await fetch("https://nonogra.ph", { headers: { "User-Agent": "Mozilla/5.0" } })
  const html = await homeRes.text()
  const csrfMatch = html.match(/name="csrf_token"\s+value="([^"]+)"/)
  if (!csrfMatch) {
    console.log("   ❌ Nonogra.ph: No CSRF token")
    return
  }
  const csrfToken = csrfMatch[1]
  
  // Build unique slug
  const timestamp = Date.now().toString(36)
  const slug = (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 50) +
    "-" +
    timestamp.slice(0, 10)
  ).slice(0, 60)
  
  // Convert markdown to HTML
  let htmlBody = body
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\[[^\]]+\]\(([^)]+)\)/g, '<a href="$1">$&</a>')
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br>")
  
  const formBody = new URLSearchParams({
    title: title,
    alias: slug,
    content: `<p>${htmlBody}</p>`,
    csrf_token: csrfToken,
  })
  
  const res = await fetch("https://nonogra.ph/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "Mozilla/5.0",
      Referer: "https://nonogra.ph/",
    },
    body: formBody,
    redirect: "manual",
  })
  
  if (res.status >= 300 && res.status < 400) {
    const location = res.headers.get("location")
    let url = location?.startsWith("http") ? location : `https://nonogra.ph${location || ""}`
    
    // Clean up URL
    if (url.includes('/?error=')) {
      console.log("   ❌ Nonogra.ph: URL generation failed")
      return
    }
    if (!url.includes('/')) url = `https://nonogra.ph/${slug}/`
    
    console.log("   ✅ Nonogra.ph: SUCCESS")
    console.log("      URL:", url)
    
    const verify = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } })
    const pageText = await verify.text()
    console.log("      Has relurl:", pageText.includes("relurl.com"))
    console.log("      Has dofollow:", !pageText.includes("nofollow") && !pageText.includes("noreferrer"))
    return
  }
  
  console.log("   ❌ Nonogra.ph: FAILED -", res.status)
}
