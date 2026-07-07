import { allQRCodes, getRelatedQrPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"
import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "QR Code for Event Registration - Streamline Check-in",
    description: "Create a QR code for event registration. Attendees scan to register, check in, or access event details instantly.",
    path: "/qr-code-for-event",
    keywords: ["qr code for event", "event qr code", "registration qr code", "event registration qr code"],
    locale,
  })
}

export default function QRCodeForEventPage() {
  const href = "/qr-code-for-event"
  const relatedArticles = getPostsByLandingPage(href).slice(0, 3)
  return (
    <>
      <QRCodeLandingPage
      title="QR Code for Event Registration"
      subtitle="Streamline Check-in"
      description="Create a QR code for event registration. Attendees scan to register, check in, or access event details instantly."
      placeholder="https://yourEvent.com/register"
      inputLabel="Enter event registration URL"
      generateLabel="Create Event QR Code"
      features={["Fast Check-in", "Contactless Registration", "Real-time Tracking", "Print Ready", "Schedule Access", "Speaker Profiles"]}
      howItWorks={[
        { step: "Enter Registration URL", desc: "Link to your event registration page" },
        { step: "Generate QR Code", desc: "Create a code for promotion" },
        { step: "Promote Event", desc: "Add to flyers, posters, and social media" },
      ]}
      useCases={["Conferences and seminars", "Workshops and classes", "Networking events", "Sports events", "Concerts and festivals", "Virtual event streaming links"]}
      relatedPages={getRelatedQrPages(href)}
      allQRCodes={allQRCodes}

      relatedArticles={relatedArticles}
    />
    </>
  )
}