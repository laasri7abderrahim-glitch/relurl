import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "URL Shortener with QR Codes",
    description: "Combine URL shortening with QR code generation. Every shortened link on RELURL comes with a free, customizable QR code for online and offline marketing.",
    path: "/url-shortener-with-qr-codes",
    keywords: ["url shortener with qr codes", "qr code url shortener", "short link qr code generator", "qr link shortener"],
    locale,
  })
}

export default function Page() {
  const href = "/url-shortener-with-qr-codes"
  const relatedArticles = getPostsByLandingPage("/free-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="URL Shortener with QR Codes"
      subtitle="Links + QR in One"
      description="Combine URL shortening with QR code generation. Every shortened link on RELURL comes with a free, customizable QR code for online and offline marketing."
      placeholder="Enter URL to generate QR..."
      generateLabel="QR + Link"
      features={["QR Code Generation", "URL Compression", "Click Analytics", "Custom Branded Slugs", "Dynamic QR Updates", "Real-time Tracking"]}
      howItWorks={[
        { step: "Paste Your URL", desc: "Enter the link you want to shorten and turn into a QR code." },
        { step: "Shorten & Generate QR", desc: "We'll create a short link and automatically generate a high-resolution QR code." },
        { step: "Download & Deploy", desc: "Download your QR code in PNG, SVG, or PDF for print or digital use. Share your short link anywhere." },
      ]}
      useCases={["Generate QR codes for product packaging with short links", "Create QR codes for restaurant menus with trackable URLs", "Add QR codes to business cards linking to your portfolio", "Print QR codes on flyers and posters for event promotion", "Deploy QR codes in retail stores for contactless interactions"]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "Can I download the QR code in different formats?", a: "Yes, RELURL lets you download QR codes as high-resolution PNG, SVG, and PDF files." },
        { q: "Can I update the destination of my QR code later?", a: "Yes, with dynamic QR codes you can change the destination URL anytime without reprinting." },
        { q: "Is QR code generation included in the free plan?", a: "Absolutely. Every shortened link on RELURL includes a free QR code, even on the free forever plan." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
