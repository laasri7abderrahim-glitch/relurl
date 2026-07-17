import { MetadataRoute } from "next"

const BASE_URL = "https://marocmarket.ma"

const CATEGORIES = [
  "immobilier", "automobile", "high-tech", "mode", "maison",
  "loisirs", "sport", "beaute", "services", "emploi",
  "enfants", "animaux", "alimentation", "divers",
]

const CITIES = [
  "casablanca", "rabat", "marrakech", "agadir", "tanger",
  "fes", "meknes", "oujda", "kenitra", "tetouan",
  "safi", "mohammedia", "khouribga", "beni-mellal", "nador",
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/fr/marketplace`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/ar/marketplace`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/fr/marketplace/categories`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/ar/marketplace/categories`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/fr/marketplace/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/ar/marketplace/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/fr/marketplace/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/ar/marketplace/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ]

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.flatMap((cat) => [
    {
      url: `${BASE_URL}/fr/marketplace/categories/${cat}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/ar/marketplace/categories/${cat}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
  ])

  const cityPages: MetadataRoute.Sitemap = CITIES.flatMap((city) => [
    {
      url: `${BASE_URL}/fr/marketplace/cities/${city}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/ar/marketplace/cities/${city}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.7,
    },
  ])

  return [...staticPages, ...categoryPages, ...cityPages]
}