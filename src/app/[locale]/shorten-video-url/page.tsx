import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Shorten Video URL - Free Video Link Shortener",
    description: "Shorten video URLs for fuss-free sharing across social media, messaging, and email. Make your video links sleek, trackable, and professional.",
    path: "/shorten-video-url",
    keywords: ["shorten video url", "video url shortener", "short video link", "video link shortener"],
    locale,
  })
}

export default function ShortenVideoURLPage() {
  const href = "/shorten-video-url"
  const relatedArticles = getPostsByLandingPage("/custom-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="Shorten Video URL"
      subtitle="Better Video Sharing"
       description="Shorten video file URLs for smoother sharing across social media, email, and messaging apps. Clean links make your video content more accessible and trackable."
      placeholder="https://example.com/videos/promotional-video.mp4"
      generateLabel="Shorten Video URL"
      features={[
        "Video URL Compression",
        "All Format Support",
        "Custom Branded Slugs",
        "Click Analytics",
        "Direct Playback Ready",
        "QR Code Generation",
      ]}
      howItWorks={[
        { step: "Paste Video URL", desc: "Copy the direct URL of the video file you want to share." },
        { step: "Shorten Instantly", desc: "Generate a clean short link for your video content." },
        { step: "Share Your Video", desc: "Distribute the short link via email, social media, or messaging." },
      ]}
      useCases={[
        "Share promotional videos in email campaigns",
        "Send video files via messaging apps",
        "Include video links in social media posts",
        "Distribute training videos to teams",
        "Track views on shared video content",
        "Create QR codes for video access",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "Can I shorten any video URL?", a: "Yes, any direct video file URL can be shortened including MP4, WebM, MOV, AVI, and other common formats. The short link redirects to the original video file." },
        { q: "Will the short link work for streaming video?", a: "The short link redirects to your original video URL. For direct video files, the browser or device will handle playback normally after the redirect." },
        { q: "Can I track how many times my video was accessed?", a: "Yes, click analytics show how many times your shortened video link was accessed. This helps you measure engagement with your video content across different distribution channels." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
