import type { Metadata } from "next"
import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "Mastodon Link Generator - Fediverse Post Links",
  description: "Generate short links for Mastodon posts and profiles. Track engagement across the fediverse with RELURL's link shortener.",
  path: "/mastodon-link-generator",
  keywords: ["mastodon link generator", "fediverse links", "mastodon marketing"],
})

export default function MastodonLinkGeneratorPage() {
  const href = "/mastodon-link-generator"
  return (
    <URLLandingPage
      title="Mastodon Link Generator"
      subtitle="Engage the Fediverse"
      description="Generate short links for Mastodon posts and profiles. Track engagement across the fediverse and grow your decentralized audience."
      placeholder="https://mastodon.social/@your-account"
      inputLabel="Enter your destination URL"
      generateLabel="Generate Link"
      features={[
        "Post Click Tracking",
        "Profile Link Analytics",
        "Cross-Instance Support",
        "Federated Engagement Data",
        "Content Warning Links",
        "Boost Attribution",
      ]}
      howItWorks={[
        { step: "Paste Your URL", desc: "Enter the page you want to share on Mastodon." },
        { step: "Generate Short Link", desc: "Create a clean URL for your fediverse post." },
        { step: "Toot & Track", desc: "Post on Mastodon and track engagement across instances." },
      ]}
      useCases={[
        "Mastodon post promotion",
        "Profile bio optimization",
        "Open source project sharing",
        "Community engagement tracking",
        "Cross-instance content sharing",
        "Fediverse marketing campaigns",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
    />
  )
}
