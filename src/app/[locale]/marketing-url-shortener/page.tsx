import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Marketing URL Shortener - Campaign Links",
    description: "Shorten URLs for marketing campaigns. Track clicks, measure ROI, and optimize your marketing with detailed link analytics.",
    path: "/marketing-url-shortener",
    keywords: ["marketing url shortener", "campaign link shortener", "marketing links"],
    locale,
  })
}

export default function MarketingURLShortenerPage() {
  const href = "/marketing-url-shortener"
  const relatedArticles = getPostsByLandingPage("/marketing-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="Marketing URL Shortener"
      subtitle="Optimize Every Campaign"
      description="Create trackable short links for your marketing campaigns. Monitor performance across channels and optimize your marketing spend with real-time data."
      placeholder="https://your-site.com/spring-sale-2024?utm_source=email&utm_medium=newsletter"
      inputLabel="Enter your campaign URL"
      generateLabel="Shorten URL"
      features={[
        "UTM Parameter Support",
        "Campaign Tracking",
        "Multi-Channel Analytics",
        "A/B Testing",
        "Retargeting Pixels",
        "QR Code Generation",
      ]}
      howItWorks={[
        { step: "Paste Campaign URL", desc: "Enter your marketing URL with UTM parameters." },
        { step: "Set Tracking Options", desc: "Add campaign tags and targeting rules." },
        { step: "Analyze Results", desc: "Track clicks, conversions, and ROI per campaign." },
      ]}
      useCases={[
        "Email marketing campaigns",
        "Social media advertising",
        "PPC and Google Ads",
        "Influencer marketing",
        "Print and billboard campaigns",
        "Event and webinar promotions",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}

      relatedArticles={relatedArticles}
    />
  )
}