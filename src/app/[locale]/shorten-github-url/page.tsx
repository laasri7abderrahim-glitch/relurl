import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"
import { getPageContent } from "@/lib/page-translations"

const pageKey = "shorten-github-url"
const pagePath = "/shorten-github-url"

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
      placeholder="https://github.com/username/repository-name"
      generateLabel="Shorten GitHub URL"
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
