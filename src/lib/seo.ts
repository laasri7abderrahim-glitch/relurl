import { Metadata } from "next"

const siteName = "RELURL"
const baseUrl = "https://relurl.com"
const defaultImage = `${baseUrl}/api/og`

interface SEOProps {
  title: string
  description: string
  path: string
  keywords?: string[]
  type?: "website" | "article"
  locale?: string
  image?: string
}

function ogImageUrl(title: string, description: string): string {
  const t = encodeURIComponent(title.slice(0, 100))
  const d = encodeURIComponent(description.slice(0, 200))
  return `${baseUrl}/api/og?title=${t}&description=${d}`
}

export function generateSEOMetadata({
  title,
  description,
  path,
  keywords = [],
  type = "website",
  locale = "en",
  image,
}: SEOProps): Metadata {
  const url = `${baseUrl}/${locale}${path}`
  const ogUrl = image || ogImageUrl(title, description)
  return {
    title,
    description,
    keywords: keywords.length > 0 ? keywords.join(", ") : undefined,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName,
      images: [
        {
          url: ogUrl,
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
      images: [ogUrl],
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
    logo: `${baseUrl}/api/og`,
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

export function generateHowToJsonLd(steps: { name: string; text: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to use this tool",
    step: steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
  }
}

export function articleFor(text: string): string {
  const startsWithVowel = /^[aeiou]/i.test(text.trim())
  return startsWithVowel ? "an" : "a"
}

export function generateBreadcrumbJsonLd(items: { name: string; item: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${baseUrl}${item.item}`,
    })),
  }
}
