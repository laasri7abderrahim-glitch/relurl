import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "How to Make Money with URL Shortener",
    description: "Learn how to make money with URL shortener strategies. Discover affiliate marketing, link management services, and content monetization with RELURL's free tools.",
    path: "/how-to-make-money-with-url-shortener",
    keywords: ["make money with url shortener", "url shortener monetization", "earn with short links", "monetize links"],
    locale,
  })
}

export default function Page() {
  const href = "/how-to-make-money-with-url-shortener"
  const relatedArticles = getPostsByLandingPage("/free-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="How to Make Money with URL Shortener"
      subtitle="Monetization Guide"
      description="Learn how to make money with URL shortener strategies. Discover affiliate marketing, link management services, and content monetization with RELURL's free tools."
      placeholder="Start your monetization journey..."
      generateLabel="Start Earning"
      features={["URL Compression", "Campaign Tracking", "Click Analytics", "Custom Aliases", "Bulk Shortening", "Custom Domains"]}
      howItWorks={[
        { step: "Create Affiliate Links", desc: "Shorten affiliate product links from Amazon, Shopify stores, and partner programs using clean RELURL links." },
        { step: "Promote Across Channels", desc: "Share your short affiliate links on social media, blogs, email newsletters, and content platforms." },
        { step: "Track & Optimize Earnings", desc: "Use RELURL analytics to see which links perform best and optimize your strategy for maximum commissions." },
      ]}
      useCases={["Earn commissions by sharing shortened affiliate product links", "Offer link management services to local businesses", "Create revenue from sponsored content with trackable links", "Build niche sites with optimized short affiliate URLs", "Run social media campaigns with trackable commission links"]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "Can I use RELURL for affiliate marketing?", a: "Absolutely. RELURL preserves affiliate tracking parameters and provides click analytics to optimize your campaigns." },
        { q: "Is there a limit on how many links I can create for monetization?", a: "No, RELURL offers generous limits on all plans so you can scale your affiliate marketing efforts." },
        { q: "Will shortened affiliate links still earn commissions?", a: "Yes, all affiliate tracking parameters are preserved. Your commissions are unaffected by link shortening." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
