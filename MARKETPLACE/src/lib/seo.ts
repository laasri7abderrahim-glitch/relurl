interface SEOMetadata {
  title: string
  description: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  canonical?: string
  keywords?: string
}

export function generateListingMetadata(
  title: string,
  description: string,
  city?: string,
  category?: string,
  price?: number,
  locale: "fr" | "ar" = "fr"
): SEOMetadata {
  const siteName = "MarocMarket"
  const isArabic = locale === "ar"

  const seoTitle = isArabic
    ? `${title} - ${city || ""} - ${siteName}`
    : `${title}${city ? ` à ${city}` : ""} - ${siteName}`

  const seoDescription = isArabic
    ? `${description.slice(0, 150)}... اشترِ أو بيع ${category || "منتجات"} في ${city || "المغرب"}.`
    : `${description.slice(0, 150)}... Achetez ou vendez ${category || "des produits"} ${city ? `à ${city}` : "au Maroc"}.`

  return {
    title: seoTitle,
    description: seoDescription,
    ogTitle: seoTitle,
    ogDescription: seoDescription,
    keywords: `${title}, ${city || ""}, ${category || ""}, Maroc, ${siteName}, vente, achat, ${isArabic ? "بيع, شراء, المغرب" : "achat, vente, Maroc"}`,
  }
}

export function generateCategoryMetadata(
  categoryFr: string,
  categoryAr: string,
  city?: string,
  locale: "fr" | "ar" = "fr"
): SEOMetadata {
  const siteName = "MarocMarket"
  const isArabic = locale === "ar"
  const cat = isArabic ? categoryAr : categoryFr

  const title = isArabic
    ? `${cat} ${city ? `في ${city}` : ""} - ${siteName}`
    : `${cat}${city ? ` à ${city}` : ""} - ${siteName}`

  const description = isArabic
    ? `أفضل عروض ${cat} ${city ? `في ${city}` : "في المغرب"}. اشترِ، بيع، أو استأجر ${cat} بسهولة على ${siteName}.`
    : `Les meilleures offres de ${cat}${city ? ` à ${city}` : " au Maroc"}. Achetez, vendez ou louez ${cat} facilement sur ${siteName}.`

  return {
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    keywords: `${cat}, ${city || "Maroc"}, ${siteName}, ${isArabic ? "بيع, شراء" : "vente, achat, location"}`,
  }
}

export function generateCityMetadata(
  city: string,
  locale: "fr" | "ar" = "fr"
): SEOMetadata {
  const siteName = "MarocMarket"
  const isArabic = locale === "ar"

  const title = isArabic
    ? `إعلانات ${city} - ${siteName}`
    : `Annonces ${city} - ${siteName}`

  const description = isArabic
    ? `تصفح جميع الإعلانات المبوبة في ${city} على ${siteName}. اشترِ، بيع، أو استأجر بسهولة وأمان.`
    : `Toutes les annonces classées à ${city} sur ${siteName}. Achetez, vendez ou louez en toute simplicité et sécurité.`

  return { title, description, ogTitle: title, ogDescription: description }
}

export function generateHomeMetadata(locale: "fr" | "ar" = "fr"): SEOMetadata {
  const isArabic = locale === "ar"
  return {
    title: isArabic
      ? "MarocMarket - أول سوق إلكتروني في المغرب | اشترِ، بيع، واستأجر"
      : "MarocMarket - La première marketplace au Maroc | Achetez, Vendez, Louez",
    description: isArabic
      ? "MarocMarket هي أول منصة مغربية للبيع والشراء عبر الإنترنت. اشترِ، بيع، أو استأجر العقارات، السيارات، الإلكترونيات، وأكثر في المغرب."
      : "MarocMarket est la première plateforme de marketplace marocaine. Achetez, vendez ou louez immobilier, voitures, high-tech, et plus au Maroc.",
    keywords: "MarocMarket, marketplace Maroc, acheter Maroc, vendre Maroc, annonces Maroc, petites annonces, " +
      "immobilier Maroc, voiture Maroc, emploi Maroc, services Maroc",
    ogTitle: "MarocMarket - La première marketplace au Maroc",
    ogDescription: "Achetez, vendez ou louez sur la première marketplace marocaine. Des milliers d'annonces dans tout le Maroc.",
  }
}

export function generateJsonLdSearchAction() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "MarocMarket",
    url: "https://marocmarket.ma",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://marocmarket.ma/{locale}/marketplace/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  }
}

export function generateJsonLdBreadcrumb(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateJsonLdProduct(
  title: string,
  description: string,
  price: number | null,
  currency: string,
  image: string | null,
  url: string,
  condition?: string | null
) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: title,
    description: description.slice(0, 500),
    image: image || undefined,
    url,
    offers: {
      "@type": "Offer",
      price: price ?? 0,
      priceCurrency: currency,
      availability: "https://schema.org/InStock",
      ...(condition && { itemCondition: `https://schema.org/${condition === "Neuf" ? "NewCondition" : "UsedCondition"}` }),
    },
  }
}
