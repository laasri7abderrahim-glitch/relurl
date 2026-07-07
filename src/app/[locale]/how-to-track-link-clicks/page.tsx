import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "How to Track Link Clicks - Analytics Guide",
    description: "Learn how to track link clicks and measure engagement. Complete guide to using click analytics to understand your audience and optimize your content.",
    path: "/how-to-track-link-clicks",
    keywords: ["how to track link clicks", "link click tracking", "track url clicks", "link analytics guide"],
    locale,
  })
}

export default function HowToTrackLinkClicksPage() {
  const href = "/how-to-track-link-clicks"
  const relatedArticles = getPostsByLandingPage("/url-tracking-tool").slice(0, 3)
  return (
    <URLLandingPage
      title="How to Track Link Clicks"
      subtitle="Master Link Analytics"
      description="Learn how to track link clicks and measure the performance of your shared content. Understand your audience with click analytics and optimize your marketing strategy."
      placeholder="https://example.com/your-trackable-content"
      generateLabel="Create Trackable Link"
      features={[
        "Click Tracking Setup",
        "Real-Time Analytics",
        "Geographic Data",
        "Device Information",
        "Referrer Tracking",
        "Performance Reports",
      ]}
      howItWorks={[
        { step: "Create a Short Link", desc: "Shorten your URL with RELURL to make it trackable. Every shortened link automatically collects click data." },
        { step: "Share Your Link", desc: "Distribute your short link across email, social media, messaging, or other channels." },
        { step: "Review Analytics", desc: "Log into your dashboard to see clicks, locations, devices, and referrers for each link." },
      ]}
      useCases={[
        "Measure email campaign click-through rates",
        "Track social media post engagement",
        "Compare performance across marketing channels",
        "Understand your audience demographics",
        "Identify top-performing content",
        "Optimize campaign timing based on click patterns",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "What data can I see in link analytics?", a: "Your dashboard shows total clicks, unique clicks, geographic locations, device types, operating systems, browsers, referrers, and click timing data for each link." },
        { q: "Are link click counts real-time?", a: "Click data updates in near real-time. You can see clicks within minutes of them happening, allowing you to monitor campaign performance as it unfolds." },
        { q: "Can I track links shared without an account?", a: "Links shortened without an account are not tracked. To access analytics, create a free account before shortening URLs, and all your links will include click tracking." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
