import { allQRCodes } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"
import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "QR Code for Email - Email Made Simple",
    description: "Generate a QR code that opens an email compose window with pre-filled subject and body. Perfect for feedback collection.",
    path: "/qr-code-for-email",
    keywords: ["qr code for email", "email qr code", "mailto qr code", "email marketing qr code"],
    locale,
  })
}

export default function QRCodeForEmailPage() {
  const relatedArticles = getPostsByLandingPage("/qr-code-for-email").slice(0, 3)
  return (
    <>
      <QRCodeLandingPage
      title="QR Code for Email"
      subtitle="Email Made Simple"
      description="Generate a QR code that opens an email compose window with pre-filled subject and body. Perfect for feedback collection."
      placeholder="mailto:someone@example.com?subject=Hello"
      defaultValue="mailto:someone@example.com?subject=Hello"
      inputLabel="Enter email address or mailto link"
      generateLabel="Create Email QR Code"
      features={["Pre-filled Subject", "One-Scan Compose", "No Typing Needed", "Feedback Friendly", "Newsletter Signup", "Auto-Reply Setup"]}
      howItWorks={[
        { step: "Enter Email Details", desc: "Provide email address and optional subject/body" },
        { step: "Generate QR Code", desc: "Create a code that opens email compose" },
        { step: "Collect Responses", desc: "Display for instant feedback or inquiries" },
      ]}
      useCases={["Customer feedback", "Support inquiries", "Contact forms", "Survey responses", "Job applications", "Newsletter subscription"]}
      relatedPages={[
        { title: "QR Code for Phone Number", href: "/qr-code-for-phone" },
        { title: "QR Code for SMS", href: "/qr-code-for-sms" },
        { title: "QR Code for WhatsApp", href: "/qr-code-for-whatsapp" },
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