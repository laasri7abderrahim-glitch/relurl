import type { Metadata } from "next"
import { generateSEOMetadata } from "@/lib/seo"
import { allLandingPages, qrPages } from "@/lib/url-pages"
import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"

const allQRCodes = [...allLandingPages, ...qrPages]

export const metadata: Metadata = generateSEOMetadata({
  title: "QR Code for Google Reviews - Get Reviews",
  description: "Generate a QR code that links to your Google review page. Make it easy for happy customers to leave 5-star reviews and boost your ratings.",
  path: "/qr-code-for-google-reviews",
  keywords: ["qr code for google reviews", "google review qr code", "get more reviews"],
})

export default function Page() {
  return (
    <QRCodeLandingPage
      title="QR Code for Google Reviews"
      subtitle="Boost Your Reviews"
      description="Generate a QR code that links directly to your Google review page. Make it easy for customers to leave feedback."
      placeholder="https://g.page/your-business/review"
      inputLabel="Enter your Google review link"
      generateLabel="Create Review QR Code"
      features={["Direct to Review Page", "Boost Review Count", "Easy for Customers", "Track Review Scans"]}
      howItWorks={[
        { step: "Get Review Link", desc: "Copy your Google Business review URL" },
        { step: "Generate QR Code", desc: "Create a code that opens the review page" },
        { step: "Display at Location", desc: "Place near checkout or on receipts" },
      ]}
      useCases={[
        "Retail stores",
        "Restaurants and cafes",
        "Hotels",
        "Service businesses",
        "Healthcare offices",
      ]}
      relatedPages={[
        { title: "QR Code for Google Maps", href: "/qr-code-for-google-maps" },
        { title: "QR Code for Business Card", href: "/qr-code-for-business-card" },
        { title: "QR Code Generator", href: "/qr-code-generator" },
        { title: "QR Code for Instagram", href: "/qr-code-for-instagram" },
        { title: "QR Code for Facebook", href: "/qr-code-for-facebook" },
        { title: "Free QR Code Generator", href: "/free-qr-code-generator" },
      ]}
      allQRCodes={allQRCodes}
    />
  )
}
