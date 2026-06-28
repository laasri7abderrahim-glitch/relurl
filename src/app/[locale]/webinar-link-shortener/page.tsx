import type { Metadata } from "next"
import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "Webinar Link Shortener - Webinar Registration Links",
  description: "Shorten webinar registration and replay links. Track attendance, optimize promotions, and fill your webinars with RELURL.",
  path: "/webinar-link-shortener",
  keywords: ["webinar link shortener", "webinar registration links", "webinar marketing"],
})

export default function WebinarLinkShortenerPage() {
  const href = "/webinar-link-shortener"
  return (
    <URLLandingPage
      title="Webinar Link Shortener"
      subtitle="Fill Every Webinar"
      description="Shorten webinar registration and replay links. Track attendance, optimize your promotions, and fill every webinar session."
      placeholder="https://zoom.us/webinar/register/your-webinar"
      inputLabel="Enter your webinar URL"
      generateLabel="Shorten URL"
      features={[
        "Registration Tracking",
        "Replay Link Analytics",
        "Reminder Integration",
        "Multi-Promotion Channels",
        "Speaker Profile Links",
        "Post-Webinar Follow-Up",
      ]}
      howItWorks={[
        { step: "Paste Webinar URL", desc: "Enter your registration or replay page link." },
        { step: "Create Short Link", desc: "Generate a memorable URL for your webinar campaign." },
        { step: "Promote & Track", desc: "Share across channels and monitor registration conversions." },
      ]}
      useCases={[
        "Webinar registration campaigns",
        "Replay link distribution",
        "Partner promotion links",
        "Email sequence links",
        "Social media event posts",
        "Post-webinar sales funnels",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
    />
  )
}
