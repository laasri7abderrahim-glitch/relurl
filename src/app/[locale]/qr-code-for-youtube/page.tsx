import { allQRCodes, getRelatedQrPages } from "@/lib/url-pages"
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
  const href = "/qr-code-for-youtube"
  const relatedArticles = getPostsByLandingPage(href).slice(0, 3)
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
      relatedPages={getRelatedQrPages(href)}
      allQRCodes={allQRCodes}

      relatedArticles={relatedArticles}
    />
    </>
  )
}