import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"
import { allLandingPages, qrPages, getRelatedQrPages } from "@/lib/url-pages"
import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"

const allQRCodes = [...allLandingPages, ...qrPages]

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Dynamic QR Code Generator - Editable QR Codes",
    description: "Create dynamic QR codes that can be edited after printing. Track scans and update destinations without changing the code.",
    path: "/dynamic-qr-code-generator",
    keywords: ["dynamic qr code", "editable qr code", "trackable qr code", "dynamic qr code generator"],
    locale,
  })
}

export default function Page() {
  const href = "/dynamic-qr-code-generator"
  const relatedArticles = getPostsByLandingPage(href).slice(0, 3)
  return (
    <QRCodeLandingPage
      title="Dynamic QR Code Generator"
      subtitle="Editable QR Codes"
      description="Create dynamic QR codes that can be updated anytime without reprinting. Track scans and change destinations on the fly."
      placeholder="https://example.com"
      defaultValue="https://example.com"
      inputLabel="Enter destination URL"
      generateLabel="Create Dynamic QR Code"
      features={["Edit Destination Anytime", "Scan Analytics", "No Reprinting Needed", "Track Performance", "Campaign Management", "Geo-Targeting"]}
      howItWorks={[
        { step: "Enter URL", desc: "Set your initial destination URL" },
        { step: "Generate & Save", desc: "Create your dynamic QR code and save it" },
        { step: "Edit Anytime", desc: "Change the destination URL whenever you want" },
      ]}
      useCases={[
        "Marketing campaigns that change over time",
        "Product packaging with updatable info",
        "Event materials with real-time updates",
        "A/B testing different landing pages",
        "Retargeting ads",
        "Seasonal promotions",
      ]}
      relatedPages={getRelatedQrPages(href)}
      allQRCodes={allQRCodes}
      faqs={[
        { q: "What is the difference between static and dynamic QR codes?", a: "Static QR codes encode the destination directly into the code and cannot be changed. Dynamic QR codes contain a short URL that redirects to your destination, so you can update the destination anytime without changing the QR image." },
        { q: "Can I see how many times my QR code was scanned?", a: "Yes, dynamic QR codes include scan analytics. Your dashboard shows total scans, scans over time, device types, operating systems, and geographic locations of scanners." },
        { q: "Is there a limit to how many times I can edit a dynamic QR code?", a: "No, you can edit dynamic QR codes as many times as you like. The link updates immediately, and the existing QR codes printed on your materials will still work — they'll now redirect to the new destination." },
      ]}

      relatedArticles={relatedArticles}
    />
  )
}