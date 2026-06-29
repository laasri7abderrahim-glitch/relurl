import type { Metadata } from "next"
import { allQRCodes } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"

export const metadata: Metadata = generateSEOMetadata({
  title: "QR Code for vCard - Digital Contact Card",
  description: "Generate a QR code with your full contact details. Scanners save your info directly to their phone contacts.",
  path: "/qr-code-for-vcard",
  keywords: ["qr code for vcard", "vcard qr code", "contact qr code"],
})

export default function QRCodeForVCardPage() {
  return (
    <>
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
