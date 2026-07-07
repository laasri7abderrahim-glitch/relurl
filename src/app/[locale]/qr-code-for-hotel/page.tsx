import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"
import { allQRCodes } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "QR Code for Hotel - Guest Services & Info QR Codes",
    description: "Create QR codes for hotel services, room info, and guest amenities. Enhance guest experience with instant access via RELURL QR codes.",
    path: "/qr-code-for-hotel",
    keywords: ["qr code for hotel", "hotel guest qr code", "hotel info qr code", "hotel service qr code"],
    locale,
  })
}

export default function Page() {
  const relatedArticles = getPostsByLandingPage("/qr-code-for-hotel").slice(0, 3)
  return (
    <QRCodeLandingPage
      title="QR Code for Hotel"
      subtitle="Enhance Guest Experience"
      description="Create QR codes for hotel services, room info, and guest amenities. Give guests instant access to everything they need with a quick scan."
      placeholder="https://your-hotel.com/rooms/amenities"
      defaultValue="https://your-hotel.com/rooms/amenities"
      inputLabel="Enter your hotel service URL"
      generateLabel="Create Hotel QR Code"
      features={["Room Service Links", "Concierge Access", "Amenity Guides", "Review Collection", "Digital Room Keys", "Contactless Checkout"]}
      howItWorks={[
        { step: "Enter Service URL", desc: "Paste your hotel service, amenity, or info page link." },
        { step: "Generate QR Code", desc: "Create a branded QR code for your property." },
        { step: "Place in Rooms", desc: "Print on cards, signs, or displays throughout the hotel." },
      ]}
      useCases={[
        "In-room service menus",
        "Concierge and spa booking",
        "WiFi access for guests",
        "Local attraction guides",
        "Guest feedback collection",
        "Loyalty program enrollment",
      ]}
      relatedPages={[
        { title: "QR Code Generator", href: "/qr-code-generator" },
        { title: "QR Code for WiFi", href: "/qr-code-for-wifi" },
        { title: "QR Code for Google Reviews", href: "/qr-code-for-google-reviews" },
        { title: "QR Code for Restaurant Menu", href: "/qr-code-for-restaurant-menu" },
        { title: "QR Code for Event", href: "/qr-code-for-event" },
        { title: "QR Code for Business Card", href: "/qr-code-for-business-card" },
      ]}
      allQRCodes={allQRCodes}

      relatedArticles={relatedArticles}
    />
  )
}