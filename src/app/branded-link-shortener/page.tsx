import type { Metadata } from "next"
import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "Branded Link Shortener - Branded Short URLs",
  description: "Shorten URLs with your own brand name. Create branded short links that build trust, recognition, and click-through rates with every shared link.",
  path: "/branded-link-shortener",
  keywords: ["branded link shortener", "branded short urls", "brand links"],
})

export default function BrandedLinkShortenerPage() {
  const href = "/branded-link-shortener"
  return (
    <URLLandingPage
      title="Branded Link Shortener"
      subtitle="Put Your Brand on Every Link"
      description="Shorten URLs with your custom branded domain. Create short links that reinforce your brand identity and build trust with every click."
      placeholder="https://example.com/your-long-url"
      inputLabel="Enter your long URL"
      generateLabel="Shorten URL"
      features={[
        "Custom Branded Domains",
        "Consistent Brand Voice",
        "Trust-Building Links",
        "Custom Back-Half Names",
        "Link Management Dashboard",
        "Click Analytics by Brand",
      ]}
      howItWorks={[
        { step: "Connect Your Domain", desc: "Add your branded domain like go.yourbrand.com." },
        { step: "Create Branded Links", desc: "Use your brand name in the short URL slug." },
        { step: "Track & Optimize", desc: "Monitor click performance across all branded links." },
      ]}
      useCases={[
        "Company-wide link standardization",
        "Product marketing campaigns",
        "Social media profile links",
        "Press releases and media mentions",
        "Customer support documentation",
        "Partner and affiliate programs",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
    />
  )
}
