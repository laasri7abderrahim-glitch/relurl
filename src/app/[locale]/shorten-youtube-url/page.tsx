import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Shorten YouTube URL - Free YouTube Link Shortener",
    description: "Shorten YouTube video URLs to share on social media, comments, and messages. Make your YouTube links clean, trackable, and easy to share with RELURL.",
    path: "/shorten-youtube-url",
    keywords: ["shorten youtube url", "youtube link shortener", "youtube url shortener", "short youtube link"],
    locale,
  })
}

export default function ShortenYouTubeURLPage() {
  const href = "/shorten-youtube-url"
  const relatedArticles = getPostsByLandingPage("/youtube-link-generator").slice(0, 3)
  return (
    <URLLandingPage
      title="Shorten YouTube URL"
      subtitle="Optimize Your Video Links"
      description="Shorten YouTube video URLs to make them clean and shareable. Perfect for social media posts, video descriptions, comments, and messaging apps where long YouTube URLs look cluttered."
      placeholder="https://www.youtube.com/watch?v=example"
      generateLabel="Shorten YouTube URL"
      features={[
        "YouTube URL Compression",
        "Custom Slug Support",
        "Click Analytics",
        "Share in Descriptions",
        "Social Media Ready",
        "QR Code Generation",
      ]}
      howItWorks={[
        { step: "Paste YouTube Link", desc: "Copy and paste the YouTube video URL you want to shorten." },
        { step: "Customize Your Slug", desc: "Optionally add a custom slug to make your link memorable." },
        { step: "Share Your Short Link", desc: "Copy the shortened URL and share it anywhere you promote your video." },
      ]}
      useCases={[
        "Share YouTube videos in Twitter/X posts with character limits",
        "Add clean links to YouTube video descriptions",
        "Track clicks on YouTube links shared in email newsletters",
        "Create QR codes for YouTube video promotions",
        "Share videos in WhatsApp and messaging apps",
        "Include short links in Instagram Stories and bio",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "Why should I shorten YouTube URLs?", a: "YouTube URLs are long and contain tracking parameters that make them ugly to share. Shortened YouTube links are cleaner, save character space, and can be tracked to see how many people click them from different platforms." },
        { q: "Will the short link work on all devices?", a: "Yes, shortened YouTube URLs redirect to the original video on any device. They work on desktop, mobile, tablets, and smart TVs without any issues." },
        { q: "Can I track clicks on my shortened YouTube links?", a: "Absolutely. Every shortened URL on RELURL comes with click analytics showing total clicks, geographic data, referrers, and device types. This helps you understand which platforms drive the most traffic to your videos." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
