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

export default function QRCodeForVCardPage() {
  return (
    <>
      <link rel="canonical" href="https://relurl.com/qr-code-for-vcard" />
      <QRCodeLandingPage
      title="QR Code for vCard"
      subtitle="Digital Contact Card"
      description="Generate a QR code with your full contact details. Scanners save your info directly to their phone contacts."
      placeholder="BEGIN:VCARD&#10;VERSION:3.0&#10;FN:John Doe&#10;TEL:+1234567890&#10;EMAIL:john@example.com&#10;END:VCARD"
      inputLabel="Enter vCard details or URL"
      generateLabel="Create vCard QR Code"
      features={["Auto-Save Contact", "Full Contact Info", "No Manual Entry", "Professional"]}
      howItWorks={[
        { step: "Enter Contact Details", desc: "Provide name, phone, email, and other info" },
        { step: "Generate QR Code", desc: "Create a code encoding your vCard" },
        { step: "Share Everywhere", desc: "Add to business cards or email signature" },
      ]}
      useCases={["Business networking", "Real estate agents", "Sales teams", "Consultants", "Conference speakers"]}
      relatedPages={[
        { title: "QR Code for Business Card", href: "/qr-code-for-business-card" },
        { title: "QR Code for LinkedIn", href: "/qr-code-for-linkedin" },
        { title: "QR Code for Phone Number", href: "/qr-code-for-phone" },
        { title: "QR Code Generator", href: "/qr-code-generator" },
        { title: "QR Code for Email", href: "/qr-code-for-email" },
        { title: "Free QR Code Generator", href: "/free-qr-code-generator" },
      ]}
      allQRCodes={allQRCodes}
    />
    </>
  )
}
