import type { Metadata } from "next"
import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"
import { allQRCodes } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "QR Code for Gym - Fitness & Class QR Codes",
  description: "Create QR codes for gym schedules, class bookings, and membership info. Streamline fitness center operations with RELURL QR codes.",
  path: "/qr-code-for-gym",
  keywords: ["qr code for gym", "fitness qr code", "gym class qr code"],
})

export default function Page() {
  return (
    <QRCodeLandingPage
      title="QR Code for Gym"
      subtitle="Streamline Fitness Access"
      description="Create QR codes for gym schedules, class bookings, and membership info. Let members scan to book classes and access resources instantly."
      placeholder="https://your-gym.com/classes/schedule"
      defaultValue="https://your-gym.com/classes/schedule"
      inputLabel="Enter your gym service URL"
      generateLabel="Create Gym QR Code"
      features={["Class Booking Links", "Membership Info", "Workout Library", "Trainer Profiles"]}
      howItWorks={[
        { step: "Enter Gym URL", desc: "Paste your class schedule, booking, or membership link." },
        { step: "Generate QR Code", desc: "Create a QR code for your gym's digital resources." },
        { step: "Display in Gym", desc: "Place at entrance, studios, and throughout the facility." },
      ]}
      useCases={[
        "Class schedule displays",
        "Personal training bookings",
        "Membership renewal links",
        "Workout video access",
        "Nutrition plan downloads",
      ]}
      relatedPages={[
        { title: "QR Code Generator", href: "/qr-code-generator" },
        { title: "QR Code for WiFi", href: "/qr-code-for-wifi" },
        { title: "QR Code for Event", href: "/qr-code-for-event" },
        { title: "QR Code for Google Reviews", href: "/qr-code-for-google-reviews" },
        { title: "QR Code for Business Card", href: "/qr-code-for-business-card" },
        { title: "QR Code for App Download", href: "/qr-code-for-app-download" },
      ]}
      allQRCodes={allQRCodes}
    />
  )
}
