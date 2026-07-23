import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"
import { getPageContent } from "@/lib/page-translations"

const pageKey = "telegram-link-generator"
const pagePath = "/telegram-link-generator"

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
    <URLLandingPage
      title={content.title}
      subtitle={content.subtitle}
      description={content.description}
      placeholder="https://example.com/your-telegram-content"
      inputLabel="Enter your Telegram URL or content link"
      generateLabel="Generate Link"
      features={content.features}
      howItWorks={content.howItWorks}
      useCases={content.useCases}
      relatedPages={getRelatedPages(pagePath)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={content.faqs}
      relatedArticles={relatedArticles}
    />
  )
}
