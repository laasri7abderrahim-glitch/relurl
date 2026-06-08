import type { Metadata } from "next"
import { generateSEOMetadata } from "@/lib/seo"
import { allLandingPages, qrPages } from "@/lib/url-pages"
import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"

const allQRCodes = [...allLandingPages, ...qrPages]

export const metadata: Metadata = generateSEOMetadata({
  title: "QR Code for PDF - Link PDF to QR Code",
  description: "Generate a QR code that links directly to your PDF document. Share PDFs easily with scannable QR codes that open on any smartphone.",
  path: "/qr-code-for-pdf",
  keywords: ["qr code for pdf", "pdf qr code", "link pdf to qr code"],
})

export default function Page() {
  return (
    <QRCodeLandingPage
      title="QR Code for PDF"
      subtitle="Share Documents Digitally"
      description="Create a QR code for your PDF documents. Let users scan and instantly access your PDF files on any device."
      placeholder="https://example.com/document.pdf"
      inputLabel="Enter PDF URL"
      generateLabel="Create PDF QR Code"
      features={["Instant PDF Access", "Works on All Devices", "No App Needed", "Track Downloads"]}
      howItWorks={[
        { step: "Upload or Link PDF", desc: "Enter the URL where your PDF is hosted" },
        { step: "Generate QR Code", desc: "Create a scannable code for your document" },
        { step: "Share Anywhere", desc: "Print or share the QR code on any medium" },
      ]}
      useCases={[
        "Product manuals and guides",
        "Restaurant menus as PDF",
        "Event programs and schedules",
        "Legal documents and contracts",
        "Educational materials",
      ]}
      relatedPages={[
        { title: "QR Code Generator", href: "/qr-code-generator" },
        { title: "QR Code for vCard", href: "/qr-code-for-vcard" },
        { title: "QR Code for Business Card", href: "/qr-code-for-business-card" },
        { title: "QR Code for Event Registration", href: "/qr-code-for-event" },
        { title: "QR Code for Restaurant Menu", href: "/qr-code-for-restaurant-menu" },
        { title: "Free QR Code Generator", href: "/free-qr-code-generator" },
      ]}
      allQRCodes={allQRCodes}
    />
  )
}
