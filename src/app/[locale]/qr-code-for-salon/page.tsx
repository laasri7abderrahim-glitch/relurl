import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"
import { allQRCodes, getRelatedQrPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "QR Code for Salon - Beauty & Booking QR Codes",
    description: "Create QR codes for salon services, booking pages, and style galleries. Fill more appointments with RELURL's salon QR code generator.",
    path: "/qr-code-for-salon",
    keywords: ["qr code for salon", "beauty salon qr code", "salon booking qr code", "salon booking qr code online"],
    locale,
  })
}

export default function Page() {
  const href = "/qr-code-for-salon"
  const relatedArticles = getPostsByLandingPage(href).slice(0, 3)
  return (
    <QRCodeLandingPage
      title="QR Code for Salon"
      subtitle="Fill More Appointments"
      description="Create QR codes for salon services, booking pages, and style galleries. Let clients scan to book appointments and view your portfolio."
      placeholder="https://your-salon.com/book/appointment"
      defaultValue="https://your-salon.com/book/appointment"
      inputLabel="Enter your salon booking URL"
      generateLabel="Create Salon QR Code"
      features={["Appointment Booking", "Service Menu", "Style Gallery", "Loyalty Program", "Product Purchase Links", "Staff Portfolio"]}
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
        "Gift card purchase and redemption",
      ]}
      relatedPages={getRelatedQrPages(href)}
      allQRCodes={allQRCodes}

      relatedArticles={relatedArticles}
    />
  )
}