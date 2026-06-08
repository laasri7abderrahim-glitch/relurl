import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"

export const metadata = generateSEOMetadata({
  title: "URL Tracking Tool - Track Link Clicks",
  description: "Track every click on your shortened URLs. Get real-time analytics on location, devices, referrers, and more with RELURL.",
  path: "/url-tracking-tool",
  keywords: ["url tracking tool", "link tracking", "click tracking"],
})

export default function URLTrackingToolPage() {
  const href = "/url-tracking-tool"
  return (
    <URLLandingPage
      title="URL Tracking Tool"
      subtitle="Know Every Click"
      description="Track every click on your links with detailed analytics. See where your audience is, what devices they use, and how they find your content."
      placeholder="https://example.com/track-this-url"
      inputLabel="Enter URL to track"
      generateLabel="Create Tracked Link"
      features={[
        "Real-Time Click Data",
        "Geographic Analytics",
        "Device & Browser Detection",
        "Referrer Tracking",
        "UTM Parameter Support",
        "Custom Event Tracking",
      ]}
      howItWorks={[
        { step: "Create Tracked Link", desc: "Shorten your URL to enable click tracking." },
        { step: "Share Your Link", desc: "Distribute your tracked link across channels." },
        { step: "View Analytics", desc: "Monitor clicks, locations, and engagement in real time." },
      ]}
      useCases={[
        "Marketing campaign measurement",
        "Content performance tracking",
        "Social media analytics",
        "Email click tracking",
        "A/B test link comparison",
        "Influencer campaign monitoring",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
    />
  )
}
