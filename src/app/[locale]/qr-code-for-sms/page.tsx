import { allQRCodes } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"
import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "QR Code for SMS - Text Message QR Code",
    description: "Generate a QR code that opens a pre-filled SMS message. Perfect for opt-ins, feedback, and quick responses.",
    path: "/qr-code-for-sms",
    keywords: ["qr code for sms", "sms qr code", "text message qr code", "text message qr code rsvp"],
    locale,
  })
}

export default function QRCodeForSMSPage() {
  const relatedArticles = getPostsByLandingPage("/qr-code-for-sms").slice(0, 3)
  return (
    <>
      <QRCodeLandingPage
      title="QR Code for SMS"
      subtitle="Text Message QR Code"
      description="Generate a QR code that opens a pre-filled SMS message. Perfect for opt-ins, feedback, and quick responses."
      placeholder="sms:+1234567890?body=Hello"
      defaultValue="sms:+1234567890?body=Hello"
      inputLabel="Enter phone number and message"
      generateLabel="Create SMS QR Code"
      features={["Pre-filled Message", "One-Scan Text", "No Typing Required", "Marketing Ready", "Auto-Response Setup", "Keyword Opt-In"]}
      howItWorks={[
        { step: "Enter Phone & Message", desc: "Provide number and default message text" },
        { step: "Generate QR Code", desc: "Create a code that opens SMS app" },
        { step: "Collect Responses", desc: "Display for opt-ins or quick feedback" },
      ]}
      useCases={["SMS marketing opt-in", "Event RSVP", "Quick surveys", "Product feedback", "Support requests", "Coupon and discount delivery"]}
      relatedPages={[
        { title: "QR Code for Phone Number", href: "/qr-code-for-phone" },
        { title: "QR Code for WhatsApp", href: "/qr-code-for-whatsapp" },
        { title: "QR Code for Email", href: "/qr-code-for-email" },
        { title: "QR Code Generator", href: "/qr-code-generator" },
        { title: "QR Code for Event Registration", href: "/qr-code-for-event" },
        { title: "Free QR Code Generator", href: "/free-qr-code-generator" },
      ]}
      allQRCodes={allQRCodes}

      relatedArticles={relatedArticles}
    />
    </>
  )
}