import { Metadata } from "next"

const siteName = "RELURL"
const baseUrl = "https://relurl.com"
const defaultImage = `${baseUrl}/og-image.png`

interface SEOProps {
  title: string
  description: string
  path: string
  keywords?: string[]
  type?: "website" | "article"
}

export function generateSEOMetadata({
  title,
  description,
  path,
  keywords = [],
  type = "website",
}: SEOProps): Metadata {
  const url = `${baseUrl}${path}`

  return {
    title,
    description,
    keywords: ["url shortener", "short links", "link analytics", "QR codes", ...keywords].join(", "),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName,
      images: [
        {
          url: defaultImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [defaultImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

export function generateWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: baseUrl,
    description: "Free URL shortener with analytics, QR codes, and branded links",
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }
}

export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    sameAs: [],
    description: "RELURL is a free URL shortener service with analytics, QR codes, and branded short links.",
  }
}

export function generateFAQJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

export function generateSoftwareAppJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "RELURL",
    applicationCategory: "WebApplication",
    operatingSystem: "Web",
    url: baseUrl,
    description: "Free URL shortener with analytics, QR codes, and branded links",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  }
}
