import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"
import { allLandingPages, qrPages } from "@/lib/url-pages"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "QR Code Generator - Free QR Code Maker",
    description: "Generate QR codes for free. Create QR codes for URLs, text, WiFi networks, vCard contacts, and more with our easy-to-use free QR code generator.",
    path: "/qr-code-generator",
    keywords: ["qr code generator", "free qr code", "qr code maker", "create qr code"],
    locale,
  })
}

const allQRCodes = [...allLandingPages, ...qrPages]

export default function Page() {
  const relatedArticles = getPostsByLandingPage("/qr-code-generator").slice(0, 3)
  return (
    <QRCodeLandingPage
      title="QR Code Generator"
      subtitle="Free Online Tool"
      description="Create high-quality QR codes instantly. Generate custom QR codes for URLs, text, and more — 100% free, no signup required."
      placeholder="https://example.com"
      defaultValue="https://example.com"
      inputLabel="Enter URL or text"
      generateLabel="Generate QR Code"
      features={["Instant Generation", "High Resolution", "No Signup Required", "Works Everywhere"]}
      howItWorks={[
        { step: "Enter Data", desc: "Type or paste any URL, text, or data" },
        { step: "Generate", desc: "Click generate to create your QR code instantly" },
        { step: "Download", desc: "Download as PNG or copy to clipboard" },
      ]}
      useCases={[
        "Share website links on print materials",
        "Add to business cards and flyers",
        "Use in presentations and documents",
        "Embed in emails and newsletters",
      ]}
      relatedPages={[
        { title: "Dynamic QR Code Generator", href: "/dynamic-qr-code-generator" },
        { title: "Free QR Code Generator", href: "/free-qr-code-generator" },
        { title: "QR Code for Business Card", href: "/qr-code-for-business-card" },
        { title: "QR Code for WiFi", href: "/qr-code-for-wifi" },
        { title: "QR Code for PDF", href: "/qr-code-for-pdf" },
        { title: "QR Code for Google Reviews", href: "/qr-code-for-google-reviews" },
      ]}
      allQRCodes={allQRCodes}
      faqs={[
        { q: "What types of QR codes can I create?", a: "You can create QR codes for URLs, plain text, WiFi network credentials, vCard contacts, email addresses, phone numbers, SMS messages, and event calendar entries." },
        { q: "What file formats are available for download?", a: "Generated QR codes can be downloaded as high-resolution PNG images (up to 1024×1024px). Perfect for print materials, digital use, and embedding." },
        { q: "Do I need an account to generate QR codes?", a: "No account is needed for basic QR code generation. However, a free account unlocks additional features like design customization, scan analytics, and dynamic QR code management." },
      ]}

      relatedArticles={relatedArticles}
    />
  )
}