import { allQRCodes, getRelatedQrPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"
import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "QR Code for Facebook - Connect on Facebook",
    description: "Generate a QR code for your Facebook page or group. Help people find and follow your business on Facebook.",
    path: "/qr-code-for-facebook",
    keywords: ["qr code for facebook", "facebook qr code", "facebook page qr", "facebook page qr code"],
    locale,
  })
}

export default function QRCodeForFacebookPage() {
  const href = "/qr-code-for-facebook"
  const relatedArticles = getPostsByLandingPage(href).slice(0, 3)
  return (
    <>
      <QRCodeLandingPage
      title="QR Code for Facebook"
      subtitle="Connect on Facebook"
      description="Generate a QR code for your Facebook page or group. Help people find and follow your business on Facebook."
      placeholder="https://facebook.com/yourpage"
      inputLabel="Enter your Facebook page or group URL"
      generateLabel="Create Facebook QR Code"
      features={["Grow Page Likes", "Event Promotion", "Community Building", "Easy Sharing", "Facebook Group Links", "Event RSVP"]}
      howItWorks={[
        { step: "Enter Page URL", desc: "Paste your Facebook page or group link" },
        { step: "Generate QR Code", desc: "Create a scannable code" },
        { step: "Promote Everywhere", desc: "Add to print ads, displays, or packaging" },
      ]}
      useCases={["Business page growth", "Event promotion", "Community building", "Product launches", "Store displays", "Facebook fundraiser promotion"]}
      relatedPages={getRelatedQrPages(href)}
      allQRCodes={allQRCodes}

      relatedArticles={relatedArticles}
    />
    </>
  )
}