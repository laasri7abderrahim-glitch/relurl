import type { Metadata } from "next"
import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "Snapchat Link Generator - Snap & Story Links",
  description: "Generate short links for Snapchat stories, snaps, and spotlights. Track swipe-ups and boost engagement with RELURL.",
  path: "/snapchat-link-generator",
  keywords: ["snapchat link generator", "snapchat story links", "snapchat marketing"],
})

export default function SnapchatLinkGeneratorPage() {
  const href = "/snapchat-link-generator"
  return (
    <URLLandingPage
      title="Snapchat Link Generator"
      subtitle="Drive Snap Engagement"
      description="Generate short links for Snapchat stories, snaps, and spotlights. Track swipe-ups and boost your Snapchat marketing performance."
      placeholder="https://your-site.com/snap-exclusive-offer"
      inputLabel="Enter your destination URL"
      generateLabel="Generate Link"
      features={[
        "Swipe-Up Tracking",
        "Story Link Analytics",
        "Spotlight Optimization",
        "Custom Branded Links",
        "AR Lens Integration",
        "Snap Ad Attribution",
      ]}
      howItWorks={[
        { step: "Paste Your URL", desc: "Enter the page you want to link from Snapchat." },
        { step: "Create Short Link", desc: "Generate a clean URL for your snap or story." },
        { step: "Add to Snap", desc: "Use your short link in snaps, stories, and spotlights." },
      ]}
      useCases={[
        "Snapchat story promotions",
        "Influencer collaboration links",
        "Product launch snaps",
        "Event promotion via Snapchat",
        "AR lens campaign links",
        "Snap Ad landing pages",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
    />
  )
}
