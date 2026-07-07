import { allQRCodes } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"
import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "QR Code for Phone Number - One-Tap Calling",
    description: "Create a QR code that opens a phone dialer when scanned. Make it easy for customers to call you instantly.",
    path: "/qr-code-for-phone",
    keywords: ["qr code for phone", "phone number qr code", "call qr code", "tap to call qr code"],
    locale,
  })
}

export default function QRCodeForPhonePage() {
  const relatedArticles = getPostsByLandingPage("/qr-code-for-phone").slice(0, 3)
  return (
    <>
      <QRCodeLandingPage
      title="QR Code for Phone Number"
      subtitle="One-Tap Calling"
      description="Create a QR code that opens a phone dialer when scanned. Make it easy for customers to call you instantly."
      placeholder="tel:+1234567890"
      defaultValue="tel:+1234567890"
      inputLabel="Enter phone number"
      generateLabel="Create Phone QR Code"
      features={["Instant Calling", "No Manual Dialing", "Works Globally", "Business Essential", "Call Scheduling", "Voicemail Access"]}
      howItWorks={[
        { step: "Enter Phone Number", desc: "Provide your phone number with country code" },
        { step: "Generate QR Code", desc: "Create a code that opens the dialer" },
        { step: "Share Everywhere", desc: "Add to signs, ads, or business materials" },
      ]}
      useCases={["Business contact", "Emergency services", "Delivery services", "Real estate listings", "Service providers", "Doctor's office appointment calls"]}
      relatedPages={[
        { title: "QR Code for SMS", href: "/qr-code-for-sms" },
        { title: "QR Code for WhatsApp", href: "/qr-code-for-whatsapp" },
        { title: "QR Code for Email", href: "/qr-code-for-email" },
        { title: "QR Code Generator", href: "/qr-code-generator" },
        { title: "QR Code for vCard", href: "/qr-code-for-vcard" },
        { title: "Free QR Code Generator", href: "/free-qr-code-generator" },
      ]}
      allQRCodes={allQRCodes}

      relatedArticles={relatedArticles}
    />
    </>
  )
}