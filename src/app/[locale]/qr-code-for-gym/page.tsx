import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"
import { allQRCodes, getRelatedQrPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "QR Code for Gym - Fitness & Class QR Codes",
    description: "Create QR codes for gym schedules, class bookings, and membership info. Streamline fitness center operations with RELURL QR codes.",
    path: "/qr-code-for-gym",
    keywords: ["qr code for gym", "fitness qr code", "gym class qr code", "fitness center qr code"],
    locale,
  })
}

export default function Page() {
  const href = "/qr-code-for-gym"
  const relatedArticles = getPostsByLandingPage(href).slice(0, 3)
  return (
    <QRCodeLandingPage
      title="QR Code for Gym"
      subtitle="Streamline Fitness Access"
      description="Create QR codes for gym schedules, class bookings, and membership info. Let members scan to book classes and access resources instantly."
      placeholder="https://your-gym.com/classes/schedule"
      defaultValue="https://your-gym.com/classes/schedule"
      inputLabel="Enter your gym service URL"
      generateLabel="Create Gym QR Code"
      features={["Class Booking Links", "Membership Info", "Workout Library", "Trainer Profiles", "Equipment Tutorials", "Event Registration"]}
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
        "Personal training package purchases",
      ]}
      relatedPages={getRelatedQrPages(href)}
      allQRCodes={allQRCodes}

      relatedArticles={relatedArticles}
    />
  )
}