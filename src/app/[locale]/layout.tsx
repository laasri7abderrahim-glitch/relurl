import { NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { notFound } from "next/navigation"
import { headers } from "next/headers"

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "seo" })

  const baseUrl = "https://relurl.com"

  let currentPath = "/"
  try {
    const h = await headers()
    const rawUrl = h.get("x-url") || h.get("next-url") || h.get("x-invoke-path") || h.get("x-middleware-invoke-path") || ""
    if (rawUrl) {
      try {
        const parsed = new URL(rawUrl.startsWith("http") ? rawUrl : `https://relurl.com${rawUrl}`)
        const p = parsed.pathname
        const localePrefix = `/${locale}`
        currentPath = p.startsWith(localePrefix) ? p.slice(localePrefix.length) || "/" : "/"
      } catch {
        const localePrefix = `/${locale}`
        currentPath = rawUrl.startsWith(localePrefix) ? rawUrl.slice(localePrefix.length) || "/" : "/"
      }
    }
  } catch {}

  const languages: Record<string, string> = {}
  for (const l of routing.locales) {
    languages[l] = `${baseUrl}/${l}${currentPath}`
  }
  languages["x-default"] = `${baseUrl}/en${currentPath}`

  return {
    title: {
      default: t("siteDescription"),
      template: "%s | " + t("siteName"),
    },
    description: t("siteDescription"),
    alternates: {
      canonical: `${baseUrl}/${locale}${currentPath}`,
      languages,
    },
    openGraph: {
      locale: locale === "ar" ? "ar_MA" : locale === "fr" ? "fr_FR" : locale === "es" ? "es_ES" : "en_US",
      siteName: t("siteName"),
      title: t("siteName"),
      description: t("siteDescription"),
      images: [{ url: "/api/og", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@relurl",
      title: t("siteName"),
      description: t("siteDescription"),
      images: ["/api/og"],
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

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": "https://relurl.com/#organization",
            name: "RELURL",
            url: "https://relurl.com",
            logo: "https://relurl.com/favicon.svg",
            description: "RELURL is a free URL shortener service with analytics, QR codes, and branded short links.",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": "https://relurl.com/#website",
            name: "RELURL",
            url: "https://relurl.com",
            description: "Free URL shortener with analytics, QR codes, and branded links",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://relurl.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />

      {children}
    </NextIntlClientProvider>
  )
}
