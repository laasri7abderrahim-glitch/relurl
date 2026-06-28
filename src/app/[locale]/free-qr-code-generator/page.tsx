import type { Metadata } from "next"
import { generateSEOMetadata } from "@/lib/seo"
import { allLandingPages, qrPages } from "@/lib/url-pages"
import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"

const allQRCodes = [...allLandingPages, ...qrPages]

export const metadata: Metadata = generateSEOMetadata({
  title: "Free QR Code Generator - No Sign Up",
  description: "Generate QR codes for free without signing up. Create high-quality QR codes for any purpose in seconds. No account required, completely free.",
  path: "/free-qr-code-generator",
  keywords: ["free qr code generator", "no sign up qr code", "instant qr code"],
})

export default function Page() {
  return (
    <QRCodeLandingPage
      title="Free QR Code Generator"
      subtitle="No Cost, No Limits"
      description="Generate unlimited QR codes for free. No signup, no watermarks, no restrictions. Download high-quality QR codes instantly."
      placeholder="https://example.com"
      defaultValue="https://example.com"
      inputLabel="Enter any URL or text"
      generateLabel="Generate Free QR Code"
      features={["100% Free", "No Watermarks", "Unlimited Generation", "High Quality Output"]}
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
    />
  )
}
