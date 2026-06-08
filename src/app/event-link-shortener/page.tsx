import type { Metadata } from "next"
import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "Event Link Shortener - Event Promotion Links",
  description: "Create short, trackable links for conferences, meetups, and virtual events. Boost registrations and measure event marketing reach.",
  path: "/event-link-shortener",
  keywords: ["event link shortener", "conference link generator", "event marketing"],
})

export default function EventLinkShortenerPage() {
  const href = "/event-link-shortener"
  return (
    <URLLandingPage
      title="Event Link Shortener"
      subtitle="Maximize Event Reach"
      description="Create short, trackable links for conferences, meetups, and virtual events. Boost registrations and measure your marketing reach."
      placeholder="https://eventbrite.com/e/your-event-12345"
      inputLabel="Enter your event URL"
      generateLabel="Shorten URL"
      features={[
        "Registration Tracking",
        "Multi-Channel Analytics",
        "Countdown Integration",
        "Branded Event Links",
        "Speaker & Sponsor URLs",
        "Post-Event Analytics",
      ]}
      howItWorks={[
        { step: "Paste Event URL", desc: "Enter your registration page or event website link." },
        { step: "Generate Short Link", desc: "Create a memorable URL for your event campaign." },
        { step: "Promote & Track", desc: "Share across channels and monitor registration sources." },
      ]}
      useCases={[
        "Conference registration campaigns",
        "Meetup promotion",
        "Virtual event invitations",
        "Workshop signup links",
        "Expo and trade show marketing",
        "Speaker announcement posts",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
    />
  )
}
