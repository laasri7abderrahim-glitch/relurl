import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"
import { allQRCodes, getRelatedQrPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "QR Code for Restaurant - Menu & Table QR Codes",
    description: "Create QR codes for restaurant menus, table ordering, and reservations. Boost dine-in and takeout orders with RELURL's QR code generator.",
    path: "/qr-code-for-restaurant",
    keywords: ["qr code for restaurant", "restaurant menu qr code", "table qr code", "restaurant qr code dining"],
    locale,
  })
}

export default function Page() {
  const href = "/qr-code-for-restaurant"
  const relatedArticles = getPostsByLandingPage(href).slice(0, 3)
  return (
    <QRCodeLandingPage
      title="QR Code for Restaurant"
      subtitle="Digitize Your Menu"
      description="Create QR codes for restaurant menus, table ordering, and reservations. Let customers scan to view your menu and place orders instantly."
      placeholder="https://your-restaurant.com/menu"
      defaultValue="https://your-restaurant.com/menu"
      inputLabel="Enter your menu or ordering URL"
      generateLabel="Create Restaurant QR Code"
      features={["Menu Display", "Table-Specific Codes", "Ordering Integration", "Multi-Language Support", "Reservation System", "Allergen Info Access"]}
      howItWorks={[
        { step: "Enter Menu URL", desc: "Paste your digital menu or online ordering link." },
        { step: "Generate QR Code", desc: "Create a scannable QR code for your restaurant." },
        { step: "Place on Tables", desc: "Print and display QR codes at each table or entrance." },
      ]}
      useCases={[
        "Dine-in menu browsing",
        "Tableside ordering",
        "Takeout and delivery links",
        "Happy hour promotions",
        "Event and catering menus",
        "Contactless payment at tables",
      ]}
      relatedPages={getRelatedQrPages(href)}
      allQRCodes={allQRCodes}

      relatedArticles={relatedArticles}
    />
  )
}