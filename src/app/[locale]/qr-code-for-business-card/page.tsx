import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"
import { allQRCodes } from "@/lib/url-pages"
import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "QR Code for Business Card - Digital Card",
    description: "Add a QR code to your business card. Let people scan to save your contact info, website, and social profiles instantly to their phone.",
    path: "/qr-code-for-business-card",
    keywords: ["qr code for business card", "business card qr code", "digital business card"],
    locale,
  })
}

export default function Page() {
  const relatedArticles = getPostsByLandingPage("/qr-code-for-business-card").slice(0, 3)
  return (
    <QRCodeLandingPage
      title="QR Code for Business Card"
      subtitle="Networking Made Easy"
      description="Add a QR code to your business card that links to your website, portfolio, or contact info. Make every connection count."
      placeholder="https://yoursite.com"
      inputLabel="Enter your website or portfolio URL"
      generateLabel="Create Business Card QR Code"
      features={["Professional Look", "Instant Contact Sharing", "Works on Any Card", "Track Scans"]}
      howItWorks={[
        { step: "Enter Your URL", desc: "Link to your website, LinkedIn, or portfolio" },
        { step: "Generate QR Code", desc: "Create a professional QR code" },
        { step: "Add to Card", desc: "Place it on your business card design" },
      ]}
      useCases={[
        "Networking events",
        "Sales teams",
        "Freelancers and consultants",
        "Real estate agents",
        "Job seekers",
      ]}
      relatedPages={[
        { title: "QR Code for vCard", href: "/qr-code-for-vcard" },
        { title: "QR Code for LinkedIn", href: "/qr-code-for-linkedin" },
        { title: "QR Code Generator", href: "/qr-code-generator" },
        { title: "QR Code for Email", href: "/qr-code-for-email" },
        { title: "QR Code for Phone Number", href: "/qr-code-for-phone" },
        { title: "Free QR Code Generator", href: "/free-qr-code-generator" },
      ]}
      allQRCodes={allQRCodes}

      relatedArticles={relatedArticles}
    />
  )
}