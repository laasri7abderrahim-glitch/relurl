import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"

export const metadata = generateSEOMetadata({
  title: "Campaign Link Generator - Trackable URLs",
  description: "Generate trackable campaign URLs with UTM parameters built in. Create, shorten, and monitor all your marketing campaign links from one place.",
  path: "/campaign-link-generator",
  keywords: ["campaign link generator", "utm link generator", "campaign url builder"],
})

export default function CampaignLinkGeneratorPage() {
  const href = "/campaign-link-generator"
  return (
    <URLLandingPage
      title="Campaign Link Generator"
      subtitle="Build, Shorten, Track"
      description="Generate complete campaign URLs with UTM parameters, shorten them, and track performance across all your marketing channels from one dashboard."
      placeholder="https://your-site.com/landing-page"
      inputLabel="Enter your landing page URL"
      generateLabel="Generate Campaign Link"
      features={[
        "UTM Builder",
        "Custom Campaign Names",
        "Source & Medium Tags",
        "Auto-Shortening",
        "Campaign Dashboard",
        "Performance Reports",
      ]}
      howItWorks={[
        { step: "Enter Landing URL", desc: "Paste your target landing page URL." },
        { step: "Add Campaign Details", desc: "Fill in source, medium, campaign name, and more." },
        { step: "Get Short Campaign Link", desc: "Receive a shortened, trackable campaign URL." },
      ]}
      useCases={[
        "Google Ads campaigns",
        "Facebook & Instagram ads",
        "Email newsletter campaigns",
        "Influencer partnerships",
        "Seasonal promotions",
        "Product launch tracking",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
    />
  )
}
