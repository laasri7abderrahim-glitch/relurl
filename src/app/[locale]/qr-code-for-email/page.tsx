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
  title: "QR Code for Email - Email Made Simple",
  description: "Generate a QR code that opens an email compose window with pre-filled subject and body. Perfect for feedback collection.",
  path: "/qr-code-for-email",
  keywords: ["qr code for email", "email qr code", "mailto qr code"],
})

export default function QRCodeForEmailPage() {
  return (
    <>
      <QRCodeLandingPage
      title="QR Code for Email"
      subtitle="Email Made Simple"
      description="Generate a QR code that opens an email compose window with pre-filled subject and body. Perfect for feedback collection."
      placeholder="mailto:someone@example.com?subject=Hello"
      defaultValue="mailto:someone@example.com?subject=Hello"
      inputLabel="Enter email address or mailto link"
      generateLabel="Create Email QR Code"
      features={["Pre-filled Subject", "One-Scan Compose", "No Typing Needed", "Feedback Friendly"]}
      howItWorks={[
        { step: "Enter Email Details", desc: "Provide email address and optional subject/body" },
        { step: "Generate QR Code", desc: "Create a code that opens email compose" },
        { step: "Collect Responses", desc: "Display for instant feedback or inquiries" },
      ]}
      useCases={["Customer feedback", "Support inquiries", "Contact forms", "Survey responses", "Job applications"]}
      relatedPages={[
        { title: "QR Code for Phone Number", href: "/qr-code-for-phone" },
        { title: "QR Code for SMS", href: "/qr-code-for-sms" },
        { title: "QR Code for WhatsApp", href: "/qr-code-for-whatsapp" },
        { title: "QR Code Generator", href: "/qr-code-generator" },
        { title: "QR Code for Business Card", href: "/qr-code-for-business-card" },
        { title: "Free QR Code Generator", href: "/free-qr-code-generator" },
      ]}
      allQRCodes={allQRCodes}
    />
    </>
  )
}
