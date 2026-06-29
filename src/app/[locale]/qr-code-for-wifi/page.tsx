import type { Metadata } from "next"
import { generateSEOMetadata } from "@/lib/seo"
import { allQRCodes } from "@/lib/url-pages"
import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"

export const metadata: Metadata = generateSEOMetadata({
  title: "QR Code for WiFi - WiFi Login QR Code",
  description: "Create a QR code for your WiFi network. Guests scan once and connect automatically without typing the password. Works with all routers.",
  path: "/qr-code-for-wifi",
  keywords: ["qr code for wifi", "wifi qr code", "wifi login qr code"],
})

export default function Page() {
  return (
    <QRCodeLandingPage
      title="QR Code for WiFi"
      subtitle="Share WiFi Instantly"
      description="Generate a QR code for your WiFi network. Guests scan once and connect automatically — no password typing needed."
      placeholder="WIFI:T:WPA;S:MyNetwork;P:mypassword;;"
      defaultValue="WIFI:T:WPA;S:MyNetwork;P:mypassword;;"
      inputLabel="WiFi network details"
      generateLabel="Create WiFi QR Code"
      features={["Auto-Connect on Scan", "Supports WPA/WEP", "Works with Any Router", "Guest Friendly"]}
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
      ]}
      relatedPages={[
        { title: "QR Code Generator", href: "/qr-code-generator" },
        { title: "QR Code for Business Card", href: "/qr-code-for-business-card" },
        { title: "QR Code for Restaurant Menu", href: "/qr-code-for-restaurant-menu" },
        { title: "QR Code for Event Registration", href: "/qr-code-for-event" },
        { title: "Free QR Code Generator", href: "/free-qr-code-generator" },
        { title: "QR Code for Google Maps", href: "/qr-code-for-google-maps" },
      ]}
      allQRCodes={allQRCodes}
    />
  )
}
