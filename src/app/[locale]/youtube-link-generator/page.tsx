import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"
import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "YouTube Link Generator - Video Share Links",
    description: "Generate short YouTube links with custom timestamps. Create trackable video URLs for marketing campaigns, emails, and social media sharing.",
    path: "/youtube-link-generator",
    keywords: ["youtube link generator", "youtube short link", "youtube video link"],
    locale,
  })
}

export default function YouTubeLinkGeneratorPage() {
  const href = "/youtube-link-generator"
  const relatedArticles = getPostsByLandingPage("/youtube-link-generator").slice(0, 3)
  return (
    <URLLandingPage
      title="YouTube Link Generator"
      subtitle="Share Videos Smarter"
      description="Create short, trackable YouTube links. Share videos with custom timestamps, channel links, and playlist URLs all from one dashboard."
      placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
      inputLabel="Enter your YouTube video or channel URL"
      generateLabel="Generate Link"
      features={[
        "Timestamp Links",
        "Channel URLs",
        "Playlist Links",
        "Custom Aliases",
        "Click Analytics",
        "QR Code for Videos",
      ]}
      howItWorks={[
        { step: "Paste YouTube URL", desc: "Enter your video, channel, or playlist URL." },
        { step: "Add Timestamps", desc: "Optionally set a start time for the video." },
        { step: "Share Short Link", desc: "Get a clean, trackable short URL." },
      ]}
      useCases={[
        "Video marketing campaigns",
        "Email newsletter video links",
        "Social media video sharing",
        "Blog embed links",
        "Course content links",
        "Product demo videos",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}

      relatedArticles={relatedArticles}
    />
  )
}