import type { Metadata } from "next"
import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "Podcast Link Shortener - Episode & Show Links",
  description: "Create short, shareable links for podcast episodes, show notes, and subscription pages. Track listener engagement with RELURL.",
  path: "/podcast-link-shortener",
  keywords: ["podcast link shortener", "episode link generator", "podcast marketing"],
})

export default function PodcastLinkShortenerPage() {
  const href = "/podcast-link-shortener"
  return (
    <URLLandingPage
      title="Podcast Link Shortener"
      subtitle="Grow Your Podcast Audience"
      description="Create short, shareable links for episodes, show notes, and subscription pages. Track listener engagement across platforms."
      placeholder="https://podcasts.apple.com/your-show/episode/12345"
      inputLabel="Enter your episode URL"
      generateLabel="Shorten URL"
      features={[
        "Episode-Specific Tracking",
        "Multi-Platform Links",
        "Show Notes Shortening",
        "Listener Analytics",
        "Apple & Spotify Links",
        "Episode Number Aliases",
      ]}
      howItWorks={[
        { step: "Paste Episode URL", desc: "Enter your podcast episode or show notes link." },
        { step: "Create Short Link", desc: "Generate a clean, branded URL for easy sharing." },
        { step: "Share with Listeners", desc: "Post on social media, include in descriptions, and track plays." },
      ]}
      useCases={[
        "Episode promotion on social media",
        "Show notes link sharing",
        "Guest collaboration links",
        "Sponsor landing pages",
        "Newsletter episode roundups",
        "Cross-platform distribution",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
    />
  )
}
