import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"
import { allQRCodes } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "QR Code for Wedding - Wedding Event & Registry QR Codes",
    description: "Create QR codes for wedding registries, event details, and RSVP pages. Make your wedding planning easy with RELURL's QR code generator.",
    path: "/qr-code-for-wedding",
    keywords: ["qr code for wedding", "wedding registry qr code", "wedding event qr code", "wedding website qr code"],
    locale,
  })
}

export default function Page() {
  const relatedArticles = getPostsByLandingPage("/qr-code-for-wedding").slice(0, 3)
  return (
    <QRCodeLandingPage
      title="QR Code for Wedding"
      subtitle="Simplify Wedding Planning"
      description="Create QR codes for wedding registries, event details, and RSVP pages. Help guests access all wedding information with a quick scan."
      placeholder="https://your-wedding.com/details"
      defaultValue="https://your-wedding.com/details"
      inputLabel="Enter your wedding page URL"
      generateLabel="Create Wedding QR Code"
      features={["Registry Links", "RSVP Integration", "Photo Sharing", "Venue Directions", "Hotel Block Info", "Wedding Hashtag"]}
      howItWorks={[
        { step: "Enter Wedding URL", desc: "Paste your wedding website, registry, or RSVP page link." },
        { step: "Generate QR Code", desc: "Create an elegant QR code matching your wedding theme." },
        { step: "Share with Guests", desc: "Print on invitations, table cards, and welcome signs." },
      ]}
      useCases={[
        "Wedding invitation inserts",
        "Table centerpiece displays",
        "Registry sharing",
        "Photo booth access",
        "Guestbook and well-wishes",
        "Virtual wedding live stream",
      ]}
      relatedPages={[
        { title: "QR Code Generator", href: "/qr-code-generator" },
        { title: "QR Code for Event", href: "/qr-code-for-event" },
        { title: "QR Code for WiFi", href: "/qr-code-for-wifi" },
        { title: "QR Code for Google Maps", href: "/qr-code-for-google-maps" },
        { title: "QR Code for Email", href: "/qr-code-for-email" },
        { title: "QR Code for Photo", href: "/qr-code-for-instagram" },
      ]}
      allQRCodes={allQRCodes}

      relatedArticles={relatedArticles}
    />
  )
}