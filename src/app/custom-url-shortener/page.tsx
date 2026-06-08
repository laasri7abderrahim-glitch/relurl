import type { Metadata } from "next"
import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "Custom URL Shortener - Personalized Short Links",
  description: "Create custom shortened URLs with personalized slugs. Make your links memorable and brandable with RELURL's custom URL shortener.",
  path: "/custom-url-shortener",
  keywords: ["custom url shortener", "personalized short links", "custom slug"],
})

export default function CustomURLShortenerPage() {
  const href = "/custom-url-shortener"
  return (
    <URLLandingPage
      title="Custom URL Shortener"
      subtitle="Personalize Your Links"
      description="Create memorable, branded short links with custom slugs. Replace random characters with meaningful words that reflect your brand."
      placeholder="https://example.com/your-long-url"
      inputLabel="Enter your long URL"
      generateLabel="Shorten URL"
      features={[
        "Custom Slug Selection",
        "Brandable Link Names",
        "Descriptive Aliases",
        "Case-Sensitive Options",
        "Emoji Support",
        "Bulk Custom Shortening",
      ]}
      howItWorks={[
        { step: "Paste Your URL", desc: "Enter the long URL you want to shorten." },
        { step: "Choose Custom Slug", desc: "Pick a memorable word or phrase for your short link." },
        { step: "Share Everywhere", desc: "Use your custom link in emails, social media, and marketing." },
      ]}
      useCases={[
        "Brand promotion with memorable links",
        "Product launch landing pages",
        "Social media bio links",
        "Email marketing campaigns",
        "Print materials and business cards",
        "Event invitations",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
    />
  )
}
