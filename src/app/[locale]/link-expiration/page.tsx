import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Link Expiration - Temporary URL Shortener",
    description: "Create short links with automatic expiration dates. Set time limits on your URLs for campaigns, events, and time-sensitive content.",
    path: "/link-expiration",
    keywords: ["link expiration", "temporary url shortener", "expiring links", "time limited links"],
    locale,
  })
}

export default function LinkExpirationPage() {
  const href = "/link-expiration"
  const relatedArticles = getPostsByLandingPage("/custom-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="Link Expiration"
      subtitle="Set Time Limits on Links"
      description="Create short links that automatically expire on a specific date or after a set number of clicks. Perfect for time-sensitive campaigns, event promotions, and limited-time offers."
      placeholder="https://example.com/limited-time-offer"
      generateLabel="Create Expiring Link"
      features={[
        "Automatic Link Expiry",
        "Date-Based Expiration",
        "Click-Based Expiration",
        "Expired Link Redirect",
        "Campaign Management",
        "Expiration Notifications",
      ]}
      howItWorks={[
        { step: "Enter Your URL", desc: "Paste the link you want to set an expiration for." },
        { step: "Set Expiration Rules", desc: "Choose an expiration date or maximum click count." },
        { step: "Share with Confidence", desc: "Share your link knowing it will automatically deactivate when conditions are met." },
      ]}
      useCases={[
        "Time-limited promotional campaigns",
        "Event registration links that close after the event",
        "Flash sale and limited-time offer URLs",
        "Temporary document sharing for projects",
        "Beta access links with expiration dates",
        "Seasonal marketing campaign links",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "What happens when a link expires?", a: "When a link expires, visitors see a notification that the link is no longer active. You can configure a custom redirect URL for expired links if desired." },
        { q: "Can I set both date and click-based expiration?", a: "Yes, you can combine expiration conditions. For example, a link can expire after 30 days OR after 1000 clicks, whichever comes first." },
        { q: "Can I reactivate an expired link?", a: "Yes, you can modify the expiration settings of any link from your dashboard at any time, including reactivating expired links with new expiration rules." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
