import type { Metadata } from "next"
import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "Agency Link Shortener - Client Campaign Links",
  description: "Shorten client campaign links with white-label branding. Track performance across channels and deliver reports with RELURL.",
  path: "/agency-link-shortener",
  keywords: ["agency link shortener", "marketing agency links", "white label link shortener"],
})

export default function AgencyLinkShortenerPage() {
  const href = "/agency-link-shortener"
  return (
    <URLLandingPage
      title="Agency Link Shortener"
      subtitle="Deliver More Value"
      description="Shorten client campaign links with white-label branding. Track performance across channels and deliver actionable reports."
      placeholder="https://client-landing-page.com/summer-campaign"
      inputLabel="Enter your campaign URL"
      generateLabel="Shorten URL"
      features={[
        "White-Label Branding",
        "Multi-Client Management",
        "Campaign Performance Reports",
        "UTM Parameter Builder",
        "A/B Test Support",
        "API Access",
      ]}
      howItWorks={[
        { step: "Paste Campaign URL", desc: "Enter your client's landing page or campaign link." },
        { step: "Brand & Tag", desc: "Add client branding and UTM parameters for tracking." },
        { step: "Report & Optimize", desc: "Share results with clients and optimize campaigns." },
      ]}
      useCases={[
        "Client PPC campaign links",
        "Social media management",
        "Email marketing for clients",
        "Influencer campaign tracking",
        "Multi-channel attribution",
        "White-label link management",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
    />
  )
}
