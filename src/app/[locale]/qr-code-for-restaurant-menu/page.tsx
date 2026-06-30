import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"
import { allQRCodes } from "@/lib/url-pages"
import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "QR Code for Restaurant Menu - Digital Menu",
    description: "Create a QR code for your restaurant menu. Let customers scan to view your menu on their phones. Perfect for contactless dining experiences.",
    path: "/qr-code-for-restaurant-menu",
    keywords: ["qr code for restaurant menu", "restaurant menu qr code", "digital menu"],
    locale,
  })
}

export default function Page() {
  const relatedArticles = getPostsByLandingPage("/qr-code-for-restaurant-menu").slice(0, 3)
  return (
    <QRCodeLandingPage
      title="QR Code for Restaurant Menu"
      subtitle="Digital Menu Solution"
      description="Create a QR code for your restaurant menu. Diners scan and view your menu on their phones — contactless and modern."
      placeholder="https://yourrestaurant.com/menu"
      inputLabel="Enter your menu URL"
      generateLabel="Create Menu QR Code"
      features={["Contactless Dining", "Easy to Update", "No App Required", "Multi-Language Support"]}
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
      ]}
      relatedPages={[
        { title: "QR Code for PDF", href: "/qr-code-for-pdf" },
        { title: "QR Code for WiFi", href: "/qr-code-for-wifi" },
        { title: "QR Code for Google Reviews", href: "/qr-code-for-google-reviews" },
        { title: "QR Code Generator", href: "/qr-code-generator" },
        { title: "QR Code for Event Registration", href: "/qr-code-for-event" },
        { title: "Free QR Code Generator", href: "/free-qr-code-generator" },
      ]}
      allQRCodes={allQRCodes}

      relatedArticles={relatedArticles}
    />
  )
}