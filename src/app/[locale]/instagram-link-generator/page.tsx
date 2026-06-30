import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"
import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Instagram Link Generator - Bio & Profile Links",
    description: "Generate short, trackable Instagram links for your bio, stories, and posts. Create custom URLs and track clicks to optimize your Instagram strategy.",
    path: "/instagram-link-generator",
    keywords: ["instagram link generator", "instagram bio link", "instagram profile link"],
    locale,
  })
}

export default function InstagramLinkGeneratorPage() {
  const href = "/instagram-link-generator"
  const relatedArticles = getPostsByLandingPage("/instagram-link-generator").slice(0, 3)
  return (
    <URLLandingPage
      title="Instagram Link Generator"
      subtitle="Grow Your Instagram Audience"
      description="Create short, branded links for your Instagram bio, stories, and posts. Track clicks and optimize your Instagram marketing strategy."
      placeholder="https://example.com/your-landing-page"
      inputLabel="Enter your destination URL"
      generateLabel="Generate Link"
      features={[
        "Bio Link Optimization",
        "Story Link Tracking",
        "Click Analytics",
        "Custom Aliases",
        "Mobile-Optimized",
        "QR Code Generation",
      ]}
      howItWorks={[
        { step: "Paste Your URL", desc: "Enter the page you want to link from your Instagram." },
        { step: "Customize Slug", desc: "Choose a memorable alias for your Instagram link." },
        { step: "Add to Bio", desc: "Paste your short link into your Instagram bio or stories." },
      ]}
      useCases={[
        "Instagram bio link optimization",
        "Story swipe-up links",
        "Product page links",
        "Blog post promotion",
        "Event registration links",
        "Newsletter signup links",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}

      relatedArticles={relatedArticles}
    />
  )
}