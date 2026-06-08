import { prisma } from "@/lib/prisma"
import type { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://relurl.com"

  let shortLinkEntries: MetadataRoute.Sitemap = []
  try {
    const links = await prisma.shortLink.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    })
    shortLinkEntries = links.map((link) => ({
      url: `${baseUrl}/${link.slug}`,
      lastModified: link.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.7,
    }))
  } catch {}

  const qrPages = [
    "/qr-code-generator",
    "/dynamic-qr-code-generator",
    "/free-qr-code-generator",
    "/qr-code-for-pdf",
    "/qr-code-for-wifi",
    "/qr-code-for-business-card",
    "/qr-code-for-restaurant-menu",
    "/qr-code-for-google-reviews",
    "/qr-code-for-instagram",
    "/qr-code-for-whatsapp",
    "/qr-code-for-youtube",
    "/qr-code-for-facebook",
    "/qr-code-for-linkedin",
    "/qr-code-for-email",
    "/qr-code-for-phone",
    "/qr-code-for-sms",
    "/qr-code-for-event",
    "/qr-code-for-vcard",
    "/qr-code-for-google-maps",
    "/qr-code-for-app-download",
  ]

  const qrEntries: MetadataRoute.Sitemap = qrPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  const urlShortenerPages = [
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
  ]

  const urlEntries: MetadataRoute.Sitemap = urlShortenerPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  const socialPages = [
    "/instagram-link-generator",
    "/whatsapp-link-generator",
    "/telegram-link-generator",
    "/tiktok-bio-link-generator",
    "/youtube-link-generator",
    "/facebook-url-generator",
    "/linkedin-url-generator",
  ]

  const socialEntries: MetadataRoute.Sitemap = socialPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/features`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/integrations`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/api`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/changelog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/register`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/cookies`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/gdpr`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/dmca`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/dashboard`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    ...qrEntries,
    ...urlEntries,
    ...socialEntries,
    ...shortLinkEntries,
  ]
}
