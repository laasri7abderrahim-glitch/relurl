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

export default function QRCodeForYouTubePage() {
  return (
    <>
      <link rel="canonical" href="https://relurl.com/qr-code-for-youtube" />
      <QRCodeLandingPage
      title="QR Code for YouTube"
      subtitle="Share Videos Easily"
      description="Create a QR code for your YouTube videos or channel. Viewers scan and watch instantly — perfect for promotion."
      placeholder="https://youtube.com/@yourchannel"
      inputLabel="Enter your YouTube video or channel URL"
      generateLabel="Create YouTube QR Code"
      features={["Instant Video Access", "Grow Subscribers", "Works on All Devices", "Print Ready"]}
      howItWorks={[
        { step: "Enter Video URL", desc: "Paste your YouTube video or channel link" },
        { step: "Generate QR Code", desc: "Create a scannable code" },
        { step: "Share Everywhere", desc: "Add to posters, packaging, or business cards" },
      ]}
      useCases={["Video promotion", "Product demonstrations", "Event entertainment", "Educational content", "Music releases"]}
      relatedPages={[
        { title: "QR Code for Instagram", href: "/qr-code-for-instagram" },
        { title: "QR Code for Facebook", href: "/qr-code-for-facebook" },
        { title: "QR Code for LinkedIn", href: "/qr-code-for-linkedin" },
        { title: "QR Code Generator", href: "/qr-code-generator" },
        { title: "QR Code for App Download", href: "/qr-code-for-app-download" },
        { title: "Free QR Code Generator", href: "/free-qr-code-generator" },
      ]}
      allQRCodes={allQRCodes}
    />
    </>
  )
}
