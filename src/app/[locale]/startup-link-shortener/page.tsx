import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"
import { getPageContent } from "@/lib/page-translations"

const pageKey = "startup-link-shortener"
const pagePath = "/startup-link-shortener"

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
      placeholder="https://your-startup.com/landing/beta-signup"
      inputLabel="Enter your startup URL"
      generateLabel="Shorten URL"
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
