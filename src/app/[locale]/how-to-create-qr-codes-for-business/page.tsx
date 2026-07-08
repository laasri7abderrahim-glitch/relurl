import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "How to Create QR Codes for Business",
    description: "Learn how to create professional QR codes for your business with RELURL. Generate dynamic QR codes that track scans, update destinations, and drive measurable marketing results.",
    path: "/how-to-create-qr-codes-for-business",
    keywords: ["qr codes for business", "business qr code generator", "create qr codes business", "professional qr codes"],
    locale,
  })
}

export default function Page() {
  const href = "/how-to-create-qr-codes-for-business"
  const relatedArticles = getPostsByLandingPage("/free-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="How to Create QR Codes for Business"
      subtitle="Professional Guide"
      description="Learn how to create professional QR codes for your business with RELURL. Generate dynamic QR codes that track scans, update destinations, and drive measurable marketing results."
      placeholder="Enter your business URL..."
      generateLabel="Create QR Code"
      features={["QR Code Generation", "Click Analytics", "Custom Branded Slugs", "URL Compression", "Dynamic QR Updates", "Real-time Tracking"]}
      howItWorks={[
        { step: "Choose Your QR Type", desc: "Select between static QR codes for permanent links or dynamic QR codes that can be updated anytime." },
        { step: "Customize Your Design", desc: "Add your brand colors and logo to the QR code, then download in high-resolution PNG, SVG, or PDF." },
        { step: "Track Scan Performance", desc: "Monitor scan analytics including location, device type, and scan time to measure campaign effectiveness." },
      ]}
      useCases={["Add QR codes to restaurant menus for contactless ordering", "Generate QR codes for business cards and networking materials", "Create QR codes for product packaging and labels", "Track scan analytics to measure marketing campaign effectiveness", "Update QR code destinations dynamically without reprinting"]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "What makes a QR code dynamic vs static?", a: "Dynamic QR codes let you change the destination URL anytime without reprinting. Static QR codes are permanent. RELURL generates dynamic QR codes that you can update as needed." },
        { q: "Can I track how many people scan my QR code?", a: "Yes, RELURL provides detailed scan analytics including scan count, location, device type, and time of scan." },
        { q: "What file formats can I download my QR code in?", a: "You can download your QR codes as high-resolution PNG, SVG, or PDF files suitable for both print and digital use." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
