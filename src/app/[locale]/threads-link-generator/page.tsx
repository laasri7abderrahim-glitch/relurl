import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Threads Link Generator - Threads Post Links",
    description: "Create concise links for Threads conversations and profiles. Boost social engagement on Threads and track audience growth with RELURL.",
    path: "/threads-link-generator",
    keywords: ["threads link generator", "threads post links", "threads marketing"],
    locale,
  })
}

export default function ThreadsLinkGeneratorPage() {
  const href = "/threads-link-generator"
  const relatedArticles = getPostsByLandingPage("/threads-link-generator").slice(0, 3)
  return (
    <URLLandingPage
      title="Threads Link Generator"
      subtitle="Thrive on Threads"
       description="Create concise links for Threads conversations and profiles. Boost your Threads presence and track conversation-driven engagement."
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

      relatedArticles={relatedArticles}
    />
  )
}