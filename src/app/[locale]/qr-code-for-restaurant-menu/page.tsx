import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"
import { allQRCodes, getRelatedQrPages } from "@/lib/url-pages"
import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "QR Code for Restaurant Menu - Digital Menu",
    description: "Create a QR code for your restaurant menu. Let customers scan to view your menu on their phones. Perfect for contactless dining experiences.",
    path: "/qr-code-for-restaurant-menu",
    keywords: ["qr code for restaurant menu", "restaurant menu qr code", "digital menu", "digital menu qr code"],
    locale,
  })
}

export default function Page() {
  const href = "/qr-code-for-restaurant-menu"
  const relatedArticles = getPostsByLandingPage(href).slice(0, 3)
  return (
    <QRCodeLandingPage
      title="QR Code for Restaurant Menu"
      subtitle="Digital Menu Solution"
      description="Create a QR code for your restaurant menu. Diners scan and view your menu on their phones — contactless and modern."
      placeholder="https://yourrestaurant.com/menu"
      inputLabel="Enter your menu URL"
      generateLabel="Create Menu QR Code"
      features={["Contactless Dining", "Easy to Update", "No App Required", "Multi-Language Support", "Daily Special Alerts", "Nutritional Info"]}
      howItWorks={[
        { step: "Upload Menu URL", desc: "Link to your online menu or PDF" },
        { step: "Generate QR Code", desc: "Create a code for table placement" },
        { step: "Place on Tables", desc: "Print and display at each table" },
      ]}
      useCases={[
        "Restaurants and cafes",
        "Food trucks",
        "Bars and pubs",
        "Catering services",
        "Hotel restaurants",
        "Wine and beverage pairings",
      ]}
      relatedPages={getRelatedQrPages(href)}
      allQRCodes={allQRCodes}

      relatedArticles={relatedArticles}
    />
  )
}