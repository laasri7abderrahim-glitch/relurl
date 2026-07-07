import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"
import { allQRCodes } from "@/lib/url-pages"
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
  const relatedArticles = getPostsByLandingPage("/qr-code-for-birthday").slice(0, 3)
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
      relatedPages={[
        { title: "QR Code Generator", href: "/qr-code-generator" },
        { title: "QR Code for Event", href: "/qr-code-for-event" },
        { title: "QR Code for Wedding", href: "/qr-code-for-wedding" },
        { title: "QR Code for Photo Sharing", href: "/qr-code-for-instagram" },
        { title: "QR Code for WiFi", href: "/qr-code-for-wifi" },
        { title: "QR Code for Google Maps", href: "/qr-code-for-google-maps" },
      ]}
      allQRCodes={allQRCodes}

      relatedArticles={relatedArticles}
    />
  )
}