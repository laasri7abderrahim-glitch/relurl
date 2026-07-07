export interface PageEntry {
  title: string
  href: string
  category?: string
}

type CategoryMap = Record<string, string[]>

const categoryMap: CategoryMap = {
  general: ["custom-url-shortener", "branded-link-shortener", "bulk-url-shortener", "free-url-shortener", "password-protected-links", "link-expiration", "url-shortener-api", "custom-domain-links", "link-in-bio"],
  marketing: ["affiliate-link-shortener", "marketing-url-shortener", "url-tracking-tool", "campaign-link-generator", "short-url-analytics", "custom-alias-generator"],
  industry: ["ecommerce-url-shortener", "real-estate-link-shortener", "saas-link-shortener", "podcast-link-shortener", "event-link-shortener", "news-link-shortener", "education-link-shortener", "healthcare-link-shortener", "nonprofit-link-shortener", "travel-link-shortener", "restaurant-link-shortener", "music-link-shortener", "photography-link-shortener", "gaming-link-shortener", "crypto-link-shortener", "agency-link-shortener", "startup-link-shortener", "ebook-link-shortener", "course-link-shortener", "webinar-link-shortener"],
  file: ["shorten-pdf-link", "shorten-image-url", "shorten-video-url"],
  platform: ["shorten-github-url", "shorten-google-drive-link", "shorten-google-docs-link", "shorten-dropbox-link"],
  social: ["shorten-youtube-url", "shorten-instagram-url", "shorten-facebook-url", "shorten-whatsapp-link", "shorten-linkedin-url", "shorten-tiktok-url", "shorten-x-url", "shorten-discord-invite-link"],
  comparison: ["bitly-alternative", "tinyurl-alternative", "rebrandly-alternative", "short-io-alternative", "best-url-shortener"],
  guide: ["how-to-shorten-a-url", "how-to-create-short-links", "how-to-track-link-clicks", "how-to-create-qr-codes", "how-to-create-branded-links", "how-to-use-utm-parameters"],
}

function hrefToSlug(href: string): string {
  return href.replace(/^\//, "")
}

function getCategoryForHref(href: string): string | undefined {
  const slug = hrefToSlug(href)
  for (const [cat, slugs] of Object.entries(categoryMap)) {
    if (slugs.includes(slug)) return cat
  }
  return undefined
}

export const allPages: PageEntry[] = [
  { title: "Custom URL Shortener", href: "/custom-url-shortener", category: "general" },
  { title: "Branded Link Shortener", href: "/branded-link-shortener", category: "general" },
  { title: "Bulk URL Shortener", href: "/bulk-url-shortener", category: "general" },
  { title: "Affiliate Link Shortener", href: "/affiliate-link-shortener", category: "marketing" },
  { title: "Marketing URL Shortener", href: "/marketing-url-shortener", category: "marketing" },
  { title: "Free URL Shortener", href: "/free-url-shortener", category: "general" },
  { title: "URL Tracking Tool", href: "/url-tracking-tool", category: "marketing" },
  { title: "Campaign Link Generator", href: "/campaign-link-generator", category: "marketing" },
  { title: "Short URL Analytics", href: "/short-url-analytics", category: "marketing" },
  { title: "Custom Alias Generator", href: "/custom-alias-generator", category: "marketing" },
  { title: "E-commerce URL Shortener", href: "/ecommerce-url-shortener", category: "industry" },
  { title: "Real Estate Link Shortener", href: "/real-estate-link-shortener", category: "industry" },
  { title: "SaaS Link Shortener", href: "/saas-link-shortener", category: "industry" },
  { title: "Podcast Link Shortener", href: "/podcast-link-shortener", category: "industry" },
  { title: "Event Link Shortener", href: "/event-link-shortener", category: "industry" },
  { title: "News Link Shortener", href: "/news-link-shortener", category: "industry" },
  { title: "Education Link Shortener", href: "/education-link-shortener", category: "industry" },
  { title: "Healthcare Link Shortener", href: "/healthcare-link-shortener", category: "industry" },
  { title: "Nonprofit Link Shortener", href: "/nonprofit-link-shortener", category: "industry" },
  { title: "Travel Link Shortener", href: "/travel-link-shortener", category: "industry" },
  { title: "Restaurant Link Shortener", href: "/restaurant-link-shortener", category: "industry" },
  { title: "Music Link Shortener", href: "/music-link-shortener", category: "industry" },
  { title: "Photography Link Shortener", href: "/photography-link-shortener", category: "industry" },
  { title: "Gaming Link Shortener", href: "/gaming-link-shortener", category: "industry" },
  { title: "Crypto Link Shortener", href: "/crypto-link-shortener", category: "industry" },
  { title: "Agency Link Shortener", href: "/agency-link-shortener", category: "industry" },
  { title: "Startup Link Shortener", href: "/startup-link-shortener", category: "industry" },
  { title: "Ebook Link Shortener", href: "/ebook-link-shortener", category: "industry" },
  { title: "Course Link Shortener", href: "/course-link-shortener", category: "industry" },
  { title: "Webinar Link Shortener", href: "/webinar-link-shortener", category: "industry" },
  { title: "Password Protected Links", href: "/password-protected-links", category: "general" },
  { title: "Link Expiration", href: "/link-expiration", category: "general" },
  { title: "URL Shortener API", href: "/url-shortener-api", category: "general" },
  { title: "Custom Domain Links", href: "/custom-domain-links", category: "general" },
  { title: "Link in Bio", href: "/link-in-bio", category: "general" },
  { title: "Shorten PDF Link", href: "/shorten-pdf-link", category: "file" },
  { title: "Shorten Image URL", href: "/shorten-image-url", category: "file" },
  { title: "Shorten Video URL", href: "/shorten-video-url", category: "file" },
  { title: "Shorten GitHub URL", href: "/shorten-github-url", category: "platform" },
  { title: "Shorten Google Drive Link", href: "/shorten-google-drive-link", category: "platform" },
  { title: "Shorten Google Docs Link", href: "/shorten-google-docs-link", category: "platform" },
  { title: "Shorten Dropbox Link", href: "/shorten-dropbox-link", category: "platform" },
  { title: "Shorten YouTube URL", href: "/shorten-youtube-url", category: "social" },
  { title: "Shorten Instagram URL", href: "/shorten-instagram-url", category: "social" },
  { title: "Shorten Facebook URL", href: "/shorten-facebook-url", category: "social" },
  { title: "Shorten WhatsApp Link", href: "/shorten-whatsapp-link", category: "social" },
  { title: "Shorten LinkedIn URL", href: "/shorten-linkedin-url", category: "social" },
  { title: "Shorten TikTok URL", href: "/shorten-tiktok-url", category: "social" },
  { title: "Shorten X URL", href: "/shorten-x-url", category: "social" },
  { title: "Shorten Discord Invite Link", href: "/shorten-discord-invite-link", category: "social" },
  { title: "Bitly Alternative", href: "/bitly-alternative", category: "comparison" },
  { title: "TinyURL Alternative", href: "/tinyurl-alternative", category: "comparison" },
  { title: "Rebrandly Alternative", href: "/rebrandly-alternative", category: "comparison" },
  { title: "Short.io Alternative", href: "/short-io-alternative", category: "comparison" },
  { title: "Best URL Shortener", href: "/best-url-shortener", category: "comparison" },
  { title: "How to Shorten a URL", href: "/how-to-shorten-a-url", category: "guide" },
  { title: "How to Create Short Links", href: "/how-to-create-short-links", category: "guide" },
  { title: "How to Track Link Clicks", href: "/how-to-track-link-clicks", category: "guide" },
  { title: "How to Create QR Codes", href: "/how-to-create-qr-codes", category: "guide" },
  { title: "How to Create Branded Links", href: "/how-to-create-branded-links", category: "guide" },
  { title: "How to Use UTM Parameters", href: "/how-to-use-utm-parameters", category: "guide" },
]

export const socialPages: PageEntry[] = [
  { title: "Instagram Link Generator", href: "/instagram-link-generator", category: "social-tool" },
  { title: "WhatsApp Link Generator", href: "/whatsapp-link-generator", category: "social-tool" },
  { title: "Telegram Link Generator", href: "/telegram-link-generator", category: "social-tool" },
  { title: "TikTok Bio Link Generator", href: "/tiktok-bio-link-generator", category: "social-tool" },
  { title: "YouTube Link Generator", href: "/youtube-link-generator", category: "social-tool" },
  { title: "Facebook URL Generator", href: "/facebook-url-generator", category: "social-tool" },
  { title: "LinkedIn URL Generator", href: "/linkedin-url-generator", category: "social-tool" },
  { title: "Pinterest Link Generator", href: "/pinterest-link-generator", category: "social-tool" },
  { title: "Snapchat Link Generator", href: "/snapchat-link-generator", category: "social-tool" },
  { title: "Reddit Link Generator", href: "/reddit-link-generator", category: "social-tool" },
  { title: "Discord Link Generator", href: "/discord-link-generator", category: "social-tool" },
  { title: "Twitch Link Generator", href: "/twitch-link-generator", category: "social-tool" },
  { title: "Twitter/X Link Generator", href: "/twitter-link-generator", category: "social-tool" },
  { title: "Threads Link Generator", href: "/threads-link-generator", category: "social-tool" },
  { title: "Mastodon Link Generator", href: "/mastodon-link-generator", category: "social-tool" },
]

export const qrPages: PageEntry[] = [
  { title: "QR Code Generator", href: "/qr-code-generator", category: "qr" },
  { title: "Dynamic QR Code Generator", href: "/dynamic-qr-code-generator", category: "qr" },
  { title: "Free QR Code Generator", href: "/free-qr-code-generator", category: "qr" },
  { title: "QR Code for WiFi", href: "/qr-code-for-wifi", category: "qr" },
  { title: "QR Code for vCard", href: "/qr-code-for-vcard", category: "qr" },
  { title: "QR Code for Business Card", href: "/qr-code-for-business-card", category: "qr" },
  { title: "QR Code for Restaurant Menu", href: "/qr-code-for-restaurant-menu", category: "qr" },
  { title: "QR Code for App Download", href: "/qr-code-for-app-download", category: "qr" },
  { title: "QR Code for Google Maps", href: "/qr-code-for-google-maps", category: "qr" },
  { title: "QR Code for Google Reviews", href: "/qr-code-for-google-reviews", category: "qr" },
  { title: "QR Code for Facebook", href: "/qr-code-for-facebook", category: "qr" },
  { title: "QR Code for Instagram", href: "/qr-code-for-instagram", category: "qr" },
  { title: "QR Code for LinkedIn", href: "/qr-code-for-linkedin", category: "qr" },
  { title: "QR Code for YouTube", href: "/qr-code-for-youtube", category: "qr" },
  { title: "QR Code for WhatsApp", href: "/qr-code-for-whatsapp", category: "qr" },
  { title: "QR Code for Email", href: "/qr-code-for-email", category: "qr" },
  { title: "QR Code for SMS", href: "/qr-code-for-sms", category: "qr" },
  { title: "QR Code for Phone", href: "/qr-code-for-phone", category: "qr" },
  { title: "QR Code for Event", href: "/qr-code-for-event", category: "qr" },
  { title: "QR Code for PDF", href: "/qr-code-for-pdf", category: "qr" },
  { title: "QR Code for Restaurant", href: "/qr-code-for-restaurant", category: "qr" },
  { title: "QR Code for Hotel", href: "/qr-code-for-hotel", category: "qr" },
  { title: "QR Code for Gym", href: "/qr-code-for-gym", category: "qr" },
  { title: "QR Code for Salon", href: "/qr-code-for-salon", category: "qr" },
  { title: "QR Code for Store", href: "/qr-code-for-store", category: "qr" },
  { title: "QR Code for Resume", href: "/qr-code-for-resume", category: "qr" },
  { title: "QR Code for Portfolio", href: "/qr-code-for-portfolio", category: "qr" },
  { title: "QR Code for Wedding", href: "/qr-code-for-wedding", category: "qr" },
  { title: "QR Code for Birthday", href: "/qr-code-for-birthday", category: "qr" },
  { title: "QR Code for Concert", href: "/qr-code-for-concert", category: "qr" },
  { title: "QR Code for Class", href: "/qr-code-for-class", category: "qr" },
  { title: "QR Code for Fundraiser", href: "/qr-code-for-fundraiser", category: "qr" },
]

export function getRelatedPages(currentHref: string, count = 6): PageEntry[] {
  const all = [...allPages, ...socialPages]
  const current = all.find((p) => p.href === currentHref)
  const category = current?.category

  let sameCategory: PageEntry[] = []
  let others: PageEntry[] = []

  for (const p of all) {
    if (p.href === currentHref) continue
    if (category && p.category === category) {
      sameCategory.push(p)
    } else {
      others.push(p)
    }
  }

  const result = [...sameCategory, ...others]
  return result.slice(0, count)
}

export function getRelatedQrPages(currentHref: string, count = 6): PageEntry[] {
  return qrPages.filter((p) => p.href !== currentHref).slice(0, count)
}

export const allLandingPages = [...allPages, ...socialPages]
export const allQRCodes = [...allPages, ...socialPages, ...qrPages]
