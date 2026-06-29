import { prisma } from "@/lib/prisma"
import type { MetadataRoute } from "next"

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

function staticPages(priority = 0.8): MetadataRoute.Sitemap {
  const pages = [
    "",
    "/features",
    "/pricing",
    "/integrations",
    "/changelog",
    "/login",
    "/register",
    "/blog",
    "/contact",
    "/privacy",
    "/terms",
    "/cookies",
    "/gdpr",
    "/dmca",
    "/dashboard",
    "/wordpress",
  ]
  return pages.flatMap((p) => localizedUrls(p, p === "" ? 1 : priority))
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let shortLinkEntries: MetadataRoute.Sitemap = []
  try {
    const links = await prisma.shortLink.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    })
    shortLinkEntries = links.flatMap((link) =>
      locales.map((locale) => ({
        url: `${baseUrl}/${locale}/${link.slug}`,
        lastModified: link.updatedAt,
        changeFrequency: "daily" as const,
        priority: 0.7,
      }))
    )
  } catch {}

  return [
    ...staticPages(0.9),
    ...landingPages(),
    ...socialPages(0.8),
    ...qrPages(),
    ...shortLinkEntries,
  ]
}
