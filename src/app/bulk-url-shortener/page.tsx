import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"

export const metadata = generateSEOMetadata({
  title: "Bulk URL Shortener - Shorten Multiple URLs",
  description: "Shorten hundreds of URLs at once with our bulk URL shortener. Upload a CSV, customize slugs, and manage all your links from one powerful dashboard.",
  path: "/bulk-url-shortener",
  keywords: ["bulk url shortener", "shorten multiple urls", "batch url shortening"],
})

export default function BulkURLShortenerPage() {
  const href = "/bulk-url-shortener"
  return (
    <URLLandingPage
      title="Bulk URL Shortener"
      subtitle="Shorten Hundreds of Links at Once"
      description="Save time by shortening multiple URLs simultaneously. Upload a CSV or paste multiple links and get them all shortened in seconds."
      placeholder="Paste multiple URLs, one per line"
      inputLabel="Enter your URLs (one per line)"
      generateLabel="Shorten All"
      features={[
        "Batch Processing (50 at once)",
        "CSV Import/Export",
        "Custom Aliases per Link",
        "Tags & Organization",
        "Analytics Dashboard",
        "API for Automation",
      ]}
      howItWorks={[
        { step: "Upload or Paste", desc: "Paste URLs one per line or upload a CSV file." },
        { step: "Configure Options", desc: "Set custom aliases, tags, and expiration for each link." },
        { step: "Download & Share", desc: "Export your shortened links as CSV or copy them individually." },
      ]}
      useCases={[
        "E-commerce product catalog linking",
        "Content marketing teams",
        "SEO agencies managing client links",
        "Social media managers",
        "Event organizers with multiple links",
        "Research and academic projects",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
    />
  )
}
