import type { Metadata } from "next"
import { generateSEOMetadata } from "@/lib/seo"
import { allLandingPages, qrPages } from "@/lib/url-pages"
import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"

const allQRCodes = [...allLandingPages, ...qrPages]

export const metadata: Metadata = generateSEOMetadata({
  title: "Dynamic QR Code Generator - Editable QR Codes",
  description: "Create dynamic QR codes that can be edited after printing. Track scans and update destinations without changing the code.",
  path: "/dynamic-qr-code-generator",
  keywords: ["dynamic qr code", "editable qr code", "trackable qr code"],
})

export default function Page() {
  return (
    <QRCodeLandingPage
      title="Dynamic QR Code Generator"
      subtitle="Editable QR Codes"
      description="Create dynamic QR codes that can be updated anytime without reprinting. Track scans and change destinations on the fly."
      placeholder="https://example.com"
      defaultValue="https://example.com"
      inputLabel="Enter destination URL"
      generateLabel="Create Dynamic QR Code"
      features={["Edit Destination Anytime", "Scan Analytics", "No Reprinting Needed", "Track Performance"]}
      howItWorks={[
        { step: "Enter URL", desc: "Set your initial destination URL" },
        { step: "Generate & Save", desc: "Create your dynamic QR code and save it" },
        { step: "Edit Anytime", desc: "Change the destination URL whenever you want" },
      ]}
      useCases={[
        "Marketing campaigns that change over time",
        "Product packaging with updatable info",
        "Event materials with real-time updates",
        "A/B testing different landing pages",
      ]}
      relatedPages={[
        { title: "QR Code Generator", href: "/qr-code-generator" },
        { title: "QR Code for Marketing", href: "/qr-code-for-google-reviews" },
        { title: "QR Code for Restaurant Menu", href: "/qr-code-for-restaurant-menu" },
        { title: "QR Code for Event Registration", href: "/qr-code-for-event" },
        { title: "QR Code for App Download", href: "/qr-code-for-app-download" },
        { title: "Free QR Code Generator", href: "/free-qr-code-generator" },
      ]}
      allQRCodes={allQRCodes}
    />
  )
}
