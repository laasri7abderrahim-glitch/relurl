import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Shorten Google Drive Link - Google Drive URL Shortener",
    description: "Shorten Google Drive file and folder links for cleaner sharing. Make your Drive links compact, trackable, and easy to share via email and messaging.",
    path: "/shorten-google-drive-link",
    keywords: ["shorten google drive link", "google drive url shortener", "short google drive link", "drive link shortener"],
    locale,
  })
}

export default function ShortenGoogleDriveLinkPage() {
  const href = "/shorten-google-drive-link"
  const relatedArticles = getPostsByLandingPage("/custom-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="Shorten Google Drive Link"
      subtitle="Streamline File Sharing"
      description="Shorten Google Drive file and folder URLs for cleaner sharing via email, messaging apps, and social media. Make your Drive links organized and trackable."
      placeholder="https://drive.google.com/file/d/example/view"
      generateLabel="Shorten Drive Link"
      features={[
        "Drive Link Compression",
        "File & Folder Support",
        "Custom Aliases",
        "Click Analytics",
        "Accessible Anywhere",
        "QR Code Ready",
      ]}
      howItWorks={[
        { step: "Paste Drive Link", desc: "Copy the Google Drive file or folder share link." },
        { step: "Shorten Instantly", desc: "Generate a clean short link for your Drive content." },
        { step: "Share with Anyone", desc: "Send the short link via email, chat, or social media." },
      ]}
      useCases={[
        "Share Google Drive files in professional emails",
        "Send document links via WhatsApp and messaging apps",
        "Include Drive folder links in project documentation",
        "Share large files without ugly long URLs",
        "Track clicks on shared Drive resources",
        "Create QR codes for Drive file access",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "Can I shorten Google Drive folder links?", a: "Yes, both individual file links and folder links from Google Drive can be shortened. The short link redirects to whatever Drive URL you provide." },
        { q: "Will the short link work with Drive sharing permissions?", a: "The short link redirects to your original Drive URL. Recipients still need the appropriate sharing permissions (view, comment, or edit) to access the file." },
        { q: "Can I update the Drive file destination later?", a: "Yes, with RELURL you can change the destination URL of any short link anytime. If you need to point to an updated file, simply edit the target URL in your dashboard." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
