import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/fr/marketplace",
          "/ar/marketplace",
          "/fr/marketplace/categories",
          "/ar/marketplace/categories",
          "/fr/marketplace/listing",
          "/ar/marketplace/listing",
          "/fr/marketplace/search",
          "/ar/marketplace/search",
          "/fr/marketplace/cities",
          "/ar/marketplace/cities",
        ],
        disallow: [
          "/fr/marketplace/dashboard",
          "/ar/marketplace/dashboard",
          "/fr/marketplace/create",
          "/ar/marketplace/create",
          "/api/marketplace",
        ],
      },
    ],
    sitemap: "https://marocmarket.ma/sitemap.xml",
  }
}