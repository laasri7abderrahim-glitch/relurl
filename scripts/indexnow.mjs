const KEY = "bf3c3caf4ab93d4d1886dc0d26d1eaa5"
const BASE = "https://relurl.com"

const paths = [
  "/education-link-shortener","/healthcare-link-shortener","/nonprofit-link-shortener","/travel-link-shortener","/restaurant-link-shortener",
  "/music-link-shortener","/photography-link-shortener","/gaming-link-shortener","/crypto-link-shortener","/agency-link-shortener",
  "/startup-link-shortener","/ebook-link-shortener","/course-link-shortener","/webinar-link-shortener","/password-protected-links",
  "/link-expiration","/url-shortener-api","/custom-domain-links","/link-in-bio","/shorten-pdf-link","/shorten-image-url",
  "/shorten-video-url","/shorten-github-url","/shorten-google-drive-link","/shorten-google-docs-link","/shorten-dropbox-link",
  "/shorten-spotify-link","/shorten-amazon-link","/shorten-shopify-link","/shorten-medium-link","/shorten-notion-link",
  "/shorten-figma-link","/shorten-calendly-link","/shorten-patreon-link","/shorten-etsy-link","/shorten-airbnb-link",
  "/shorten-substack-link","/url-shortener-no-signup","/url-shortener-without-signup","/url-shortener-for-business",
  "/url-shortener-for-marketers","/url-shortener-for-social-media","/url-shortener-in-india","/url-shortener-in-uk",
  "/url-shortener-in-canada","/url-shortener-with-qr-codes","/url-shortener-with-analytics","/url-shortener-no-ads",
  "/instagram-link-generator","/whatsapp-link-generator","/telegram-link-generator","/signal-link-generator","/wechat-link-generator",
  "/slack-link-generator","/tiktok-bio-link-generator","/youtube-link-generator","/facebook-url-generator","/linkedin-url-generator",
  "/pinterest-link-generator","/snapchat-link-generator","/reddit-link-generator","/discord-link-generator","/twitch-link-generator",
  "/twitter-link-generator","/threads-link-generator","/mastodon-link-generator","/shorten-youtube-url","/shorten-instagram-url",
  "/shorten-facebook-url","/shorten-whatsapp-link","/shorten-linkedin-url","/shorten-tiktok-url","/shorten-x-url",
  "/shorten-discord-invite-link",
  "/qr-code-generator","/dynamic-qr-code-generator","/free-qr-code-generator","/qr-code-for-wifi","/qr-code-for-vcard",
  "/qr-code-for-business-card","/qr-code-for-restaurant-menu","/qr-code-for-app-download","/qr-code-for-google-maps",
  "/qr-code-for-google-reviews","/qr-code-for-facebook","/qr-code-for-instagram","/qr-code-for-linkedin","/qr-code-for-youtube",
  "/qr-code-for-whatsapp","/qr-code-for-email","/qr-code-for-sms","/qr-code-for-phone","/qr-code-for-event","/qr-code-for-pdf",
  "/qr-code-for-restaurant","/qr-code-for-hotel","/qr-code-for-gym","/qr-code-for-salon","/qr-code-for-store",
  "/qr-code-for-resume","/qr-code-for-portfolio","/qr-code-for-wedding","/qr-code-for-birthday","/qr-code-for-concert",
  "/qr-code-for-class","/qr-code-for-fundraiser",
  "/bitly-alternative","/tinyurl-alternative","/rebrandly-alternative","/short-io-alternative","/best-url-shortener",
  "/relurl-vs-tinyurl","/relurl-vs-bitly",
  "/how-to-shorten-a-url","/how-to-create-short-links","/how-to-track-link-clicks","/how-to-create-qr-codes",
  "/how-to-create-branded-links","/how-to-use-utm-parameters","/how-to-create-qr-codes-for-business",
  "/how-to-make-money-with-url-shortener",
  "/privacy","/terms","/cookies","/gdpr","/dmca","/wordpress","/integrations","/changelog","/api-reference"
]

const staticSet = new Set(["/privacy","/terms","/cookies","/gdpr","/dmca","/wordpress","/integrations","/changelog","/api-reference"])
const urls = [BASE, BASE+"/en", BASE+"/es", BASE+"/fr", BASE+"/pricing", BASE+"/features", BASE+"/blog", BASE+"/contact", BASE+"/browser-extension"]
for (const p of paths) {
  urls.push(BASE + "/en" + p)
  if (!staticSet.has(p)) { urls.push(BASE + "/es" + p); urls.push(BASE + "/fr" + p) }
}
console.log("Total URLs:", urls.length)

async function main() {
  let ok = 0, fail = 0
  for (let i = 0; i < urls.length; i += 100) {
    const batch = urls.slice(i, i + 100)
    const r = await fetch("https://www.bing.com/indexnow", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ host: "relurl.com", key: KEY, keyLocation: "https://relurl.com/"+KEY+".txt", urlList: batch })
    })
    const text = await r.text()
    if (r.status === 200) { ok += batch.length; process.stdout.write(".") }
    else { fail += batch.length; console.log("\nFAIL batch", Math.floor(i/100)+":", r.status, text.slice(0,100)) }
  }
  console.log("\nOK:", ok, "FAIL:", fail)
}
main().catch(console.error)
