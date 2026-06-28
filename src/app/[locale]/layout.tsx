import { NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { notFound } from "next/navigation"
import Script from "next/script"

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

  return {
    alternates: {
      canonical: `https://relurl.com/${locale === "en" ? "" : locale}`,
      languages: {
        en: "https://relurl.com/en",
        fr: "https://relurl.com/fr",
        "x-default": "https://relurl.com",
      },
    },
    openGraph: {
      locale: locale === "fr" ? "fr_FR" : "en_US",
      siteName: t("siteName"),
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
      <Script
        id="schema-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "RELURL",
            url: "https://relurl.com",
            logo: "https://relurl.com/logo.png",
            description: "RELURL is a free URL shortener service with analytics, QR codes, and branded short links.",
          }),
        }}
      />
      <Script
        id="schema-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
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
