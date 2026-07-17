import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ListingGallery } from "@/MARKETPLACE/src/components/listings/listing-gallery"
import { ListingInfo } from "@/MARKETPLACE/src/components/listings/listing-info"
import { ListingSidebar } from "@/MARKETPLACE/src/components/listings/listing-sidebar"
import { SimilarListings } from "@/MARKETPLACE/src/components/listings/similar-listings"
import { generateListingMetadata, generateJsonLdProduct, generateJsonLdBreadcrumb } from "@/MARKETPLACE/src/lib/seo"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const listing = await getListingBySlug(slug)
  if (!listing) return {}
  const meta = generateListingMetadata(
    listing.title,
    listing.description,
    listing.city,
    listing.category?.nameFr,
    listing.price ?? undefined,
    locale as "fr" | "ar"
  )
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: meta.ogTitle,
      description: meta.ogDescription,
      images: listing.images?.[0]?.url ? [{ url: listing.images[0].url }] : [],
    },
  }
}

async function getListingBySlug(slug: string) {
  return null
}

export default async function ListingDetailPage({ params }: Props) {
  const { locale, slug } = await params
  const t = await getTranslations({ locale, namespace: "marketplace" })
  const isArabic = locale === "ar"

  const listing = await getListingBySlug(slug)
  if (!listing) notFound()

  const jsonLd = generateJsonLdProduct(
    listing.title,
    listing.description,
    listing.price,
    listing.currency,
    listing.images?.[0]?.url ?? null,
    `https://marocmarket.ma/${locale}/marketplace/listing/${slug}`,
    listing.condition
  )

  const breadcrumbJsonLd = generateJsonLdBreadcrumb([
    { name: t("nav.home"), url: `https://marocmarket.ma/${locale}/marketplace` },
    { name: listing.category?.nameFr || "", url: `https://marocmarket.ma/${locale}/marketplace/categories/${listing.category?.slug}` },
    { name: listing.title, url: `https://marocmarket.ma/${locale}/marketplace/listing/${slug}` },
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/marketplace">{t("nav.home")}</Link>
        <span>/</span>
        <Link href={`/marketplace/categories/${listing.category?.slug}`}>
          {isArabic ? listing.category?.nameAr : listing.category?.nameFr}
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-gray-100">{listing.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ListingGallery images={listing.images || []} title={listing.title} />
          <ListingInfo listing={listing} locale={locale} />
        </div>
        <div>
          <ListingSidebar listing={listing} locale={locale} />
        </div>
      </div>

      <SimilarListings
        categoryId={listing.categoryId}
        excludeId={listing.id}
        locale={locale}
      />
    </div>
  )
}
