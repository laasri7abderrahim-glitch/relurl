import { NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { notFound } from "next/navigation"
import { RevealAnimations } from "@/components/ui/reveal-animations"

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

  return {
    title: {
      default: t("siteDescription"),
      template: "%s | " + t("siteName"),
    },
    description: t("siteDescription"),
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

      <RevealAnimations>
        {children}
      </RevealAnimations>
    </NextIntlClientProvider>
  )
}
