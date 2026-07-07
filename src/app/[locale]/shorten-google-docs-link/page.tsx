import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Shorten Google Docs Link - Google Docs URL Shortener",
    description: "Shorten Google Docs, Sheets, and Slides links for professional sharing. Make your document links clean, trackable, and easy to distribute.",
    path: "/shorten-google-docs-link",
    keywords: ["shorten google docs link", "google docs url shortener", "short google docs link", "docs link shortener"],
    locale,
  })
}

export default function ShortenGoogleDocsLinkPage() {
  const href = "/shorten-google-docs-link"
  const relatedArticles = getPostsByLandingPage("/custom-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="Shorten Google Docs Link"
      subtitle="Professional Document Sharing"
      description="Shorten Google Docs, Sheets, Slides, and Forms links for cleaner sharing. Professional short links make your documents look organized and are easier to distribute."
      placeholder="https://docs.google.com/document/d/example/edit"
      generateLabel="Shorten Docs Link"
      features={[
        "Docs/Sheets/Slides Support",
        "Forms Link Ready",
        "Custom Branded Slugs",
        "Click Analytics",
        "Permission Compatible",
        "QR Code Generation",
      ]}
      howItWorks={[
        { step: "Paste Docs Link", desc: "Copy your Google Docs, Sheets, Slides, or Forms URL." },
        { step: "Shorten Instantly", desc: "Generate a compact short link for your document." },
        { step: "Share Professionally", desc: "Distribute your clean short link via email or messaging." },
      ]}
      useCases={[
        "Share Google Docs links in professional emails",
        "Distribute Sheets links to team members",
        "Share Google Slides presentation links",
        "Include Docs links in project documentation",
        "Track clicks on shared document links",
        "Create QR codes for Forms and Surveys",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "Can I shorten any Google Docs URL?", a: "Yes, you can shorten URLs from Google Docs, Google Sheets, Google Slides, and Google Forms. All Google Workspace document types are supported." },
        { q: "Do short links work with restricted documents?", a: "The short link redirects to your original document. Recipients still need the appropriate access permissions. Share links with view or edit access as needed." },
        { q: "Can I see how many people clicked my document link?", a: "Yes, each shortened link includes click analytics showing total clicks, geographic data, and referrer information. This helps you track how your shared documents are being accessed." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
