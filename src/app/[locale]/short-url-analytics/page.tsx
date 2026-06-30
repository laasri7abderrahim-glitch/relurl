import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Short URL Analytics - Click Analytics",
    description: "Get detailed analytics for every short URL. Track clicks, geographic data, devices, browsers, and referrers in real time.",
    path: "/short-url-analytics",
    keywords: ["short url analytics", "link analytics", "click analytics"],
    locale,
  })
}

export default function ShortURLAnalyticsPage() {
  const href = "/short-url-analytics"
  const relatedArticles = getPostsByLandingPage("/short-url-analytics").slice(0, 3)
  return (
    <URLLandingPage
      title="Short URL Analytics"
      subtitle="Data-Driven Link Management"
      description="Unlock powerful analytics for every shortened URL. See exactly who clicks your links, where they come from, and what devices they use."
      placeholder="https://example.com/your-url"
      inputLabel="Enter URL to analyze"
      generateLabel="Create & Analyze"
      features={[
        "Real-Time Dashboard",
        "Country & City Tracking",
        "Browser & OS Breakdown",
        "Device Type Analytics",
        "Referrer Source Data",
        "Click Trend Charts",
      ]}
      howItWorks={[
        { step: "Create Short URL", desc: "Shorten any URL to start collecting analytics." },
        { step: "Share & Collect Data", desc: "Distribute your link and let clicks roll in." },
        { step: "Analyze Performance", desc: "View detailed analytics and optimize your strategy." },
      ]}
      useCases={[
        "Marketing ROI measurement",
        "Content performance analysis",
        "Social media engagement tracking",
        "Email campaign optimization",
        "Website traffic source analysis",
        "Audience demographics research",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}

      relatedArticles={relatedArticles}
    />
  )
}