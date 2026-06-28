import type { Metadata } from "next"
import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "Ebook Link Shortener - Download & Promotion Links",
  description: "Shorten ebook download and landing page links. Track downloads, optimize promotions, and grow your reader base with RELURL.",
  path: "/ebook-link-shortener",
  keywords: ["ebook link shortener", "book download links", "ebook marketing links"],
})

export default function EbookLinkShortenerPage() {
  const href = "/ebook-link-shortener"
  return (
    <URLLandingPage
      title="Ebook Link Shortener"
      subtitle="Grow Your Readership"
      description="Shorten ebook download and landing page links. Track downloads, optimize your promotions, and grow your reader base effectively."
      placeholder="https://your-site.com/ebooks/digital-marketing-guide"
      inputLabel="Enter your ebook URL"
      generateLabel="Shorten URL"
      features={[
        "Download Tracking",
        "Landing Page Analytics",
        "Multi-Platform Distribution",
        "Email Capture Integration",
        "Author Branding",
        "Sales Funnel Attribution",
      ]}
      howItWorks={[
        { step: "Paste Ebook URL", desc: "Enter your ebook landing page or download link." },
        { step: "Create Short Link", desc: "Generate a clean URL easy for readers to share." },
        { step: "Promote & Track", desc: "Share across platforms and monitor download conversions." },
      ]}
      useCases={[
        "Free ebook promotion",
        "Amazon Kindle page links",
        "Email list building campaigns",
        "Guest blog resource links",
        "Social media book launches",
        "Bookstore partnership links",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
    />
  )
}
