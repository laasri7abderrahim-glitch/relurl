import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Twitch Link Generator - Stream & Channel Links",
    description: "Generate short links for Twitch streams, channels, and clips. Track viewer engagement and grow your Twitch audience with RELURL.",
    path: "/twitch-link-generator",
    keywords: ["twitch link generator", "twitch stream links", "twitch marketing"],
    locale,
  })
}

export default function TwitchLinkGeneratorPage() {
  const href = "/twitch-link-generator"
  const relatedArticles = getPostsByLandingPage("/twitch-link-generator").slice(0, 3)
  return (
    <URLLandingPage
      title="Twitch Link Generator"
      subtitle="Grow Your Channel"
      description="Generate short links for Twitch streams, channels, and clips. Track viewer engagement and grow your Twitch audience from every platform."
      placeholder="https://twitch.tv/your-channel"
      inputLabel="Enter your Twitch URL"
      generateLabel="Generate Link"
      features={[
        "Stream Link Tracking",
        "Clip Share Analytics",
        "Channel Page Optimization",
        "Raid Link Support",
        "Merch Store Integration",
        "Follower Source Attribution",
      ]}
      howItWorks={[
        { step: "Paste Twitch URL", desc: "Enter your channel, stream, or clip link." },
        { step: "Generate Short Link", desc: "Create a clean URL for your Twitch content." },
        { step: "Share & Track", desc: "Post on social media and track viewer sources." },
      ]}
      useCases={[
        "Stream promotion on social media",
        "Clip sharing across platforms",
        "Channel raid links",
        "Merch store promotion",
        "Sponsor landing pages",
        "Community event links",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}

      relatedArticles={relatedArticles}
    />
  )
}