import { allQRCodes } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"
import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "QR Code for App Download - Boost Installs",
    description: "Generate a QR code for your mobile app. Users scan and are directed to the right app store for their device.",
    path: "/qr-code-for-app-download",
    keywords: ["qr code for app download", "app qr code", "app store qr code", "app download qr code"],
    locale,
  })
}

export default function QRCodeForAppDownloadPage() {
  const relatedArticles = getPostsByLandingPage("/qr-code-for-app-download").slice(0, 3)
  return (
    <>
      <QRCodeLandingPage
      title="QR Code for App Download"
      subtitle="Boost Installs"
      description="Generate a QR code for your mobile app. Users scan and are directed to the right app store for their device."
      placeholder="https://play.google.com/store/apps/details?id=com.yourapp"
      inputLabel="Enter your app store URL"
      generateLabel="Create App Download QR Code"
      features={["Auto Device Detection", "Boost Installs", "Cross-Platform", "Print Ready", "Smart Redirect", "Analytics Tracking"]}
      howItWorks={[
        { step: "Enter App Store URL", desc: "Link to Google Play or App Store" },
        { step: "Generate QR Code", desc: "Create a code for app promotion" },
        { step: "Promote Your App", desc: "Add to packaging, displays, or ads" },
      ]}
      useCases={["App launches", "Product packaging", "Store displays", "Event promotion", "Print advertising", "User acquisition campaigns"]}
      relatedPages={[
        { title: "QR Code for YouTube", href: "/qr-code-for-youtube" },
        { title: "QR Code for Instagram", href: "/qr-code-for-instagram" },
        { title: "QR Code for Dynamic QR Code", href: "/dynamic-qr-code-generator" },
        { title: "QR Code Generator", href: "/qr-code-generator" },
        { title: "QR Code for Facebook", href: "/qr-code-for-facebook" },
        { title: "Free QR Code Generator", href: "/free-qr-code-generator" },
      ]}
      allQRCodes={allQRCodes}

      relatedArticles={relatedArticles}
    />
    </>
  )
}