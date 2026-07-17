import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { notFound } from "next/navigation"
import { marketplaceCategories } from "@/MARKETPLACE/src/data/categories"
import { ListingCard } from "@/MARKETPLACE/src/components/listings/listing-card"
import { generateCategoryMetadata } from "@/MARKETPLACE/src/lib/seo"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ locale: string; slug: string }>
  searchParams: Promise<{ city?: string; page?: string }>
}

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = []
  for (const cat of marketplaceCategories) {
    params.push({ locale: "fr", slug: cat.slug })
    params.push({ locale: "ar", slug: cat.slug })
    if (cat.children) {
      for (const child of cat.children) {
        params.push({ locale: "fr", slug: child.slug })
        params.push({ locale: "ar", slug: child.slug })
      }
    }
  }
  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const category = findCategory(slug)
  if (!category) return {}
  const meta = generateCategoryMetadata(category.nameFr, category.nameAr, undefined, locale as "fr" | "ar")
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: { title: meta.ogTitle, description: meta.ogDescription },
  }
}

function findCategory(slug: string) {
  for (const cat of marketplaceCategories) {
    if (cat.slug === slug) return cat
    const child = cat.children?.find((c) => c.slug === slug)
    if (child) return child
  }
  return null
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { locale, slug } = await params
  const { city } = await searchParams
  const t = await getTranslations({ locale, namespace: "marketplace" })
  const isArabic = locale === "ar"

  const category = findCategory(slug)
  if (!category) notFound()

  const title = isArabic ? category.nameAr : category.nameFr

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/marketplace">{t("nav.home")}</Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-gray-100">{title}</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {title}
          {city && (
            <span className="text-primary ml-2">
              {isArabic ? `في ${city}` : `à ${city}`}
            </span>
          )}
        </h1>
      </div>

      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p className="text-lg">{t("listings.noListings")}</p>
        <Link
          href="/marketplace/create"
          className="inline-block mt-4 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          {t("listings.createFirst")}
        </Link>
      </div>
    </div>
  )
}
