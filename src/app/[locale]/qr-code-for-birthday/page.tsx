import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"
import { allQRCodes, getRelatedQrPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "QR Code for Birthday - Birthday Party & Gift QR Codes",
    description: "Create QR codes for birthday party details, gift registries, and photo sharing. Make celebrations memorable with RELURL QR codes.",
    path: "/qr-code-for-birthday",
    keywords: ["qr code for birthday", "birthday party qr code", "birthday gift qr code", "birthday invitation qr code"],
    locale,
  })
}

export default function Page() {
  const href = "/qr-code-for-birthday"
  const relatedArticles = getPostsByLandingPage(href).slice(0, 3)
  return (
    <QRCodeLandingPage
      title="QR Code for Birthday"
      subtitle="Celebrate with Scans"
      description="Create QR codes for birthday party details, gift registries, and photo sharing. Make your celebration easy to navigate for all guests."
      placeholder="https://your-birthday-party.com/details"
      defaultValue="https://your-birthday-party.com/details"
      inputLabel="Enter your birthday page URL"
      generateLabel="Create Birthday QR Code"
      features={["Party Details", "Gift Registry", "Photo Album", "RSVP Tracking", "Party Playlist", "Thank You Messages"]}
      howItWorks={[
        { step: "Enter Party URL", desc: "Paste your birthday party page, registry, or photo link." },
        { step: "Generate QR Code", desc: "Create a festive QR code for your celebration." },
        { step: "Share with Guests", desc: "Include on invitations, cards, and party displays." },
      ]}
      useCases={[
        "Birthday party invitations",
        "Gift registry sharing",
        "Photo booth and album access",
        "Milestone birthday celebrations",
        "Children's party activities",
        "Virtual birthday celebrations",
      ]}
      relatedPages={getRelatedQrPages(href)}
      allQRCodes={allQRCodes}

      relatedArticles={relatedArticles}
    />
  )
}