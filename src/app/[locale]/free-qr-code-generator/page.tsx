import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"
import { allLandingPages, qrPages } from "@/lib/url-pages"
import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"

const allQRCodes = [...allLandingPages, ...qrPages]

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Free QR Code Generator - No Sign Up",
    description: "Generate QR codes for free without signing up. Create high-quality QR codes for any purpose in seconds. No account required, completely free.",
    path: "/free-qr-code-generator",
    keywords: ["free qr code generator", "no sign up qr code", "instant qr code", "free qr code maker"],
    locale,
  })
}

export default function Page() {
  const relatedArticles = getPostsByLandingPage("/free-qr-code-generator").slice(0, 3)
  return (
    <QRCodeLandingPage
      title="Free QR Code Generator"
      subtitle="No Cost, No Limits"
      description="Generate unlimited QR codes for free. No signup, no watermarks, no restrictions. Download high-quality QR codes instantly."
      placeholder="https://example.com"
      defaultValue="https://example.com"
      inputLabel="Enter any URL or text"
      generateLabel="Generate Free QR Code"
      features={["100% Free", "No Watermarks", "Unlimited Generation", "High Quality Output", "Instant Download", "Cross-Platform Compatible"]}
      howItWorks={[
        { step: "Paste Content", desc: "Enter any URL, text, or data" },
        { step: "Click Generate", desc: "Your QR code is created instantly" },
        { step: "Download Free", desc: "Download without any cost or signup" },
      ]}
      useCases={[
        "Students and educators",
        "Small business owners",
        "Event organizers",
        "Personal use",
        "Nonprofit organizations",
        "Personal projects and hobbies",
      ]}
      relatedPages={[
        { title: "QR Code Generator", href: "/qr-code-generator" },
        { title: "Dynamic QR Code Generator", href: "/dynamic-qr-code-generator" },
        { title: "QR Code for PDF", href: "/qr-code-for-pdf" },
        { title: "QR Code for WiFi", href: "/qr-code-for-wifi" },
        { title: "QR Code for Instagram", href: "/qr-code-for-instagram" },
        { title: "QR Code for WhatsApp", href: "/qr-code-for-whatsapp" },
      ]}
      allQRCodes={allQRCodes}

      relatedArticles={relatedArticles}
    />
  )
}