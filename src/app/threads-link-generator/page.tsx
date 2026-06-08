import type { Metadata } from "next"
import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "Threads Link Generator - Threads Post Links",
  description: "Generate short, trackable links for Threads posts and profiles. Boost your Threads marketing and track engagement with RELURL.",
  path: "/threads-link-generator",
  keywords: ["threads link generator", "threads post links", "threads marketing"],
})

export default function ThreadsLinkGeneratorPage() {
  const href = "/threads-link-generator"
  return (
    <URLLandingPage
      title="Threads Link Generator"
      subtitle="Thrive on Threads"
      description="Generate short, trackable links for Threads posts and profiles. Boost your Threads marketing and track audience engagement."
      placeholder="https://your-site.com/threads-content"
      inputLabel="Enter your destination URL"
      generateLabel="Generate Link"
      features={[
        "Post Link Tracking",
        "Profile Bio Links",
        "Engagement Analytics",
        "Character-Optimized URLs",
        "Cross-Platform Integration",
        "Audience Source Insights",
      ]}
      howItWorks={[
        { step: "Paste Your URL", desc: "Enter the page you want to share on Threads." },
        { step: "Create Short Link", desc: "Generate a clean URL optimized for Threads posts." },
        { step: "Post & Track", desc: "Share in threads and monitor audience engagement." },
      ]}
      useCases={[
        "Threads post promotions",
        "Profile bio link optimization",
        "Brand content sharing",
        "Community engagement tracking",
        "Cross-posting from Instagram",
        "Influencer collaboration links",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
    />
  )
}
