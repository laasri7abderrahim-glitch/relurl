import { allQRCodes, getRelatedQrPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"
import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "QR Code for Instagram - Grow Your Following",
    description: "Create a QR code for your Instagram profile or posts. Help followers find you instantly and grow your audience.",
    path: "/qr-code-for-instagram",
    keywords: ["qr code for instagram", "instagram qr code", "instagram profile qr", "instagram profile qr code"],
    locale,
  })
}

export default function Page() {
  const href = "/qr-code-for-instagram"
  const relatedArticles = getPostsByLandingPage(href).slice(0, 3)
  return (
    <>
      <QRCodeLandingPage
      title="QR Code for Instagram"
      subtitle="Grow Your Following"
      description="Create a QR code for your Instagram profile or posts. Help followers find you instantly and grow your audience."
      placeholder="https://instagram.com/yourusername"
      inputLabel="Enter your Instagram profile URL"
      generateLabel="Create Instagram QR Code"
      features={["Grow Followers", "Share Posts Easily", "Works on All Devices", "Print Ready", "Link in Bio Alternative", "Story View Counter"]}
      howItWorks={[
        { step: "Enter Profile URL", desc: "Paste your Instagram profile or post link" },
        { step: "Generate QR Code", desc: "Create a scannable code" },
        { step: "Share Everywhere", desc: "Add to print materials, packaging, or displays" },
      ]}
      useCases={[
        "Influencers and creators",
        "Business profiles",
        "Event promotion",
        "Product packaging",
        "Store displays",
        "Contest and giveaway entries",
      ]}
      relatedPages={getRelatedQrPages(href)}
      allQRCodes={allQRCodes}

      relatedArticles={relatedArticles}
    />
    </>
  )
}