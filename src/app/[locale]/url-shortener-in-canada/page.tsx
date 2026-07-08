import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "URL Shortener in Canada",
    description: "Best URL shortener in Canada for businesses, marketers, and content creators. Fast, privacy-compliant link shortening with free plan tailored for Canadian users.",
    path: "/url-shortener-in-canada",
    keywords: ["url shortener canada", "best url shortener in canada", "canadian url shortener", "link shortener canada"],
    locale,
  })
}

export default function Page() {
  const href = "/url-shortener-in-canada"
  const relatedArticles = getPostsByLandingPage("/free-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="URL Shortener in Canada"
      subtitle="Best for Canadian Users"
      description="Best URL shortener in Canada for businesses, marketers, and content creators. Fast, privacy-compliant link shortening with free plan tailored for Canadian users."
      placeholder="Paste your Canadian business URL..."
      generateLabel="Canada Free"
      features={["URL Compression", "Click Analytics", "Custom Aliases", "Campaign Tracking", "QR Code Generation", "Free Forever"]}
      howItWorks={[
        { step: "Paste Your URL", desc: "Copy any link from your Canadian business, blog, or online store." },
        { step: "Shorten & Customize", desc: "Generate a clean short link and personalize it with a custom alias for your brand." },
        { step: "Share Across Canada", desc: "Deploy your short link on social media, email, and marketing channels targeting Canadian audiences." },
      ]}
      useCases={["Track marketing campaigns targeting Canadian cities and provinces", "Create branded short links for Toronto and Vancouver businesses", "Share product links on Canadian social media platforms", "Generate QR codes for Canadian retail and restaurant locations", "Manage privacy-compliant link tracking for Canadian customers"]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "Is RELURL compliant with Canadian privacy laws?", a: "Yes, RELURL follows strict privacy practices that align with Canadian data protection standards including PIPEDA." },
        { q: "Can I see which Canadian province my clicks come from?", a: "Yes, RELURL provides geographic analytics down to the city level for all your shortened links." },
        { q: "Is there a free plan for Canadian users?", a: "Absolutely. RELURL's free forever plan gives Canadian users unlimited link shortening at no cost." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
