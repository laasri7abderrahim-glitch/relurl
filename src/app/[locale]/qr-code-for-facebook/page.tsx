import type { Metadata } from "next"
import { allQRCodes } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"

export const metadata: Metadata = generateSEOMetadata({
  title: "QR Code for Facebook - Connect on Facebook",
  description: "Generate a QR code for your Facebook page or group. Help people find and follow your business on Facebook.",
  path: "/qr-code-for-facebook",
  keywords: ["qr code for facebook", "facebook qr code", "facebook page qr"],
})

export default function QRCodeForFacebookPage() {
  return (
    <>
      <QRCodeLandingPage
      title="QR Code for Facebook"
      subtitle="Connect on Facebook"
      description="Generate a QR code for your Facebook page or group. Help people find and follow your business on Facebook."
      placeholder="https://facebook.com/yourpage"
      inputLabel="Enter your Facebook page or group URL"
      generateLabel="Create Facebook QR Code"
      features={["Grow Page Likes", "Event Promotion", "Community Building", "Easy Sharing"]}
      howItWorks={[
        { step: "Enter Page URL", desc: "Paste your Facebook page or group link" },
        { step: "Generate QR Code", desc: "Create a scannable code" },
        { step: "Promote Everywhere", desc: "Add to print ads, displays, or packaging" },
      ]}
      useCases={["Business page growth", "Event promotion", "Community building", "Product launches", "Store displays"]}
      relatedPages={[
        { title: "QR Code for Instagram", href: "/qr-code-for-instagram" },
        { title: "QR Code for LinkedIn", href: "/qr-code-for-linkedin" },
        { title: "QR Code for YouTube", href: "/qr-code-for-youtube" },
        { title: "QR Code Generator", href: "/qr-code-generator" },
        { title: "QR Code for Google Reviews", href: "/qr-code-for-google-reviews" },
        { title: "Free QR Code Generator", href: "/free-qr-code-generator" },
      ]}
      allQRCodes={allQRCodes}
    />
    </>
  )
}
