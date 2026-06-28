import type { Metadata } from "next"
import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"
import { allLandingPages, qrPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"

const allQRCodes = [...allLandingPages, ...qrPages]

export const metadata: Metadata = generateSEOMetadata({
  title: "QR Code for Restaurant - Menu & Table QR Codes",
  description: "Create QR codes for restaurant menus, table ordering, and reservations. Boost dine-in and takeout orders with RELURL's QR code generator.",
  path: "/qr-code-for-restaurant",
  keywords: ["qr code for restaurant", "restaurant menu qr code", "table qr code"],
})

export default function Page() {
  return (
    <QRCodeLandingPage
      title="QR Code for Restaurant"
      subtitle="Digitize Your Menu"
      description="Create QR codes for restaurant menus, table ordering, and reservations. Let customers scan to view your menu and place orders instantly."
      placeholder="https://your-restaurant.com/menu"
      defaultValue="https://your-restaurant.com/menu"
      inputLabel="Enter your menu or ordering URL"
      generateLabel="Create Restaurant QR Code"
      features={["Menu Display", "Table-Specific Codes", "Ordering Integration", "Multi-Language Support"]}
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
      ]}
      relatedPages={[
        { title: "QR Code Generator", href: "/qr-code-generator" },
        { title: "QR Code for Restaurant Menu", href: "/qr-code-for-restaurant-menu" },
        { title: "QR Code for Google Reviews", href: "/qr-code-for-google-reviews" },
        { title: "QR Code for Business Card", href: "/qr-code-for-business-card" },
        { title: "QR Code for WiFi", href: "/qr-code-for-wifi" },
        { title: "QR Code for Event", href: "/qr-code-for-event" },
      ]}
      allQRCodes={allQRCodes}
    />
  )
}
