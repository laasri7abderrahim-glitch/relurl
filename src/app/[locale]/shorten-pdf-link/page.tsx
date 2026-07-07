import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Shorten PDF Link - Free PDF URL Shortener",
    description: "Shorten PDF file links for easier sharing via email, social media, and messaging. Make your PDF links neat, trackable, and professional-looking.",
    path: "/shorten-pdf-link",
    keywords: ["shorten pdf link", "pdf url shortener", "short pdf link", "pdf link shortener"],
    locale,
  })
}

export default function ShortenPDFLinkPage() {
  const href = "/shorten-pdf-link"
  const relatedArticles = getPostsByLandingPage("/custom-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="Shorten PDF Link"
      subtitle="Better Document Sharing"
       description="Shorten PDF file URLs for streamlined sharing via email, social media, and messaging. Neat links make your PDF documents more accessible and professional."
      placeholder="https://example.com/documents/report-2024.pdf"
      generateLabel="Shorten PDF Link"
      features={[
        "PDF URL Compression",
        "Direct Download Ready",
        "Custom Branded Slugs",
        "Click Analytics",
        "Multi-Platform Sharing",
        "QR Code Generation",
      ]}
      howItWorks={[
        { step: "Paste PDF URL", desc: "Copy the direct URL of the PDF file you want to share." },
        { step: "Shorten Instantly", desc: "Generate a clean short link for your PDF document." },
        { step: "Share Your PDF", desc: "Distribute the short link via email, social media, or messaging." },
      ]}
      useCases={[
        "Share PDF reports and whitepapers in emails",
        "Distribute ebooks and guides on social media",
        "Send PDF documents via messaging apps",
        "Include PDF links in blog posts and articles",
        "Track downloads of shared PDF files",
        "Create QR codes for PDF document access",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "Can I shorten any PDF URL?", a: "Yes, any direct PDF file URL can be shortened. The short link will redirect users to the original PDF, which will open or download depending on their browser settings." },
        { q: "Will the short link work for large PDF files?", a: "Yes, the short link simply redirects to your original PDF URL, so file size does not affect the redirect. Large PDFs hosted on your server will still work normally." },
        { q: "Can I track who downloads my PDF?", a: "While we track clicks on the short link, actual download tracking depends on your hosting setup. The click analytics show how many people accessed the link, which correlates with PDF access." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
