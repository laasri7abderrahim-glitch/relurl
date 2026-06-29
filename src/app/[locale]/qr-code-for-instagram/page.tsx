import type { Metadata } from "next"
import { allQRCodes } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"

export const metadata: Metadata = generateSEOMetadata({
  title: "QR Code for Instagram - Grow Your Following",
  description: "Create a QR code for your Instagram profile or posts. Help followers find you instantly and grow your audience.",
  path: "/qr-code-for-instagram",
  keywords: ["qr code for instagram", "instagram qr code", "instagram profile qr"],
})

export default function Page() {
  return (
    <>
      <QRCodeLandingPage
      title="QR Code for Instagram"
      subtitle="Grow Your Following"
      description="Create a QR code for your Instagram profile or posts. Help followers find you instantly and grow your audience."
      placeholder="https://instagram.com/yourusername"
      inputLabel="Enter your Instagram profile URL"
      generateLabel="Create Instagram QR Code"
      features={["Grow Followers", "Share Posts Easily", "Works on All Devices", "Print Ready"]}
      howItWorks={[
        { step: "Enter Profile URL", desc: "Paste your Instagram profile or post link" },
        { step: "Generate QR Code", desc: "Create a scannable code" },
        { step: "Share Everywhere", desc: "Add to print materials, packaging, or displays" },
      ]}
      useCases={[
        "Influencers and creators",
        "Business profiles",
        "Event promotion",
        "Product packaging",
        "Store displays",
      ]}
      relatedPages={[
        { title: "QR Code for Facebook", href: "/qr-code-for-facebook" },
        { title: "QR Code for YouTube", href: "/qr-code-for-youtube" },
        { title: "QR Code for LinkedIn", href: "/qr-code-for-linkedin" },
        { title: "QR Code Generator", href: "/qr-code-generator" },
        { title: "QR Code for WhatsApp", href: "/qr-code-for-whatsapp" },
        { title: "Free QR Code Generator", href: "/free-qr-code-generator" },
      ]}
      allQRCodes={allQRCodes}
    />
    </>
  )
}
