import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"
import { allQRCodes, getRelatedQrPages } from "@/lib/url-pages"
import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "QR Code for PDF - Link PDF to QR Code",
    description: "Generate a QR code that links directly to your PDF document. Share PDFs easily with scannable QR codes that open on any smartphone.",
    path: "/qr-code-for-pdf",
    keywords: ["qr code for pdf", "pdf qr code", "link pdf to qr code", "document qr code"],
    locale,
  })
}

export default function Page() {
  const href = "/qr-code-for-pdf"
  const relatedArticles = getPostsByLandingPage(href).slice(0, 3)
  return (
    <QRCodeLandingPage
      title="QR Code for PDF"
      subtitle="Share Documents Digitally"
      description="Create a QR code for your PDF documents. Let users scan and instantly access your PDF files on any device."
      placeholder="https://example.com/document.pdf"
      inputLabel="Enter PDF URL"
      generateLabel="Create PDF QR Code"
      features={["Instant PDF Access", "Works on All Devices", "No App Needed", "Track Downloads", "Password Protection", "PDF Preview Mode"]}
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
        "Brochure and catalog distribution",
      ]}
      relatedPages={getRelatedQrPages(href)}
      allQRCodes={allQRCodes}

      relatedArticles={relatedArticles}
    />
  )
}