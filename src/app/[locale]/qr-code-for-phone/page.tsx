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
  title: "QR Code for Phone Number - One-Tap Calling",
  description: "Create a QR code that opens a phone dialer when scanned. Make it easy for customers to call you instantly.",
  path: "/qr-code-for-phone",
  keywords: ["qr code for phone", "phone number qr code", "call qr code"],
})

export default function QRCodeForPhonePage() {
  return (
    <>
      <QRCodeLandingPage
      title="QR Code for Phone Number"
      subtitle="One-Tap Calling"
      description="Create a QR code that opens a phone dialer when scanned. Make it easy for customers to call you instantly."
      placeholder="tel:+1234567890"
      defaultValue="tel:+1234567890"
      inputLabel="Enter phone number"
      generateLabel="Create Phone QR Code"
      features={["Instant Calling", "No Manual Dialing", "Works Globally", "Business Essential"]}
      howItWorks={[
        { step: "Enter Phone Number", desc: "Provide your phone number with country code" },
        { step: "Generate QR Code", desc: "Create a code that opens the dialer" },
        { step: "Share Everywhere", desc: "Add to signs, ads, or business materials" },
      ]}
      useCases={["Business contact", "Emergency services", "Delivery services", "Real estate listings", "Service providers"]}
      relatedPages={[
        { title: "QR Code for SMS", href: "/qr-code-for-sms" },
        { title: "QR Code for WhatsApp", href: "/qr-code-for-whatsapp" },
        { title: "QR Code for Email", href: "/qr-code-for-email" },
        { title: "QR Code Generator", href: "/qr-code-generator" },
        { title: "QR Code for vCard", href: "/qr-code-for-vcard" },
        { title: "Free QR Code Generator", href: "/free-qr-code-generator" },
      ]}
      allQRCodes={allQRCodes}
    />
    </>
  )
}
