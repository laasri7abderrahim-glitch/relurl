import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Shorten X URL - Free X/Twitter Link Shortener",
    description: "Shorten URLs for X (formerly Twitter) to save character count and track engagement. Make your tweets cleaner and more effective with short links.",
    path: "/shorten-x-url",
    keywords: ["shorten x url", "shorten twitter url", "x link shortener", "twitter url shortener"],
    locale,
  })
}

export default function ShortenXURLPage() {
  const href = "/shorten-x-url"
  const relatedArticles = getPostsByLandingPage("/twitter-link-generator").slice(0, 3)
  return (
    <URLLandingPage
      title="Shorten X URL"
      subtitle="Optimize Your Tweets"
      description="Shorten URLs for X (Twitter) to save precious character count and track link engagement. Clean short links make your tweets more effective and measurable."
      placeholder="https://example.com/blog-post-to-share-on-x"
      generateLabel="Shorten X URL"
      features={[
        "Character Count Savings",
        "Twitter/X Optimized",
        "Engagement Analytics",
        "Custom Branded Links",
        "Campaign Tracking",
        "QR Code Ready",
      ]}
      howItWorks={[
        { step: "Paste Your URL", desc: "Copy the long URL you want to share in your tweet." },
        { step: "Shorten Instantly", desc: "Generate a compact short link that saves character space." },
        { step: "Tweet and Track", desc: "Paste the short link into your tweet and monitor clicks from your dashboard." },
      ]}
      useCases={[
        "Save character count in tweets with links",
        "Track click-through rates on shared articles",
        "Create branded links for X profile bio",
        "Measure engagement on promotional tweets",
        "Shorten links before sharing in X DMs",
        "Compare performance of different tweet campaigns",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "Why shorten URLs on X/Twitter?", a: "X limits posts to 280 characters. Long URLs consume a huge portion of this limit. Shortened URLs free up more characters for your message while making tweets look cleaner and more professional." },
        { q: "Do short links show link previews on X?", a: "Yes, X generates link preview cards for shortened URLs just like full URLs. Your preview image, title, and description will display normally when the link is included in a tweet." },
        { q: "Can I track how many clicks my tweet links get?", a: "X provides basic link analytics for ads, but not for organic tweets. RELURL fills this gap by showing click data for every shortened link, revealing which tweets drive the most traffic." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
