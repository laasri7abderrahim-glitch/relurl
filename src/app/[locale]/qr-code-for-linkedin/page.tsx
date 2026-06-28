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

export default function QRCodeForLinkedInPage() {
  return (
    <>
      <link rel="canonical" href="https://relurl.com/qr-code-for-linkedin" />
      <QRCodeLandingPage
      title="QR Code for LinkedIn"
      subtitle="Professional Networking"
      description="Create a QR code for your LinkedIn profile or company page. Make professional connections faster at events."
      placeholder="https://linkedin.com/in/yourprofile"
      inputLabel="Enter your LinkedIn profile or company URL"
      generateLabel="Create LinkedIn QR Code"
      features={["Professional Networking", "Event Ready", "Instant Connection", "Career Boost"]}
      howItWorks={[
        { step: "Enter LinkedIn URL", desc: "Paste your profile or company page link" },
        { step: "Generate QR Code", desc: "Create a professional QR code" },
        { step: "Network Smart", desc: "Add to business cards or wear at events" },
      ]}
      useCases={["Conference networking", "Job fairs", "Business meetings", "Recruitment events", "Professional services"]}
      relatedPages={[
        { title: "QR Code for Business Card", href: "/qr-code-for-business-card" },
        { title: "QR Code for vCard", href: "/qr-code-for-vcard" },
        { title: "QR Code for Email", href: "/qr-code-for-email" },
        { title: "QR Code Generator", href: "/qr-code-generator" },
        { title: "QR Code for Facebook", href: "/qr-code-for-facebook" },
        { title: "Free QR Code Generator", href: "/free-qr-code-generator" },
      ]}
      allQRCodes={allQRCodes}
    />
    </>
  )
}
