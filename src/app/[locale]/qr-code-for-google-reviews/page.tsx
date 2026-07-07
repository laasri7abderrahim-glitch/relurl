import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"
import { allQRCodes, getRelatedQrPages } from "@/lib/url-pages"
import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "QR Code for Google Reviews - Get Reviews",
    description: "Generate a QR code that links to your Google review page. Make it easy for happy customers to leave 5-star reviews and boost your ratings.",
    path: "/qr-code-for-google-reviews",
    keywords: ["qr code for google reviews", "google review qr code", "get more reviews", "review qr code"],
    locale,
  })
}

export default function Page() {
  const href = "/qr-code-for-google-reviews"
  const relatedArticles = getPostsByLandingPage(href).slice(0, 3)
  return (
    <QRCodeLandingPage
      title="QR Code for Google Reviews"
      subtitle="Boost Your Reviews"
      description="Generate a QR code that links directly to your Google review page. Make it easy for customers to leave feedback."
      placeholder="https://g.page/your-business/review"
      inputLabel="Enter your Google review link"
      generateLabel="Create Review QR Code"
      features={["Direct to Review Page", "Boost Review Count", "Easy for Customers", "Track Review Scans", "Review Response Link", "Rating Dashboard"]}
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
        "Automotive dealership reviews",
      ]}
      relatedPages={getRelatedQrPages(href)}
      allQRCodes={allQRCodes}

      relatedArticles={relatedArticles}
    />
  )
}