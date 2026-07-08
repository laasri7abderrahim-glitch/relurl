import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "URL Shortener for Social Media",
    description: "Perfect URL shortener for social media. Shorten links for Twitter, Instagram, LinkedIn, TikTok, and Facebook. Save characters and track engagement across platforms.",
    path: "/url-shortener-for-social-media",
    keywords: ["url shortener for social media", "social media link shortener", "shorten links for twitter", "shorten links for instagram"],
    locale,
  })
}

export default function Page() {
  const href = "/url-shortener-for-social-media"
  const relatedArticles = getPostsByLandingPage("/free-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="URL Shortener for Social Media"
      subtitle="Share Smarter"
      description="Perfect URL shortener for social media. Shorten links for Twitter, Instagram, LinkedIn, TikTok, and Facebook. Save characters and track engagement across platforms."
      placeholder="Paste your social media link..."
      generateLabel="Social Plan"
      features={["URL Compression", "Click Analytics", "Social Share Buttons", "Campaign Tracking", "QR Code Generation", "Custom Aliases"]}
      howItWorks={[
        { step: "Copy Your Link", desc: "Take the URL you want to share on social media and paste it into the input above." },
        { step: "Shorten & Customize", desc: "Get a compact short link that saves characters on Twitter, Instagram bios, and TikTok." },
        { step: "Post & Track", desc: "Share your short link across platforms and monitor which social channel drives the most traffic." },
      ]}
      useCases={["Save precious characters in Twitter/X posts with short links", "Create clean bio links for Instagram and TikTok profiles", "Track which social platform drives the most referral traffic", "Share trackable links in LinkedIn posts and articles", "Build custom short links for Facebook ad campaigns"]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "Will my link preview show up on social media?", a: "Yes, RELURL preserves Open Graph and Twitter Card metadata so your link previews appear correctly on all platforms." },
        { q: "Can I track clicks from different social platforms?", a: "Absolutely. RELURL analytics break down clicks by referrer so you know exactly which platform performs best." },
        { q: "Can I use custom domains for social media links?", a: "Yes, custom domains help build brand recognition even in short bio links on Instagram and TikTok." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
