import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { HeroSection } from "@/MARKETPLACE/src/components/layout/hero"
import { CategoryGrid } from "@/MARKETPLACE/src/components/categories/category-grid"
import { FeaturedListings } from "@/MARKETPLACE/src/components/listings/featured-listings"
import { CitySelector } from "@/MARKETPLACE/src/components/search/city-selector"
import { WhyMarocMarket } from "@/MARKETPLACE/src/components/layout/why-marocmarket"
import { generateHomeMetadata } from "@/MARKETPLACE/src/lib/seo"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const meta = generateHomeMetadata(locale as "fr" | "ar")
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: meta.ogTitle,
      description: meta.ogDescription,
    },
  }
}

export default async function MarketplaceHome({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "marketplace" })
  const isArabic = locale === "ar"

  return (
    <div>
      <HeroSection locale={locale} />
      <CategoryGrid locale={locale} />
      <FeaturedListings locale={locale} />
      <CitySelector locale={locale} />
      <WhyMarocMarket locale={locale} />
    </div>
  )
}
