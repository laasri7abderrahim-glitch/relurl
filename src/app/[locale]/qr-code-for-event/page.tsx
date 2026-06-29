import type { Metadata } from "next"
import { generateSEOMetadata } from "@/lib/seo"
import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"

const allQRCodes = [
  { title: "QR Code Generator", href: "/qr-code-generator" },
  { title: "Dynamic QR Code", href: "/dynamic-qr-code-generator" },
  { title: "Free QR Code", href: "/free-qr-code-generator" },
  { title: "QR Code for PDF", href: "/qr-code-for-pdf" },
  { title: "QR Code for WiFi", href: "/qr-code-for-wifi" },
  { title: "QR Code for Business Card", href: "/qr-code-for-business-card" },
  { title: "QR Code for Restaurant Menu", href: "/qr-code-for-restaurant-menu" },
  { title: "QR Code for Google Reviews", href: "/qr-code-for-google-reviews" },
  { title: "QR Code for Instagram", href: "/qr-code-for-instagram" },
  { title: "QR Code for WhatsApp", href: "/qr-code-for-whatsapp" },
  { title: "QR Code for YouTube", href: "/qr-code-for-youtube" },
  { title: "QR Code for Facebook", href: "/qr-code-for-facebook" },
  { title: "QR Code for LinkedIn", href: "/qr-code-for-linkedin" },
  { title: "QR Code for Email", href: "/qr-code-for-email" },
  { title: "QR Code for Phone Number", href: "/qr-code-for-phone" },
  { title: "QR Code for SMS", href: "/qr-code-for-sms" },
  { title: "QR Code for Event Registration", href: "/qr-code-for-event" },
  { title: "QR Code for vCard", href: "/qr-code-for-vcard" },
  { title: "QR Code for Google Maps", href: "/qr-code-for-google-maps" },
  { title: "QR Code for App Download", href: "/qr-code-for-app-download" },
]

export const metadata: Metadata = generateSEOMetadata({
  title: "QR Code for Event Registration - Streamline Check-in",
  description: "Create a QR code for event registration. Attendees scan to register, check in, or access event details instantly.",
  path: "/qr-code-for-event",
  keywords: ["qr code for event", "event qr code", "registration qr code"],
})

export default function QRCodeForEventPage() {
  return (
    <>
      <QRCodeLandingPage
      title="QR Code for Event Registration"
      subtitle="Streamline Check-in"
      description="Create a QR code for event registration. Attendees scan to register, check in, or access event details instantly."
      placeholder="https://yourEvent.com/register"
      inputLabel="Enter event registration URL"
      generateLabel="Create Event QR Code"
      features={["Fast Check-in", "Contactless Registration", "Real-time Tracking", "Print Ready"]}
      howItWorks={[
        { step: "Enter Registration URL", desc: "Link to your event registration page" },
        { step: "Generate QR Code", desc: "Create a code for promotion" },
        { step: "Promote Event", desc: "Add to flyers, posters, and social media" },
      ]}
      useCases={["Conferences and seminars", "Workshops and classes", "Networking events", "Sports events", "Concerts and festivals"]}
      relatedPages={[
        { title: "QR Code for Google Maps", href: "/qr-code-for-google-maps" },
        { title: "QR Code for PDF", href: "/qr-code-for-pdf" },
        { title: "QR Code for Restaurant Menu", href: "/qr-code-for-restaurant-menu" },
        { title: "QR Code Generator", href: "/qr-code-generator" },
        { title: "QR Code for Instagram", href: "/qr-code-for-instagram" },
        { title: "Free QR Code Generator", href: "/free-qr-code-generator" },
      ]}
      allQRCodes={allQRCodes}
    />
    </>
  )
}
