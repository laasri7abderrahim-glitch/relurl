import type { Metadata } from "next"
import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "Reddit Link Generator - Post & Comment Links",
  description: "Generate short, trackable links for Reddit posts and comments. Drive traffic from Reddit and track engagement with RELURL.",
  path: "/reddit-link-generator",
  keywords: ["reddit link generator", "reddit post links", "reddit marketing"],
})

export default function RedditLinkGeneratorPage() {
  const href = "/reddit-link-generator"
  return (
    <URLLandingPage
      title="Reddit Link Generator"
      subtitle="Win on Reddit"
      description="Generate short, trackable links for Reddit posts and comments. Drive traffic from Reddit communities and track engagement."
      placeholder="https://your-site.com/relevant-content-page"
      inputLabel="Enter your destination URL"
      generateLabel="Generate Link"
      features={[
        "Post Link Tracking",
        "Comment Click Analytics",
        "Subreddit Attribution",
        "Non-Spammy Shortening",
        "AMA Link Support",
        "Organic Traffic Insights",
      ]}
      howItWorks={[
        { step: "Paste Your URL", desc: "Enter the content you want to share on Reddit." },
        { step: "Generate Short Link", desc: "Create a clean, non-spammy URL for your post." },
        { step: "Share on Reddit", desc: "Post in relevant subreddits and track community engagement." },
      ]}
      useCases={[
        "Content marketing on Reddit",
        "AMA session links",
        "Product feedback campaigns",
        "Community engagement tracking",
        "Blog post promotion",
        "Resource sharing in subreddits",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
    />
  )
}
