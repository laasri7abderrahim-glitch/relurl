import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/admin/", "/api/", "/_next/", "/p/", "/login", "/register", "/forgot-password", "/reset-password"],
      },
    ],
    sitemap: ["https://relurl.com/sitemap/translated.xml", "https://relurl.com/sitemap/landing.xml", "https://relurl.com/sitemap/tools.xml", "https://relurl.com/sitemap/static.xml"],
  }
}
