import type { Metadata } from "next"
import { allQRCodes } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"

export const metadata: Metadata = generateSEOMetadata({
  title: "QR Code for Google Maps - Navigate to You",
  description: "Create a QR code for your Google Maps location. Customers scan and get instant directions to your business.",
  path: "/qr-code-for-google-maps",
  keywords: ["qr code for google maps", "google maps qr code", "location qr code"],
})

export default function QRCodeForGoogleMapsPage() {
  return (
    <>
      <QRCodeLandingPage
      title="QR Code for Google Maps"
      subtitle="Navigate to You"
      description="Create a QR code for your Google Maps location. Customers scan and get instant directions to your business."
      placeholder="https://maps.google.com/?q=Your+Address"
      inputLabel="Enter your Google Maps URL or address"
      generateLabel="Create Maps QR Code"
      features={["Instant Navigation", "No Address Typing", "Works Worldwide", "Business Essential"]}
      howItWorks={[
        { step: "Enter Location", desc: "Paste your Google Maps share link" },
        { step: "Generate QR Code", desc: "Create a code for your location" },
        { step: "Guide Customers", desc: "Display at events, on cards, or website" },
      ]}
      useCases={["Retail stores", "Restaurants", "Event venues", "Real estate", "Tourist attractions"]}
      relatedPages={[
        { title: "QR Code for Google Reviews", href: "/qr-code-for-google-reviews" },
        { title: "QR Code for Event Registration", href: "/qr-code-for-event" },
        { title: "QR Code for Restaurant Menu", href: "/qr-code-for-restaurant-menu" },
        { title: "QR Code Generator", href: "/qr-code-generator" },
        { title: "QR Code for Business Card", href: "/qr-code-for-business-card" },
        { title: "Free QR Code Generator", href: "/free-qr-code-generator" },
      ]}
      allQRCodes={allQRCodes}
    />
    </>
  )
}
