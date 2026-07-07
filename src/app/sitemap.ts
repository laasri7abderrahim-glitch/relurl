import type { MetadataRoute } from "next"
import { getAllSlugs } from "@/lib/blog/posts"

const baseUrl = "https://relurl.com"
const locales = ["en", "fr"] as const

function localizedUrls(path: string, priority = 0.8): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${baseUrl}/${locale}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : priority,
  }))
}

function staticPages(priority = 0.9): MetadataRoute.Sitemap {
  const pages = [
    "",
    "/features",
    "/pricing",
    "/integrations",
    "/changelog",
    "/blog",
    "/contact",
    "/privacy",
    "/terms",
    "/cookies",
    "/gdpr",
    "/dmca",
    "/wordpress",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ]
  return pages.flatMap((p) => localizedUrls(p, p === "" ? 1 : priority))
}

function blogPages(priority = 0.8): MetadataRoute.Sitemap {
  const slugs = getAllSlugs()
  return slugs.flatMap((slug) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority,
    }))
  )
}

function landingPages(priority = 0.85): MetadataRoute.Sitemap {
  const paths = [
    "/custom-url-shortener",
    "/branded-link-shortener",
    "/bulk-url-shortener",
    "/affiliate-link-shortener",
    "/marketing-url-shortener",
    "/free-url-shortener",
    "/url-tracking-tool",
    "/campaign-link-generator",
    "/short-url-analytics",
    "/custom-alias-generator",
    "/ecommerce-url-shortener",
    "/real-estate-link-shortener",
    "/saas-link-shortener",
    "/podcast-link-shortener",
    "/event-link-shortener",
    "/news-link-shortener",
    "/education-link-shortener",
    "/healthcare-link-shortener",
    "/nonprofit-link-shortener",
    "/travel-link-shortener",
    "/restaurant-link-shortener",
    "/music-link-shortener",
    "/photography-link-shortener",
    "/gaming-link-shortener",
    "/crypto-link-shortener",
    "/agency-link-shortener",
    "/startup-link-shortener",
    "/ebook-link-shortener",
    "/course-link-shortener",
    "/webinar-link-shortener",
    "/password-protected-links",
    "/link-expiration",
    "/url-shortener-api",
    "/custom-domain-links",
    "/link-in-bio",
    "/shorten-pdf-link",
    "/shorten-image-url",
    "/shorten-video-url",
    "/shorten-github-url",
    "/shorten-google-drive-link",
    "/shorten-google-docs-link",
    "/shorten-dropbox-link",
  ]
  return paths.flatMap((p) => localizedUrls(p, priority))
}

function socialPages(priority = 0.8): MetadataRoute.Sitemap {
  const paths = [
    "/instagram-link-generator",
    "/whatsapp-link-generator",
    "/telegram-link-generator",
    "/tiktok-bio-link-generator",
    "/youtube-link-generator",
    "/facebook-url-generator",
    "/linkedin-url-generator",
    "/pinterest-link-generator",
    "/snapchat-link-generator",
    "/reddit-link-generator",
    "/discord-link-generator",
    "/twitch-link-generator",
    "/twitter-link-generator",
    "/threads-link-generator",
    "/mastodon-link-generator",
    "/shorten-youtube-url",
    "/shorten-instagram-url",
    "/shorten-facebook-url",
    "/shorten-whatsapp-link",
    "/shorten-linkedin-url",
    "/shorten-tiktok-url",
    "/shorten-x-url",
    "/shorten-discord-invite-link",
  ]
  return paths.flatMap((p) => localizedUrls(p, priority))
}

function qrPages(priority = 0.85): MetadataRoute.Sitemap {
  const paths = [
    "/qr-code-generator",
    "/dynamic-qr-code-generator",
    "/free-qr-code-generator",
    "/qr-code-for-wifi",
    "/qr-code-for-vcard",
    "/qr-code-for-business-card",
    "/qr-code-for-restaurant-menu",
    "/qr-code-for-app-download",
    "/qr-code-for-google-maps",
    "/qr-code-for-google-reviews",
    "/qr-code-for-facebook",
    "/qr-code-for-instagram",
    "/qr-code-for-linkedin",
    "/qr-code-for-youtube",
    "/qr-code-for-whatsapp",
    "/qr-code-for-email",
    "/qr-code-for-sms",
    "/qr-code-for-phone",
    "/qr-code-for-event",
    "/qr-code-for-pdf",
    "/qr-code-for-restaurant",
    "/qr-code-for-hotel",
    "/qr-code-for-gym",
    "/qr-code-for-salon",
    "/qr-code-for-store",
    "/qr-code-for-resume",
    "/qr-code-for-portfolio",
    "/qr-code-for-wedding",
    "/qr-code-for-birthday",
    "/qr-code-for-concert",
    "/qr-code-for-class",
    "/qr-code-for-fundraiser",
  ]
  return paths.flatMap((p) => localizedUrls(p, priority))
}

function comparisonPages(priority = 0.8): MetadataRoute.Sitemap {
  const paths = [
    "/bitly-alternative",
    "/tinyurl-alternative",
    "/rebrandly-alternative",
    "/short-io-alternative",
    "/best-url-shortener",
  ]
  return paths.flatMap((p) => localizedUrls(p, priority))
}

function guidePages(priority = 0.8): MetadataRoute.Sitemap {
  const paths = [
    "/how-to-shorten-a-url",
    "/how-to-create-short-links",
    "/how-to-track-link-clicks",
    "/how-to-create-qr-codes",
    "/how-to-create-branded-links",
    "/how-to-use-utm-parameters",
  ]
  return paths.flatMap((p) => localizedUrls(p, priority))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    ...staticPages(0.9),
    ...landingPages(),
    ...socialPages(0.8),
    ...qrPages(),
    ...comparisonPages(),
    ...guidePages(),
    ...blogPages(),
  ]
}
