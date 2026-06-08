"use client"

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

export default function Page() {
  return (
    <>
      <link rel="canonical" href="https://relurl.com/qr-code-for-whatsapp" />
      <QRCodeLandingPage
      title="QR Code for WhatsApp"
      subtitle="Instant Messaging"
      description="Generate a QR code that opens a WhatsApp chat. Customers scan and message you instantly — perfect for support and sales."
      placeholder="https://wa.me/1234567890"
      defaultValue="https://wa.me/1234567890"
      inputLabel="Enter your WhatsApp number or link"
      generateLabel="Create WhatsApp QR Code"
      features={["Instant Chat", "No Contact Saving Needed", "Global Reach", "Business Friendly"]}
      howItWorks={[
        { step: "Enter WhatsApp Link", desc: "Use wa.me/your-number format" },
        { step: "Generate QR Code", desc: "Create a code that opens WhatsApp chat" },
        { step: "Share with Customers", desc: "Display on website, prints, or store" },
      ]}
      useCases={[
        "Customer support",
        "Sales inquiries",
        "Restaurant ordering",
        "Service bookings",
        "Event coordination",
      ]}
      relatedPages={[
        { title: "QR Code for SMS", href: "/qr-code-for-sms" },
        { title: "QR Code for Phone Number", href: "/qr-code-for-phone" },
        { title: "QR Code for Email", href: "/qr-code-for-email" },
        { title: "QR Code Generator", href: "/qr-code-generator" },
        { title: "QR Code for Business Card", href: "/qr-code-for-business-card" },
        { title: "Free QR Code Generator", href: "/free-qr-code-generator" },
      ]}
      allQRCodes={allQRCodes}
    />
    </>
  )
}
