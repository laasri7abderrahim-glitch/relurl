import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"
import { allQRCodes, getRelatedQrPages } from "@/lib/url-pages"
import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "QR Code for vCard - Digital Contact Card",
    description: "Generate a QR code with your full contact details. Scanners save your info directly to their phone contacts.",
    path: "/qr-code-for-vcard",
    keywords: ["qr code for vcard", "vcard qr code", "contact qr code", "virtual contact qr code"],
    locale,
  })
}

export default function QRCodeForVCardPage() {
  const href = "/qr-code-for-vcard"
  const relatedArticles = getPostsByLandingPage(href).slice(0, 3)
  return (
    <QRCodeLandingPage
      title="QR Code for vCard"
      subtitle="Digital Contact Card"
      description="Generate a QR code with your full contact details. Scanners save your info directly to their phone contacts."
      placeholder="BEGIN:VCARD&#10;VERSION:3.0&#10;FN:John Doe&#10;TEL:+1234567890&#10;EMAIL:john@example.com&#10;END:VCARD"
      defaultValue="BEGIN:VCARD&#10;VERSION:3.0&#10;FN:John Doe&#10;TEL:+1234567890&#10;EMAIL:john@example.com&#10;END:VCARD"
      inputLabel="Enter vCard details or URL"
      generateLabel="Create vCard QR Code"
      features={["Auto-Save Contact", "Full Contact Info", "No Manual Entry", "Professional", "Social Media Links", "Company Info Integration"]}
      howItWorks={[
        { step: "Enter Contact Details", desc: "Provide name, phone, email, and other info" },
        { step: "Generate QR Code", desc: "Create a code encoding your vCard" },
        { step: "Share Everywhere", desc: "Add to business cards or email signature" },
      ]}
      useCases={["Business networking", "Real estate agents", "Sales teams", "Consultants", "Conference speakers", "Real estate open house contacts"]}
      relatedPages={getRelatedQrPages(href)}
      allQRCodes={allQRCodes}
      relatedArticles={relatedArticles}
    />
  )
}
