import fs from "fs"

const articleFiles = [
  "01-url-shortening-guide.md",
  "02-niche-industry-shorteners.md",
  "03-social-media-link-tools.md",
  "04-qr-code-generator-guide.md",
  "05-alternatives-comparison.md",
  "06-guides-tutorials.md",
  "07-advanced-features.md",
  "08-platform-shorteners.md",
]

// All landing pages from sitemap
const landingPaths = [
  "/custom-url-shortener", "/branded-link-shortener", "/bulk-url-shortener",
  "/affiliate-link-shortener", "/marketing-url-shortener", "/free-url-shortener",
  "/url-tracking-tool", "/campaign-link-generator", "/short-url-analytics",
  "/custom-alias-generator", "/ecommerce-url-shortener", "/real-estate-link-shortener",
  "/saas-link-shortener", "/podcast-link-shortener", "/event-link-shortener",
  "/news-link-shortener", "/education-link-shortener", "/healthcare-link-shortener",
  "/nonprofit-link-shortener", "/travel-link-shortener", "/restaurant-link-shortener",
  "/music-link-shortener", "/photography-link-shortener", "/gaming-link-shortener",
  "/crypto-link-shortener", "/agency-link-shortener", "/startup-link-shortener",
  "/ebook-link-shortener", "/course-link-shortener", "/webinar-link-shortener",
  "/password-protected-links", "/link-expiration", "/url-shortener-api",
  "/custom-domain-links", "/link-in-bio", "/shorten-pdf-link", "/shorten-image-url",
  "/shorten-video-url", "/shorten-github-url", "/shorten-google-drive-link",
  "/shorten-google-docs-link", "/shorten-dropbox-link", "/shorten-spotify-link",
  "/shorten-amazon-link", "/shorten-shopify-link", "/shorten-medium-link",
  "/shorten-notion-link", "/shorten-figma-link", "/shorten-calendly-link",
  "/shorten-patreon-link", "/shorten-etsy-link", "/shorten-airbnb-link",
  "/shorten-substack-link", "/url-shortener-no-signup", "/url-shortener-without-signup",
  "/url-shortener-for-business", "/url-shortener-for-marketers",
  "/url-shortener-for-social-media", "/url-shortener-in-india", "/url-shortener-in-uk",
  "/url-shortener-in-canada", "/url-shortener-with-qr-codes",
  "/url-shortener-with-analytics", "/url-shortener-no-ads",
]

const socialPaths = [
  "/instagram-link-generator", "/whatsapp-link-generator", "/telegram-link-generator",
  "/signal-link-generator", "/wechat-link-generator", "/slack-link-generator",
  "/tiktok-bio-link-generator", "/youtube-link-generator", "/facebook-url-generator",
  "/linkedin-url-generator", "/pinterest-link-generator", "/snapchat-link-generator",
  "/reddit-link-generator", "/discord-link-generator", "/twitch-link-generator",
  "/twitter-link-generator", "/threads-link-generator", "/mastodon-link-generator",
  "/shorten-youtube-url", "/shorten-instagram-url", "/shorten-facebook-url",
  "/shorten-whatsapp-link", "/shorten-linkedin-url", "/shorten-tiktok-url",
  "/shorten-x-url", "/shorten-discord-invite-link",
]

const allPages = [...landingPaths, ...socialPaths]

// Extract all linked relurl.com paths from articles
const linked = new Set()
for (const f of articleFiles) {
  const content = fs.readFileSync(`backlinks/${f}`, "utf-8")
  const matches = content.match(/https:\/\/relurl\.com\/en\/([^?)\s]+)/g) || []
  for (const m of matches) {
    const path = "/" + m.replace("https://relurl.com/en/", "")
    linked.add(path)
  }
}

console.log(`Linked pages: ${linked.size}`)
console.log(`Total landing+social pages: ${allPages.length}`)

const missing = allPages.filter(p => !linked.has(p))
console.log(`\n=== Missing pages (${missing.length}) ===`)
for (const p of missing) {
  console.log(`  ${p}`)
}
