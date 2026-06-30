import { allQRCodes } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"
import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "QR Code for LinkedIn - Professional Networking",
    description: "Create a QR code for your LinkedIn profile or company page. Make professional connections faster at events.",
    path: "/qr-code-for-linkedin",
    keywords: ["qr code for linkedin", "linkedin qr code", "linkedin profile qr"],
    locale,
  })
}

export default function QRCodeForLinkedInPage() {
  const relatedArticles = getPostsByLandingPage("/qr-code-for-linkedin").slice(0, 3)
  return (
    <>
      <QRCodeLandingPage
      title="QR Code for LinkedIn"
      subtitle="Professional Networking"
      description="Create a QR code for your LinkedIn profile or company page. Make professional connections faster at events."
      placeholder="https://linkedin.com/in/yourprofile"
      inputLabel="Enter your LinkedIn profile or company URL"
      generateLabel="Create LinkedIn QR Code"
      features={["Professional Networking", "Event Ready", "Instant Connection", "Career Boost"]}
      howItWorks={[
        { step: "Enter LinkedIn URL", desc: "Paste your profile or company page link" },
        { step: "Generate QR Code", desc: "Create a professional QR code" },
        { step: "Network Smart", desc: "Add to business cards or wear at events" },
      ]}
      useCases={["Conference networking", "Job fairs", "Business meetings", "Recruitment events", "Professional services"]}
      relatedPages={[
        { title: "QR Code for Business Card", href: "/qr-code-for-business-card" },
        { title: "QR Code for vCard", href: "/qr-code-for-vcard" },
        { title: "QR Code for Email", href: "/qr-code-for-email" },
        { title: "QR Code Generator", href: "/qr-code-generator" },
        { title: "QR Code for Facebook", href: "/qr-code-for-facebook" },
        { title: "Free QR Code Generator", href: "/free-qr-code-generator" },
      ]}
      allQRCodes={allQRCodes}

      relatedArticles={relatedArticles}
    />
    </>
  )
}