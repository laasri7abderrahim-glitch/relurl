import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Gaming Link Shortener - Stream & Game Links",
    description: "Shorten Twitch, Steam, and game download links. Track player engagement and share gaming content with clean URLs via RELURL.",
    path: "/gaming-link-shortener",
    keywords: ["gaming link shortener", "stream link generator", "twitch link shortener"],
    locale,
  })
}

export default function GamingLinkShortenerPage() {
  const href = "/gaming-link-shortener"
  const relatedArticles = getPostsByLandingPage("/gaming-link-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="Gaming Link Shortener"
      subtitle="Level Up Your Links"
      description="Shorten Twitch, Steam, and game download links. Track player engagement and share gaming content with clean, memorable URLs."
      placeholder="https://store.steampowered.com/app/your-game"
      inputLabel="Enter your gaming URL"
      generateLabel="Shorten URL"
      features={[
        "Stream Link Tracking",
        "Game Download Links",
        "Tournament Registration",
        "Clan & Team Invites",
        "Mod & Skin Sharing",
        "Cross-Platform Analytics",
      ]}
      howItWorks={[
        { step: "Paste Gaming URL", desc: "Enter your stream, game, or community page link." },
        { step: "Generate Short Link", desc: "Create a clean URL for your gaming audience." },
        { step: "Share & Track Players", desc: "Post on Discord, Reddit, and social media to grow your community." },
      ]}
      useCases={[
        "Twitch stream announcements",
        "Game release promotions",
        "Tournament registration",
        "Clan recruitment",
        "Mod and skin sharing",
        "Esports event marketing",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}

      relatedArticles={relatedArticles}
    />
  )
}