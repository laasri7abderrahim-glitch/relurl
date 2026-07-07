import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Shorten Instagram URL - Instagram Link Shortener",
    description: "Shorten Instagram profile and content URLs for sharing across platforms. Make your Instagram links clean, trackable, and optimized for your bio.",
    path: "/shorten-instagram-url",
    keywords: ["shorten instagram url", "instagram link shortener", "instagram url shortener", "short instagram link"],
    locale,
  })
}

export default function ShortenInstagramURLPage() {
  const href = "/shorten-instagram-url"
  const relatedArticles = getPostsByLandingPage("/instagram-link-generator").slice(0, 3)
  return (
    <URLLandingPage
      title="Shorten Instagram URL"
      subtitle="Streamline Your Instagram Links"
      description="Shorten Instagram profile URLs, post links, and Reel URLs for easier sharing. Clean, trackable short links make your Instagram presence more professional across all platforms."
      placeholder="https://www.instagram.com/p/example"
      generateLabel="Shorten Instagram URL"
      features={[
        "Instagram Link Compression",
        "Bio Link Optimization",
        "Click Tracking",
        "Custom Aliases",
        "Multi-Platform Sharing",
        "QR Code Ready",
      ]}
      howItWorks={[
        { step: "Paste Instagram URL", desc: "Copy the Instagram post, Reel, or profile URL you want to shorten." },
        { step: "Customize Your Link", desc: "Add a custom slug that matches your brand or campaign name." },
        { step: "Share and Track", desc: "Use your short link in your bio, stories, or cross-platform promotions." },
      ]}
      useCases={[
        "Share Instagram Reels on other social platforms",
        "Create trackable links for Instagram ad campaigns",
        "Add clean Instagram links to email signatures",
        "Promote Instagram profiles on business cards",
        "Track clicks from Instagram Stories to external sites",
        "Share Instagram posts in messaging apps",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "Can I shorten Instagram profile URLs?", a: "Yes, you can shorten any Instagram URL including profiles, posts, Reels, and Stories. Just paste the URL and get a clean, short link immediately." },
        { q: "Do shortened Instagram links work in Stories?", a: "Yes, shortened links work in Instagram Stories just like regular URLs. They are also cleaner and less likely to be truncated in the swipe-up link area." },
        { q: "Can I track who clicks my Instagram short links?", a: "You can see total clicks, geographic locations, device types, and referrer data in your RELURL dashboard. This helps you measure engagement from Instagram to your destinations." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
