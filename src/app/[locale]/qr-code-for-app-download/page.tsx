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

export default function QRCodeForAppDownloadPage() {
  return (
    <>
      <link rel="canonical" href="https://relurl.com/qr-code-for-app-download" />
      <QRCodeLandingPage
      title="QR Code for App Download"
      subtitle="Boost Installs"
      description="Generate a QR code for your mobile app. Users scan and are directed to the right app store for their device."
      placeholder="https://play.google.com/store/apps/details?id=com.yourapp"
      inputLabel="Enter your app store URL"
      generateLabel="Create App Download QR Code"
      features={["Auto Device Detection", "Boost Installs", "Cross-Platform", "Print Ready"]}
      howItWorks={[
        { step: "Enter App Store URL", desc: "Link to Google Play or App Store" },
        { step: "Generate QR Code", desc: "Create a code for app promotion" },
        { step: "Promote Your App", desc: "Add to packaging, displays, or ads" },
      ]}
      useCases={["App launches", "Product packaging", "Store displays", "Event promotion", "Print advertising"]}
      relatedPages={[
        { title: "QR Code for YouTube", href: "/qr-code-for-youtube" },
        { title: "QR Code for Instagram", href: "/qr-code-for-instagram" },
        { title: "QR Code for Dynamic QR Code", href: "/dynamic-qr-code-generator" },
        { title: "QR Code Generator", href: "/qr-code-generator" },
        { title: "QR Code for Facebook", href: "/qr-code-for-facebook" },
        { title: "Free QR Code Generator", href: "/free-qr-code-generator" },
      ]}
      allQRCodes={allQRCodes}
    />
    </>
  )
}
