import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "URL Shortener for Marketers",
    description: "Campaign-ready URL shortener for marketers. Track campaign performance, build UTM parameters, manage multi-channel links, and optimize your marketing ROI with RELURL.",
    path: "/url-shortener-for-marketers",
    keywords: ["url shortener for marketers", "marketing url shortener", "campaign link shortener", "marketing link management"],
    locale,
  })
}

export default function Page() {
  const href = "/url-shortener-for-marketers"
  const relatedArticles = getPostsByLandingPage("/free-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="URL Shortener for Marketers"
      subtitle="Campaign-Ready Links"
      description="Campaign-ready URL shortener for marketers. Track campaign performance, build UTM parameters, manage multi-channel links, and optimize your marketing ROI with RELURL."
      placeholder="Paste your campaign URL..."
      generateLabel="Marketing Plan"
      features={["Campaign Tracking", "UTM Builder", "Click Analytics", "Custom Branded Slugs", "Bulk Shortening", "Geo-Targeting"]}
      howItWorks={[
        { step: "Create Your Campaign Link", desc: "Paste your destination URL and add UTM parameters for campaign attribution." },
        { step: "Customize & Brand", desc: "Set custom slugs and choose tracking options to match your marketing campaign." },
        { step: "Track Multi-Channel Performance", desc: "Monitor clicks, conversions, and engagement across all your marketing channels in real time." },
      ]}
      useCases={["Track email newsletter click-through rates with precision", "Manage multi-channel campaign links from one dashboard", "Build and save UTM-parameterized links effortlessly", "A/B test different link destinations for campaign optimization", "Create branded short links for paid ad campaigns"]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "Can I add UTM parameters to my shortened links?", a: "Yes, RELURL has a built-in UTM builder that makes adding tracking parameters quick and error-free." },
        { q: "Can I see which marketing channel drives the most clicks?", a: "Absolutely. RELURL analytics break down clicks by referrer, device, location, and campaign tag." },
        { q: "Can I bulk create links for multiple campaigns?", a: "Yes, RELURL supports bulk link creation and CSV export for easy campaign management." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
