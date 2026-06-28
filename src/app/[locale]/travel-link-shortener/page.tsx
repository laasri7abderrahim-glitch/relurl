import type { Metadata } from "next"
import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "Travel Link Shortener - Booking & Guide Links",
  description: "Shorten travel booking links, itinerary pages, and destination guides. Track traveler clicks and optimize your travel marketing.",
  path: "/travel-link-shortener",
  keywords: ["travel link shortener", "booking link generator", "travel marketing links"],
})

export default function TravelLinkShortenerPage() {
  const href = "/travel-link-shortener"
  return (
    <URLLandingPage
      title="Travel Link Shortener"
      subtitle="Simplify Travel Links"
      description="Shorten booking links, itinerary pages, and destination guides. Track traveler clicks and optimize your travel marketing campaigns."
      placeholder="https://booking.travelsite.com/hotels/paris-3n"
      inputLabel="Enter your travel URL"
      generateLabel="Shorten URL"
      features={[
        "Booking Link Tracking",
        "Destination Guide Shortening",
        "Itinerary Share Links",
        "Multi-Channel Analytics",
        "Seasonal Campaign Support",
        "Affiliate Link Management",
      ]}
      howItWorks={[
        { step: "Paste Travel URL", desc: "Enter your booking, itinerary, or guide page link." },
        { step: "Generate Short Link", desc: "Create a clean, memorable URL for travelers." },
        { step: "Share & Convert", desc: "Post on social media, emails, and ads to drive bookings." },
      ]}
      useCases={[
        "Hotel booking promotions",
        "Tour package links",
        "Travel blog affiliate links",
        "Itinerary sharing with groups",
        "Airline deal announcements",
        "Destination guide distribution",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
    />
  )
}
