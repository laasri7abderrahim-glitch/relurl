import { allQRCodes } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"
import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "QR Code for WhatsApp - Instant Messaging",
    description: "Generate a QR code that opens a WhatsApp chat. Customers scan and message you instantly — perfect for support and sales.",
    path: "/qr-code-for-whatsapp",
    keywords: ["qr code for whatsapp", "whatsapp qr code", "whatsapp chat qr", "whatsapp chat qr code"],
    locale,
  })
}

export default function Page() {
  const relatedArticles = getPostsByLandingPage("/qr-code-for-whatsapp").slice(0, 3)
  return (
    <>
      <QRCodeLandingPage
      title="QR Code for WhatsApp"
      subtitle="Instant Messaging"
      description="Generate a QR code that opens a WhatsApp chat. Customers scan and message you instantly — perfect for support and sales."
      placeholder="https://wa.me/1234567890"
      defaultValue="https://wa.me/1234567890"
      inputLabel="Enter your WhatsApp number or link"
      generateLabel="Create WhatsApp QR Code"
      features={["Instant Chat", "No Contact Saving Needed", "Global Reach", "Business Friendly", "Broadcast List Signup", "Quick Reply Templates"]}
      howItWorks={[
        { step: "Enter WhatsApp Link", desc: "Use wa.me/your-number format" },
        { step: "Generate QR Code", desc: "Create a code that opens WhatsApp chat" },
        { step: "Share with Customers", desc: "Display on website, prints, or store" },
      ]}
      useCases={[
        "Customer support",
        "Sales inquiries",
        "Restaurant ordering",
        "Service bookings",
        "Event coordination",
        "Real-time order updates",
      ]}
      relatedPages={[
        { title: "QR Code for SMS", href: "/qr-code-for-sms" },
        { title: "QR Code for Phone Number", href: "/qr-code-for-phone" },
        { title: "QR Code for Email", href: "/qr-code-for-email" },
        { title: "QR Code Generator", href: "/qr-code-generator" },
        { title: "QR Code for Business Card", href: "/qr-code-for-business-card" },
        { title: "Free QR Code Generator", href: "/free-qr-code-generator" },
      ]}
      allQRCodes={allQRCodes}

      relatedArticles={relatedArticles}
    />
    </>
  )
}