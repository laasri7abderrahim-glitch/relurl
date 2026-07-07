import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"
import { allQRCodes, getRelatedQrPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "QR Code for Fundraiser - Donation & Charity QR Codes",
    description: "Create QR codes for fundraiser donation pages and charity events. Maximize donations with easy-to-scan QR codes from RELURL.",
    path: "/qr-code-for-fundraiser",
    keywords: ["qr code for fundraiser", "donation qr code", "charity qr code", "donation page qr code"],
    locale,
  })
}

export default function Page() {
  const href = "/qr-code-for-fundraiser"
  const relatedArticles = getPostsByLandingPage(href).slice(0, 3)
  return (
    <QRCodeLandingPage
      title="QR Code for Fundraiser"
      subtitle="Maximize Donations"
      description="Create QR codes for fundraiser donation pages and charity events. Make it effortless for supporters to donate with a quick scan."
      placeholder="https://charity.org/donate/annual-fundraiser"
      defaultValue="https://charity.org/donate/annual-fundraiser"
      inputLabel="Enter your donation page URL"
      generateLabel="Create Fundraiser QR Code"
      features={["Donation Page Links", "Event Registration", "Sponsor Tracking", "Social Sharing", "Recurring Donation", "Progress Tracker"]}
      howItWorks={[
        { step: "Enter Donation URL", desc: "Paste your donation page or fundraiser event link." },
        { step: "Generate QR Code", desc: "Create a code that links directly to your donation form." },
        { step: "Display at Event", desc: "Place at entrance, tables, and promotional displays." },
      ]}
      useCases={[
        "Charity gala donations",
        "School fundraiser campaigns",
        "Community event giving",
        "Online fundraiser promotion",
        "Sponsor recognition displays",
        "Crowdfunding campaign promotion",
      ]}
      relatedPages={getRelatedQrPages(href)}
      allQRCodes={allQRCodes}

      relatedArticles={relatedArticles}
    />
  )
}