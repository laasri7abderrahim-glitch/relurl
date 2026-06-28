import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"

export const metadata = generateSEOMetadata({
  title: "Custom Alias Generator - Memorable Short Links",
  description: "Generate custom aliases for your short URLs. Create memorable, branded, and meaningful link aliases that are easy to remember and share anywhere.",
  path: "/custom-alias-generator",
  keywords: ["custom alias generator", "short link alias", "url slug generator"],
})

export default function CustomAliasGeneratorPage() {
  const href = "/custom-alias-generator"
  return (
    <URLLandingPage
      title="Custom Alias Generator"
      subtitle="Create Meaningful Link Aliases"
      description="Turn random strings into memorable aliases. Generate custom slugs that are easy to remember, type, and share across any platform."
      placeholder="https://example.com/your-long-url"
      inputLabel="Enter your URL"
      generateLabel="Generate Alias"
      features={[
        "Custom Slug Input",
        "Availability Checker",
        "Brand Name Support",
        "Keyword Integration",
        "Bulk Alias Generation",
        "Alias Suggestions",
      ]}
      howItWorks={[
        { step: "Enter URL", desc: "Paste the long URL you want to create an alias for." },
        { step: "Choose Your Alias", desc: "Type your desired custom slug or let us suggest one." },
        { step: "Use Your Alias", desc: "Your short link with the custom alias is ready to share." },
      ]}
      useCases={[
        "Social media profile links",
        "Print advertising campaigns",
        "Business card URLs",
        "Product page shortcuts",
        "Podcast episode links",
        "QR code destinations",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
    />
  )
}
