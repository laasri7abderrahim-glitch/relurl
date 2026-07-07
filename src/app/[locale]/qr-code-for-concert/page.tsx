import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"
import { allQRCodes } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "QR Code for Concert - Concert & Music Event QR Codes",
    description: "Create QR codes for concert tickets, setlists, and venue info. Enhance the concert experience with scannable QR codes from RELURL.",
    path: "/qr-code-for-concert",
    keywords: ["qr code for concert", "concert ticket qr code", "music event qr code", "live music qr code"],
    locale,
  })
}

export default function Page() {
  const relatedArticles = getPostsByLandingPage("/qr-code-for-concert").slice(0, 3)
  return (
    <QRCodeLandingPage
      title="QR Code for Concert"
      subtitle="Amplify the Experience"
      description="Create QR codes for concert tickets, setlists, and venue info. Enhance the live music experience with instant access via QR codes."
      placeholder="https://your-venue.com/concerts/summer-show"
      defaultValue="https://your-venue.com/concerts/summer-show"
      inputLabel="Enter your concert event URL"
      generateLabel="Create Concert QR Code"
      features={["Ticket Verification", "Setlist Sharing", "Venue Maps", "Merch Store Links", "VIP Access Passes", "Pre-Save Music Links"]}
      howItWorks={[
        { step: "Enter Concert URL", desc: "Paste your ticket page, event info, or setlist link." },
        { step: "Generate QR Code", desc: "Create a scannable code for your concert event." },
        { step: "Display at Venue", desc: "Place at entrance, merchandise booths, and promotional areas." },
      ]}
      useCases={[
        "Ticket scanning at entry",
        "Setlist and song info sharing",
        "Merchandise store links",
        "Venue map and directions",
        "Post-show photo sharing",
        "Fan club membership signup",
      ]}
      relatedPages={[
        { title: "QR Code Generator", href: "/qr-code-generator" },
        { title: "QR Code for Event", href: "/qr-code-for-event" },
        { title: "QR Code for Google Maps", href: "/qr-code-for-google-maps" },
        { title: "QR Code for WiFi", href: "/qr-code-for-wifi" },
        { title: "QR Code for App Download", href: "/qr-code-for-app-download" },
        { title: "QR Code for Instagram", href: "/qr-code-for-instagram" },
      ]}
      allQRCodes={allQRCodes}

      relatedArticles={relatedArticles}
    />
  )
}