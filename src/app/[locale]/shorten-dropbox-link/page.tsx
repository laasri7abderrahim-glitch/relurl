import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Shorten Dropbox Link - Dropbox URL Shortener",
    description: "Shorten Dropbox file and folder links for cleaner sharing. Make your Dropbox links compact, trackable, and easier to distribute via email and chat.",
    path: "/shorten-dropbox-link",
    keywords: ["shorten dropbox link", "dropbox url shortener", "short dropbox link", "dropbox link shortener"],
    locale,
  })
}

export default function ShortenDropboxLinkPage() {
  const href = "/shorten-dropbox-link"
  const relatedArticles = getPostsByLandingPage("/custom-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="Shorten Dropbox Link"
      subtitle="Simplify File Distribution"
      description="Shorten Dropbox file and folder share links for cleaner distribution. Professional short links make your Dropbox files easier to access and track."
      placeholder="https://www.dropbox.com/s/example/file.pdf"
      generateLabel="Shorten Dropbox Link"
      features={[
        "Dropbox URL Compression",
        "File & Folder Support",
        "Custom Aliases",
        "Click Analytics",
        "Permission Compatible",
        "QR Code Ready",
      ]}
      howItWorks={[
        { step: "Paste Dropbox Link", desc: "Copy the Dropbox file or folder share link." },
        { step: "Shorten Instantly", desc: "Generate a clean short link for your Dropbox content." },
        { step: "Share with Anyone", desc: "Distribute your short link via email, chat, or anywhere." },
      ]}
      useCases={[
        "Share Dropbox files in professional emails",
        "Send large file links via messaging apps",
        "Include folder links in project documentation",
        "Distribute assets to clients and partners",
        "Track clicks on shared Dropbox resources",
        "Create QR codes for quick file access",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "Can I shorten Dropbox folder links?", a: "Yes, both file and folder share links from Dropbox can be shortened. The short link redirects recipients to your original Dropbox URL." },
        { q: "Do short links work with Dropbox password protection?", a: "The short link redirects to your original Dropbox URL. If your Dropbox link has password protection or expiration settings, those still apply after the redirect." },
        { q: "Can I track how many times my Dropbox link was accessed?", a: "Yes, every shortened link includes click analytics. See exactly how many people clicked your Dropbox link and where they accessed it from." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
