import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"
import { allQRCodes, getRelatedQrPages } from "@/lib/url-pages"
import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "QR Code for WiFi - WiFi Login QR Code",
    description: "Create a QR code for your WiFi network. Guests scan once and connect automatically without typing the password. Works with all routers.",
    path: "/qr-code-for-wifi",
    keywords: ["qr code for wifi", "wifi qr code", "wifi login qr code", "wifi password qr code"],
    locale,
  })
}

export default function Page() {
  const href = "/qr-code-for-wifi"
  const relatedArticles = getPostsByLandingPage(href).slice(0, 3)
  return (
    <QRCodeLandingPage
      title="QR Code for WiFi"
      subtitle="Share WiFi Instantly"
      description="Generate a QR code for your WiFi network. Guests scan once and connect automatically — no password typing needed."
      placeholder="WIFI:T:WPA;S:MyNetwork;P:mypassword;;"
      defaultValue="WIFI:T:WPA;S:MyNetwork;P:mypassword;;"
      inputLabel="WiFi network details"
      generateLabel="Create WiFi QR Code"
      features={["Auto-Connect on Scan", "Supports WPA/WEP", "Works with Any Router", "Guest Friendly", "Multi-Network Support", "QR Code Print Slips"]}
      howItWorks={[
        { step: "Enter Network Info", desc: "Enter your WiFi name (SSID) and password" },
        { step: "Generate Code", desc: "Create a QR code that encodes your WiFi credentials" },
        { step: "Share with Guests", desc: "Display the QR code for instant WiFi access" },
      ]}
      useCases={[
        "Hotels and restaurants",
        "Office reception areas",
        "Event venues",
        "Home guests",
        "Airbnbs and rental properties",
        "Coworking space guest access",
      ]}
      relatedPages={getRelatedQrPages(href)}
      allQRCodes={allQRCodes}
      relatedArticles={relatedArticles}
    />
  )
}
