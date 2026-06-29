import type { Metadata } from "next"
import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"
import { allQRCodes } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "QR Code for Salon - Beauty & Booking QR Codes",
  description: "Create QR codes for salon services, booking pages, and style galleries. Fill more appointments with RELURL's salon QR code generator.",
  path: "/qr-code-for-salon",
  keywords: ["qr code for salon", "beauty salon qr code", "salon booking qr code"],
})

export default function Page() {
  return (
    <QRCodeLandingPage
      title="QR Code for Salon"
      subtitle="Fill More Appointments"
      description="Create QR codes for salon services, booking pages, and style galleries. Let clients scan to book appointments and view your portfolio."
      placeholder="https://your-salon.com/book/appointment"
      defaultValue="https://your-salon.com/book/appointment"
      inputLabel="Enter your salon booking URL"
      generateLabel="Create Salon QR Code"
      features={["Appointment Booking", "Service Menu", "Style Gallery", "Loyalty Program"]}
      howItWorks={[
        { step: "Enter Booking URL", desc: "Paste your online booking or service menu link." },
        { step: "Generate QR Code", desc: "Create a QR code that links to your booking page." },
        { step: "Display in Salon", desc: "Place at reception, mirrors, and promotional displays." },
      ]}
      useCases={[
        "Appointment booking at reception",
        "Service menu browsing",
        "Before-and-after galleries",
        "Loyalty program signups",
        "Product recommendation links",
      ]}
      relatedPages={[
        { title: "QR Code Generator", href: "/qr-code-generator" },
        { title: "QR Code for Google Reviews", href: "/qr-code-for-google-reviews" },
        { title: "QR Code for Business Card", href: "/qr-code-for-business-card" },
        { title: "QR Code for WiFi", href: "/qr-code-for-wifi" },
        { title: "QR Code for Instagram", href: "/qr-code-for-instagram" },
        { title: "QR Code for Event", href: "/qr-code-for-event" },
      ]}
      allQRCodes={allQRCodes}
    />
  )
}
