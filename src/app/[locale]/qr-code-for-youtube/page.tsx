import { allQRCodes } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"
import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "QR Code for YouTube - Share Videos Easily",
    description: "Create a QR code for your YouTube videos or channel. Viewers scan and watch instantly — perfect for promotion.",
    path: "/qr-code-for-youtube",
    keywords: ["qr code for youtube", "youtube qr code", "youtube channel qr", "youtube video qr code"],
    locale,
  })
}

export default function QRCodeForYouTubePage() {
  const relatedArticles = getPostsByLandingPage("/qr-code-for-youtube").slice(0, 3)
  return (
    <>
      <QRCodeLandingPage
      title="QR Code for YouTube"
      subtitle="Share Videos Easily"
      description="Create a QR code for your YouTube videos or channel. Viewers scan and watch instantly — perfect for promotion."
      placeholder="https://youtube.com/@yourchannel"
      inputLabel="Enter your YouTube video or channel URL"
      generateLabel="Create YouTube QR Code"
      features={["Instant Video Access", "Grow Subscribers", "Works on All Devices", "Print Ready", "Playlist Sharing", "Channel Trailer Link"]}
      howItWorks={[
        { step: "Enter Video URL", desc: "Paste your YouTube video or channel link" },
        { step: "Generate QR Code", desc: "Create a scannable code" },
        { step: "Share Everywhere", desc: "Add to posters, packaging, or business cards" },
      ]}
      useCases={["Video promotion", "Product demonstrations", "Event entertainment", "Educational content", "Music releases", "Tutorial and how-to video sharing"]}
      relatedPages={[
        { title: "QR Code for Instagram", href: "/qr-code-for-instagram" },
        { title: "QR Code for Facebook", href: "/qr-code-for-facebook" },
        { title: "QR Code for LinkedIn", href: "/qr-code-for-linkedin" },
        { title: "QR Code Generator", href: "/qr-code-generator" },
        { title: "QR Code for App Download", href: "/qr-code-for-app-download" },
        { title: "Free QR Code Generator", href: "/free-qr-code-generator" },
      ]}
      allQRCodes={allQRCodes}

      relatedArticles={relatedArticles}
    />
    </>
  )
}