async function getPage(url) {
  const r = await fetch(url, {headers: {"User-Agent": "Mozilla/5.0"}})
  const text = await r.text()
  
  // Find all alternate links
  const altRegex = /<link[^>]*rel="alternate"[^>]*>/gi
  const alternates = []
  let match
  while ((match = altRegex.exec(text)) !== null) {
    const href = match[0].match(/href="([^"]+)"/)?.[1] || ""
    const hreflang = match[0].match(/hreflang="([^"]+)"/)?.[1] || ""
    alternates.push(hreflang + ":" + href.replace("https://relurl.com/", ""))
  }
  
  const canonical = text.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1] || "missing"
  const ogUrl = text.match(/<meta[^>]*property="og:url"[^>]*content="([^"]+)"/)?.[1] || "missing"
  
  return {canonical: canonical.replace("https://relurl.com/", ""), ogUrl: ogUrl.replace("https://relurl.com/", ""), alternates}
}

const pages = [
  "https://relurl.com/fr/free-url-shortener",
  "https://relurl.com/fr/qr-code-generator",
  "https://relurl.com/fr/bitly-alternative",
  "https://relurl.com/fr/how-to-shorten-a-url",
  "https://relurl.com/fr/pricing",
  "https://relurl.com/fr/features",
]

for (const p of pages) {
  const r = await getPage(p)
  const ok = r.canonical.includes("/fr/") ? "✓" : "✗"
  console.log(ok, p.replace("https://relurl.com/", ""))
  console.log("  canonical:", r.canonical)
  console.log("  og:url:", r.ogUrl)
  if (r.alternates.length > 0) {
    r.alternates.forEach(a => console.log("  hreflang:", a))
  } else {
    console.log("  hreflang: NONE FOUND")
  }
}
