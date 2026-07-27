// Generate summary of test results for new publishers (quick summary mode)
// Simple script to run quick tests without complex filesystem handling

// Testing Rentry.co
async function testRentry() {
  const title = 'Test: URL Shortener Benefits'
  const body = 'URL shorteners like <a href="https://relurl.com">RELURL</a> provide many advantages.'
  
  const editCode = `test-${Date.now().toString(36).slice(-8)}`
  
  const res = await fetch("https://rentry.co/api/new", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      text: body + '\n\n---*Originally at [RelURL](https://relurl.com)*',
      edit_code: editCode,
    }),
  })
  
  const data = await res.json()
  if (data.status === "200") {
    console.log("✅ Rentry.co: SUCCESS - Published to", data.url)
    
    // Verify
    const verify = await fetch(data.url, { headers: { "User-Agent": "Mozilla/5.0" } })
    const html = await verify.text()
    console.log("   Has relurl:", html.includes("relurl.com"))
    console.log("   Has dofollow:", !html.includes("nofollow") && !html.includes("noreferrer"))
    return true
  } else {
    console.log("❌ Rentry.co: FAILED -", data.errors || data.content)
    return false
  }
}

// Testing Nonogra.ph 
async function testNonograph() {
  // Get CSRF
  const homeRes = await fetch("https://nonogra.ph", { headers: { "User-Agent": "Mozilla/5.0" } })
  const html = await homeRes.text()
  const csrfMatch = html.match(/name="csrf_token"\s+value="([^"]+)"/)
  if (!csrfMatch) {
    console.log("❌ Nonogra.ph: No CSRF token available")
    return false
  }
  const csrfToken = csrfMatch[1]
  
  const title = 'Test: URL Shortener Benefits'
  const body = 'URL shorteners like <a href="https://relurl.com">RELURL</a> provide many advantages.'
  
  const slug = `test-url-shortener-${Date.now().toString(36).slice(-8)}`
  
  const htmlBody = body
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\[[^\]]+\]\(([^)]+)\)/g, '<a href="$1">$&</a>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
  
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
    if (url.includes('/?error=')) {
      console.log("❌ Nonogra.ph: URL generation failed")
      return false
    }
    if (!url.includes('/')) url = `https://nonogra.ph/${slug}/`
    
    console.log("✅ Nonogra.ph: SUCCESS - Published to", url)
    
    const verify = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } })
    const pageText = await verify.text()
    console.log("   Has relurl:", pageText.includes("relurl.com"))
    console.log("   Has dofollow:", !pageText.includes("nofollow") && !pageText.includes("noreferrer"))
    return true
  }
  
  console.log("❌ Nonogra.ph: FAILED -", res.status)
  return false
}

async function runQuickTest() {
  console.log("=== Quick Test of New Publishers ===\n")
  
  const results = []
  
  console.log("--- Testing Rentry.co ---")
  results.push(await testRentry())
  
  console.log("\n--- Testing Nonogra.ph ---")
  results.push(await testNonograph())
  
  console.log("\n=== Summary ===")
  const success = results.filter(r => r).length
  console.log(`${success}/${results.length} platforms working")
  
  if (success === results.length) {
    console.log("\n🎉 All new platforms verified!")
    console.log("   Ready for batch publishing with 20+ articles")
  } else {
    console.log("\n⚠️  Some platforms need attention")
  }
}

runQuickTest().catch(console.error)
