import { allQRCodes, getRelatedQrPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"
import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "QR Code for LinkedIn - Professional Networking",
    description: "Create a QR code for your LinkedIn profile or company page. Make professional connections faster at events.",
    path: "/qr-code-for-linkedin",
    keywords: ["qr code for linkedin", "linkedin qr code", "linkedin profile qr", "linkedin profile qr code"],
    locale,
  })
}

export default function QRCodeForLinkedInPage() {
  const href = "/qr-code-for-linkedin"
  const relatedArticles = getPostsByLandingPage(href).slice(0, 3)
  return (
    <>
      <QRCodeLandingPage
      title="QR Code for LinkedIn"
      subtitle="Professional Networking"
      description="Create a QR code for your LinkedIn profile or company page. Make professional connections faster at events."
      placeholder="https://linkedin.com/in/yourprofile"
      inputLabel="Enter your LinkedIn profile or company URL"
      generateLabel="Create LinkedIn QR Code"
      features={["Professional Networking", "Event Ready", "Instant Connection", "Career Boost", "Recommendation Requests", "Company Page Links"]}
      howItWorks={[
        { step: "Enter LinkedIn URL", desc: "Paste your profile or company page link" },
        { step: "Generate QR Code", desc: "Create a professional QR code" },
        { step: "Network Smart", desc: "Add to business cards or wear at events" },
      ]}
      useCases={["Conference networking", "Job fairs", "Business meetings", "Recruitment events", "Professional services", "Co-founder and partner searching"]}
      relatedPages={getRelatedQrPages(href)}
      allQRCodes={allQRCodes}

      relatedArticles={relatedArticles}
    />
    </>
  )
}