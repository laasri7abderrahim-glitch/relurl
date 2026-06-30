import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Bulk URL Shortener - Shorten Multiple URLs",
    description: "Shorten hundreds of URLs at once with our bulk URL shortener. Upload a CSV, customize slugs, and manage all your links from one powerful dashboard.",
    path: "/bulk-url-shortener",
    keywords: ["bulk url shortener", "shorten multiple urls", "batch url shortening"],
    locale,
  })
}

export default function BulkURLShortenerPage() {
  const href = "/bulk-url-shortener"
  const relatedArticles = getPostsByLandingPage("/bulk-url-shortener").slice(0, 3)
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
      faqs={[
        { q: "How many URLs can I shorten at once?", a: "Our bulk URL shortener supports up to 100 URLs per batch. For larger volumes, contact our sales team for custom enterprise solutions." },
        { q: "What format should my URLs be in?", a: "Enter one URL per line in the text area, or upload a CSV file with a URL column. We accept plain URLs with or without http:// prefixes." },
        { q: "Do bulk-shortened links include analytics?", a: "Yes, every link generated through bulk shortening includes individual click analytics. You can track performance per link from your dashboard after processing." },
      ]}

      relatedArticles={relatedArticles}
    />
  )
}