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
      <link rel="canonical" href="https://relurl.com/qr-code-for-instagram" />
      <QRCodeLandingPage
      title="QR Code for Instagram"
      subtitle="Grow Your Following"
      description="Create a QR code for your Instagram profile or posts. Help followers find you instantly and grow your audience."
      placeholder="https://instagram.com/yourusername"
      inputLabel="Enter your Instagram profile URL"
      generateLabel="Create Instagram QR Code"
      features={["Grow Followers", "Share Posts Easily", "Works on All Devices", "Print Ready"]}
      howItWorks={[
        { step: "Enter Profile URL", desc: "Paste your Instagram profile or post link" },
        { step: "Generate QR Code", desc: "Create a scannable code" },
        { step: "Share Everywhere", desc: "Add to print materials, packaging, or displays" },
      ]}
      useCases={[
        "Influencers and creators",
        "Business profiles",
        "Event promotion",
        "Product packaging",
        "Store displays",
      ]}
      relatedPages={[
        { title: "QR Code for Facebook", href: "/qr-code-for-facebook" },
        { title: "QR Code for YouTube", href: "/qr-code-for-youtube" },
        { title: "QR Code for LinkedIn", href: "/qr-code-for-linkedin" },
        { title: "QR Code Generator", href: "/qr-code-generator" },
        { title: "QR Code for WhatsApp", href: "/qr-code-for-whatsapp" },
        { title: "Free QR Code Generator", href: "/free-qr-code-generator" },
      ]}
      allQRCodes={allQRCodes}
    />
    </>
  )
}
