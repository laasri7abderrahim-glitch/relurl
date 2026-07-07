import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Event Link Shortener - Event Promotion Links",
    description: "Shorten event URLs to promote conferences, meetups, and virtual events. Track registration sources and measure campaign reach with RELURL.",
    path: "/event-link-shortener",
    keywords: ["event link shortener", "conference link generator", "event marketing"],
    locale,
  })
}

export default function EventLinkShortenerPage() {
  const href = "/event-link-shortener"
  const relatedArticles = getPostsByLandingPage("/event-link-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="Event Link Shortener"
      subtitle="Maximize Event Reach"
       description="Shorten event URLs to promote conferences, meetups, and virtual events. Track registration sources and measure your campaign reach."
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

      relatedArticles={relatedArticles}
    />
  )
}