import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"
import { allQRCodes, getRelatedQrPages } from "@/lib/url-pages"
import { getPageContent } from "@/lib/page-translations"

const pageKey = "qr-code-for-resume"
const pagePath = "/qr-code-for-resume"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const content = await getPageContent(locale, pageKey)
  return generateSEOMetadata({
    title: content.title,
    description: content.metaDescription,
    path: pagePath,
    keywords: content.keywords,
    locale,
  })
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const content = await getPageContent(locale, pageKey)
  const relatedArticles = getPostsByLandingPage(pagePath).slice(0, 3)
  return (
    <QRCodeLandingPage
      title={content.title}
      subtitle={content.subtitle}
      description={content.description}
      placeholder="https://your-portfolio.com/resume"
      defaultValue="https://your-portfolio.com/resume"
      inputLabel="Enter your resume or portfolio URL"
      generateLabel="Create Resume QR Code"
      features={content.features}
      howItWorks={content.howItWorks}
      useCases={content.useCases}
      relatedPages={getRelatedQrPages(pagePath)}
      allQRCodes={allQRCodes}
      faqs={content.faqs}
      relatedArticles={relatedArticles}
    />
  )
}
