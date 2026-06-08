import type { Metadata } from "next"
import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"
import { allLandingPages, qrPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"

const allQRCodes = [...allLandingPages, ...qrPages]

export const metadata: Metadata = generateSEOMetadata({
  title: "QR Code for Store - Retail & Product QR Codes",
  description: "Create QR codes for store product pages, promotions, and checkout. Boost retail sales with scannable QR codes from RELURL.",
  path: "/qr-code-for-store",
  keywords: ["qr code for store", "retail qr code", "product qr code"],
})

export default function Page() {
  return (
    <QRCodeLandingPage
      title="QR Code for Store"
      subtitle="Boost Retail Sales"
      description="Create QR codes for store product pages, promotions, and checkout. Let customers scan to browse products and complete purchases."
      placeholder="https://your-store.com/products/bestseller"
      defaultValue="https://your-store.com/products/bestseller"
      inputLabel="Enter your product or store URL"
      generateLabel="Create Store QR Code"
      features={["Product Page Links", "Promotion Codes", "Checkout Integration", "Inventory Lookup"]}
      howItWorks={[
        { step: "Enter Product URL", desc: "Paste your product page, promotion, or store link." },
        { step: "Generate QR Code", desc: "Create a scannable code for your retail environment." },
        { step: "Display in Store", desc: "Place on shelves, tags, windows, and marketing materials." },
      ]}
      useCases={[
        "Product information displays",
        "In-store promotion campaigns",
        "Self-checkout links",
        "Price comparison tools",
        "Loyalty program enrollment",
      ]}
      relatedPages={[
        { title: "QR Code Generator", href: "/qr-code-generator" },
        { title: "QR Code for Business Card", href: "/qr-code-for-business-card" },
        { title: "QR Code for Google Reviews", href: "/qr-code-for-google-reviews" },
        { title: "QR Code for App Download", href: "/qr-code-for-app-download" },
        { title: "QR Code for WiFi", href: "/qr-code-for-wifi" },
        { title: "QR Code for Event", href: "/qr-code-for-event" },
      ]}
      allQRCodes={allQRCodes}
    />
  )
}
