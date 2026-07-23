import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"
import { allQRCodes, getRelatedQrPages } from "@/lib/url-pages"
import { getPageContent } from "@/lib/page-translations"

const pageKey = "qr-code-for-gym"
const pagePath = "/qr-code-for-gym"

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
      placeholder="https://your-gym.com/classes/schedule"
      defaultValue="https://your-gym.com/classes/schedule"
      inputLabel="Enter your gym service URL"
      generateLabel="Create Gym QR Code"
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
