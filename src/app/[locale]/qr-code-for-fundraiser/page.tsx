import type { Metadata } from "next"
import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"
import { allQRCodes } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "QR Code for Fundraiser - Donation & Charity QR Codes",
  description: "Create QR codes for fundraiser donation pages and charity events. Maximize donations with easy-to-scan QR codes from RELURL.",
  path: "/qr-code-for-fundraiser",
  keywords: ["qr code for fundraiser", "donation qr code", "charity qr code"],
})

export default function Page() {
  return (
    <QRCodeLandingPage
      title="QR Code for Fundraiser"
      subtitle="Maximize Donations"
      description="Create QR codes for fundraiser donation pages and charity events. Make it effortless for supporters to donate with a quick scan."
      placeholder="https://charity.org/donate/annual-fundraiser"
      defaultValue="https://charity.org/donate/annual-fundraiser"
      inputLabel="Enter your donation page URL"
      generateLabel="Create Fundraiser QR Code"
      features={["Donation Page Links", "Event Registration", "Sponsor Tracking", "Social Sharing"]}
      howItWorks={[
        { step: "Enter Donation URL", desc: "Paste your donation page or fundraiser event link." },
        { step: "Generate QR Code", desc: "Create a code that links directly to your donation form." },
        { step: "Display at Event", desc: "Place at entrance, tables, and promotional displays." },
      ]}
      useCases={[
        "Charity gala donations",
        "School fundraiser campaigns",
        "Community event giving",
        "Online fundraiser promotion",
        "Sponsor recognition displays",
      ]}
      relatedPages={[
        { title: "QR Code Generator", href: "/qr-code-generator" },
        { title: "QR Code for Event", href: "/qr-code-for-event" },
        { title: "QR Code for Google Reviews", href: "/qr-code-for-google-reviews" },
        { title: "QR Code for Email", href: "/qr-code-for-email" },
        { title: "QR Code for Social Media", href: "/qr-code-for-facebook" },
        { title: "QR Code for WiFi", href: "/qr-code-for-wifi" },
      ]}
      allQRCodes={allQRCodes}
    />
  )
}
