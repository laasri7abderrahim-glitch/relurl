import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Twitter/X Link Generator - Tweet & Thread Links",
    description: "Generate short, trackable links for Twitter/X tweets, threads, and profiles. Optimize your Twitter marketing with RELURL.",
    path: "/twitter-link-generator",
    keywords: ["twitter link generator", "x link generator", "tweet link shortener"],
    locale,
  })
}

export default function TwitterLinkGeneratorPage() {
  const href = "/twitter-link-generator"
  const relatedArticles = getPostsByLandingPage("/twitter-link-generator").slice(0, 3)
  return (
    <URLLandingPage
      title="Twitter/X Link Generator"
      subtitle="Optimize Your Tweets"
      description="Generate short, trackable links for Twitter/X tweets, threads, and profiles. Optimize your Twitter marketing and track engagement."
      placeholder="https://your-site.com/your-article-or-landing"
      inputLabel="Enter your destination URL"
      generateLabel="Generate Link"
      features={[
        "Tweet Click Tracking",
        "Thread Link Analytics",
        "Profile Bio Optimization",
        "Character-Saving Links",
        "Twitter Card Support",
        "Engagement Attribution",
      ]}
      howItWorks={[
        { step: "Paste Your URL", desc: "Enter the page you want to share on Twitter/X." },
        { step: "Generate Short Link", desc: "Create a character-efficient URL for your tweet." },
        { step: "Tweet & Track", desc: "Post in tweets and threads, then monitor engagement." },
      ]}
      useCases={[
        "Blog post promotion on Twitter",
        "Product launch tweets",
        "Thread engagement tracking",
        "Profile bio link optimization",
        "Twitter Ad landing pages",
        "Community engagement links",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}

      relatedArticles={relatedArticles}
    />
  )
}