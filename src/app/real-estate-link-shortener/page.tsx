import type { Metadata } from "next"
import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "Real Estate Link Shortener - Property Listing Links",
  description: "Create short, memorable links for property listings, open houses, and virtual tours. Track interest and generate leads with RELURL.",
  path: "/real-estate-link-shortener",
  keywords: ["real estate link shortener", "property listing links", "real estate marketing"],
})

export default function RealEstateLinkShortenerPage() {
  const href = "/real-estate-link-shortener"
  return (
    <URLLandingPage
      title="Real Estate Link Shortener"
      subtitle="Streamline Property Links"
      description="Create short, memorable links for property listings, open houses, and virtual tours. Track buyer interest and generate more leads."
      placeholder="https://realtor.com/listings/1234567890"
      inputLabel="Enter your property listing URL"
      generateLabel="Shorten URL"
      features={[
        "Property-Specific Tracking",
        "Lead Generation Analytics",
        "QR Code Integration",
        "Custom Neighborhood Slugs",
        "Mobile-Optimized Links",
        "Open House Campaigns",
      ]}
      howItWorks={[
        { step: "Paste Listing URL", desc: "Enter your MLS listing or property page URL." },
        { step: "Create Short Link", desc: "Generate a clean, memorable short URL for the listing." },
        { step: "Share & Generate Leads", desc: "Post on social media, print flyers, and track buyer interest." },
      ]}
      useCases={[
        "Property listing promotion",
        "Open house invitations",
        "Virtual tour sharing",
        "Real estate social media marketing",
        "Print brochure links",
        "Email drip campaigns",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
    />
  )
}
