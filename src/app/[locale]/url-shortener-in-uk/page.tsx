import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "URL Shortener in UK",
    description: "Best URL shortener in the UK for businesses and marketers. Fast, GDPR-compliant link shortening with free forever plan and advanced analytics for UK-based users.",
    path: "/url-shortener-in-uk",
    keywords: ["url shortener uk", "best url shortener in uk", "uk link shortener", "british url shortener"],
    locale,
  })
}

export default function Page() {
  const href = "/url-shortener-in-uk"
  const relatedArticles = getPostsByLandingPage("/free-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="URL Shortener in UK"
      subtitle="Best for UK Users"
      description="Best URL shortener in the UK for businesses and marketers. Fast, GDPR-compliant link shortening with free forever plan and advanced analytics for UK-based users."
      placeholder="Paste your UK campaign URL..."
      generateLabel="UK Free"
      features={["URL Compression", "Click Analytics", "GDPR Compliant", "Custom Branded Slugs", "Campaign Tracking", "No Expiration"]}
      howItWorks={[
        { step: "Enter Your Link", desc: "Paste any URL from your UK business website, online store, or marketing campaign." },
        { step: "Shorten & Brand", desc: "Generate a short link and apply a custom slug that reflects your British brand identity." },
        { step: "Track Campaigns", desc: "Monitor clicks and engagement from your UK audience with detailed regional analytics." },
      ]}
      useCases={["Track UK marketing campaign performance with precision", "Create branded short links for London-based businesses", "Share product links across UK social media channels", "Manage GDPR-compliant link tracking for UK customers", "Generate QR codes for UK retail and hospitality businesses"]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "Is RELURL GDPR compliant for UK users?", a: "Yes, RELURL follows GDPR guidelines for data protection and privacy, making it suitable for UK businesses." },
        { q: "Can I track clicks specifically from the UK?", a: "Yes, RELURL provides geographic analytics so you can see exactly how many clicks come from UK locations." },
        { q: "Is RELURL free for UK businesses?", a: "Yes, RELURL offers a generous free forever plan that's perfect for UK startups and small businesses." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
