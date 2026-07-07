import { allQRCodes, getRelatedQrPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"
import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "QR Code for Google Maps - Navigate to You",
    description: "Create a QR code for your Google Maps location. Customers scan and get instant directions to your business.",
    path: "/qr-code-for-google-maps",
    keywords: ["qr code for google maps", "google maps qr code", "location qr code", "directions qr code"],
    locale,
  })
}

export default function QRCodeForGoogleMapsPage() {
  const href = "/qr-code-for-google-maps"
  const relatedArticles = getPostsByLandingPage(href).slice(0, 3)
  return (
    <>
      <QRCodeLandingPage
      title="QR Code for Google Maps"
      subtitle="Navigate to You"
      description="Create a QR code for your Google Maps location. Customers scan and get instant directions to your business."
      placeholder="https://maps.google.com/?q=Your+Address"
      inputLabel="Enter your Google Maps URL or address"
      generateLabel="Create Maps QR Code"
      features={["Instant Navigation", "No Address Typing", "Works Worldwide", "Business Essential", "Street View Links", "Multi-Location Support"]}
      howItWorks={[
        { step: "Enter Location", desc: "Paste your Google Maps share link" },
        { step: "Generate QR Code", desc: "Create a code for your location" },
        { step: "Guide Customers", desc: "Display at events, on cards, or website" },
      ]}
      useCases={["Retail stores", "Restaurants", "Event venues", "Real estate", "Tourist attractions", "Real estate open house directions"]}
      relatedPages={getRelatedQrPages(href)}
      allQRCodes={allQRCodes}

      relatedArticles={relatedArticles}
    />
    </>
  )
}