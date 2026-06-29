import type { Metadata } from "next"
import { generateSEOMetadata } from "@/lib/seo"
import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"

const allQRCodes = [
  { title: "QR Code Generator", href: "/qr-code-generator" },
  { title: "Dynamic QR Code", href: "/dynamic-qr-code-generator" },
  { title: "Free QR Code", href: "/free-qr-code-generator" },
  { title: "QR Code for PDF", href: "/qr-code-for-pdf" },
  { title: "QR Code for WiFi", href: "/qr-code-for-wifi" },
  { title: "QR Code for Business Card", href: "/qr-code-for-business-card" },
  { title: "QR Code for Restaurant Menu", href: "/qr-code-for-restaurant-menu" },
  { title: "QR Code for Google Reviews", href: "/qr-code-for-google-reviews" },
  { title: "QR Code for Instagram", href: "/qr-code-for-instagram" },
  { title: "QR Code for WhatsApp", href: "/qr-code-for-whatsapp" },
  { title: "QR Code for YouTube", href: "/qr-code-for-youtube" },
  { title: "QR Code for Facebook", href: "/qr-code-for-facebook" },
  { title: "QR Code for LinkedIn", href: "/qr-code-for-linkedin" },
  { title: "QR Code for Email", href: "/qr-code-for-email" },
  { title: "QR Code for Phone Number", href: "/qr-code-for-phone" },
  { title: "QR Code for SMS", href: "/qr-code-for-sms" },
  { title: "QR Code for Event Registration", href: "/qr-code-for-event" },
  { title: "QR Code for vCard", href: "/qr-code-for-vcard" },
  { title: "QR Code for Google Maps", href: "/qr-code-for-google-maps" },
  { title: "QR Code for App Download", href: "/qr-code-for-app-download" },
]

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
