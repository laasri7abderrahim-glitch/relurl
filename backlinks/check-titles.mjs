// Check Rentry.co title and Nonogra.ph link analysis
async function check() {
  // 1. Rentry.co - why does title show "Warning"?
  let r = await fetch("https://rentry.co/fdidf3ib", {headers:{"User-Agent":"Mozilla/5.0"}})
  let text = await r.text()
  console.log("=== Rentry.co page analysis ===")
  
  // Find all heading tags
  const headings = [...text.matchAll(/<h[1-6][^>]*>([^<]+)<\/h[1-6]>/gi)]
  console.log("Headings:", headings.map(h => h[1]))
  
  // Find meta tags
  const titleTag = text.match(/<title[^>]*>([^<]+)<\/title>/i)
  console.log("Title tag:", titleTag?.[1])
  const ogTitle = text.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/i)
  console.log("OG title:", ogTitle?.[1])
  
  // Check what's in the content area
  const contentMatch = text.match(/<div[^>]*class="[^"]*content[^"]*"[^>]*>[\s\S]*?<\/div>/gi)
  if (contentMatch) {
    console.log("Content divs:", contentMatch.length)
    // Get the actual article content
    const article = text.match(/<article[^>]*>[\s\S]*?<\/article>/i)
    console.log("Article:", article?.[0]?.slice(0, 500) || "none")
  }
  
  // Find where relurl appears in context
  const relurlContext = text.match(/<[^>]*relurl\.com[^>]*>[\s\S]{0,200}/gi)
  console.log("Relurl context:", relurlContext?.[0] || "none")
  
  // 2. Nonogra.ph link check
  r = await fetch("https://nonogra.ph/test-relurl-url-shortener-07-25-2026", {headers:{"User-Agent":"Mozilla/5.0"}})
  text = await r.text()
  console.log("\n=== Nonogra.ph link analysis ===")
  const link = text.match(/<a[^>]*href="https:\/\/relurl\.com"[^>]*>/gi)
  console.log("Link tag:", link?.[0] || "none")
  
  // Check for robots/noindex
  console.log("Has noindex:", text.includes("noindex"))
  console.log("Has nofollow in head:", text.includes('content="nofollow'))
  console.log("Has nofollow anywhere:", text.includes("nofollow"))
  
  // Check meta robots
  const robotsMeta = text.match(/<meta[^>]+name="robots"[^>]*>/i)
  console.log("Robots meta:", robotsMeta?.[0] || "none")
  
  // Check all rel attributes on any link
  const rels = [...text.matchAll(/rel="([^"]+)"/gi)]
  console.log("All rel values:", [...new Set(rels.map(r => r[1]))])
}
await check()
