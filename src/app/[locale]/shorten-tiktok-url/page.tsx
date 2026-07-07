import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Shorten TikTok URL - TikTok Link Shortener",
    description: "Shorten TikTok video and profile URLs to share across platforms. Make your TikTok links clean and trackable for better cross-platform promotion.",
    path: "/shorten-tiktok-url",
    keywords: ["shorten tiktok url", "tiktok link shortener", "tiktok url shortener", "short tiktok link"],
    locale,
  })
}

export default function ShortenTikTokURLPage() {
  const href = "/shorten-tiktok-url"
  const relatedArticles = getPostsByLandingPage("/tiktok-bio-link-generator").slice(0, 3)
  return (
    <URLLandingPage
      title="Shorten TikTok URL"
      subtitle="Supercharge Your TikTok Links"
      description="Shorten TikTok video URLs and profile links for sharing on other platforms. Clean, trackable short links help you measure how your TikTok content drives traffic."
      placeholder="https://www.tiktok.com/@username/video/example"
      generateLabel="Shorten TikTok URL"
      features={[
        "TikTok URL Compression",
        "Bio Link Ready",
        "Cross-Platform Tracking",
        "Custom Slugs",
        "Video Link Analytics",
        "QR Code Generation",
      ]}
      howItWorks={[
        { step: "Paste TikTok URL", desc: "Copy the TikTok video or profile URL you want to shorten." },
        { step: "Shorten Instantly", desc: "Generate a clean, compact short link for your TikTok content." },
        { step: "Share Everywhere", desc: "Use the short link in your bio, other social platforms, or marketing materials." },
      ]}
      useCases={[
        "Share TikTok videos on Instagram and Twitter",
        "Create trackable links for TikTok bio",
        "Promote TikTok content in email newsletters",
        "Add TikTok video links to blog posts",
        "Track cross-platform traffic from TikTok",
        "Generate QR codes for TikTok profile promotion",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "Can I shorten TikTok video URLs?", a: "Yes, copy any TikTok video URL and shorten it with RELURL. The short link redirects viewers directly to your TikTok video on any device." },
        { q: "Will short links work in TikTok bio?", a: "Yes, shortened URLs work perfectly in TikTok bios. They save valuable character space and look cleaner than long TikTok URLs with tracking parameters." },
        { q: "Can I track clicks from TikTok to my website?", a: "Absolutely. Create a short link to your website, share it in your TikTok bio or videos, and track exactly how many clicks come from your TikTok audience." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
