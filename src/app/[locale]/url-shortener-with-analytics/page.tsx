import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "URL Shortener with Analytics",
    description: "Shorten URLs and track every click with detailed analytics. RELURL provides real-time click data, geographic insights, device tracking, and referral sources for all links.",
    path: "/url-shortener-with-analytics",
    keywords: ["url shortener with analytics", "trackable url shortener", "link click analytics", "short link analytics"],
    locale,
  })
}

export default function Page() {
  const href = "/url-shortener-with-analytics"
  const relatedArticles = getPostsByLandingPage("/free-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="URL Shortener with Analytics"
      subtitle="Track Every Click"
      description="Shorten URLs and track every click with detailed analytics. RELURL provides real-time click data, geographic insights, device tracking, and referral sources for all links."
      placeholder="Paste your URL for tracking..."
      generateLabel="Track Clicks"
      features={["Click Analytics", "Real-time Tracking", "Click Geo-Location", "Device Targeting", "CSV Export", "Campaign Tracking"]}
      howItWorks={[
        { step: "Shorten Your URL", desc: "Paste any URL and shorten it with RELURL to start tracking immediately." },
        { step: "View Analytics Dashboard", desc: "Access real-time data on clicks, locations, devices, and referral sources from your dashboard." },
        { step: "Optimize Your Strategy", desc: "Use click data to refine your marketing campaigns and improve engagement across channels." },
      ]}
      useCases={["Track click-through rates on email marketing campaigns", "Monitor geographic distribution of your audience", "Measure device breakdown for link interactions", "Identify top referral sources driving traffic", "Export analytics data to CSV for custom reporting"]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "What analytics data does RELURL provide?", a: "RELURL shows total clicks, unique clicks, geographic location, device type, browser, operating system, and referrer source." },
        { q: "Is analytics data available in real time?", a: "Yes, all analytics are updated in real time so you can monitor link performance as it happens." },
        { q: "Can I export my analytics data?", a: "Absolutely. You can export your link analytics as a CSV file for further analysis in your preferred tools." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
