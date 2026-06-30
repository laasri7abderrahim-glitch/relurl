import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "News Link Shortener - Article & Story Links",
    description: "Shorten news articles and stories for easy social sharing. Track readership, optimize headlines, and boost engagement with RELURL.",
    path: "/news-link-shortener",
    keywords: ["news link shortener", "article link generator", "journalism links"],
    locale,
  })
}

export default function NewsLinkShortenerPage() {
  const href = "/news-link-shortener"
  const relatedArticles = getPostsByLandingPage("/news-link-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="News Link Shortener"
      subtitle="Simplify News Sharing"
      description="Shorten news articles and stories for easy social sharing. Track readership, optimize headlines, and boost audience engagement."
      placeholder="https://your-news-site.com/articles/breaking-story"
      inputLabel="Enter your article URL"
      generateLabel="Shorten URL"
      features={[
        "Headline-Optimized Links",
        "Reader Engagement Tracking",
        "Social Media Integration",
        "Breaking News Speed",
        "Archive-Friendly URLs",
        "Multi-Format Sharing",
      ]}
      howItWorks={[
        { step: "Paste Article URL", desc: "Enter your news article or story link." },
        { step: "Generate Short Link", desc: "Create a clean, shareable URL for your audience." },
        { step: "Publish & Track", desc: "Share across platforms and monitor reader engagement." },
      ]}
      useCases={[
        "Breaking news social sharing",
        "Newsletter article roundups",
        "Journalist source links",
        "News aggregator submissions",
        "Podcast show notes",
        "Press release distribution",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}

      relatedArticles={relatedArticles}
    />
  )
}