import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "How to Use UTM Parameters - Tracking Guide",
    description: "Learn how to use UTM parameters to track your marketing campaigns. Complete guide to adding UTM tags to URLs and analyzing campaign performance.",
    path: "/how-to-use-utm-parameters",
    keywords: ["how to use utm parameters", "utm tags guide", "utm parameter tutorial", "campaign tracking utm"],
    locale,
  })
}

export default function HowToUseUTMParametersPage() {
  const href = "/how-to-use-utm-parameters"
  const relatedArticles = getPostsByLandingPage("/campaign-link-generator").slice(0, 3)
  return (
    <URLLandingPage
      title="How to Use UTM Parameters"
      subtitle="Master Campaign Tracking"
      description="Learn how to use UTM parameters to track your marketing campaigns in Google Analytics. Complete guide to creating, organizing, and analyzing UTM-tagged URLs."
      placeholder="https://example.com/your-campaign-page"
      generateLabel="Create UTM Link"
      features={[
        "UTM Parameter Setup",
        "Campaign Source Tracking",
        "Medium Attribution",
        "Campaign Name Organization",
        "Content Variation Testing",
        "Google Analytics Integration",
      ]}
      howItWorks={[
        { step: "Identify Your Campaign", desc: "Determine the campaign, source, and medium you want to track in your analytics." },
        { step: "Add UTM Parameters", desc: "Append utm_source, utm_medium, utm_campaign, and optional utm_content to your URL." },
        { step: "Shorten and Share", desc: "Shorten your UTM-tagged URL with RELURL and share it across your marketing channels." },
      ]}
      useCases={[
        "Track email newsletter click-through rates",
        "Measure social media campaign performance",
        "Compare advertising channel effectiveness",
        "Analyze content marketing traffic sources",
        "Test different call-to-action variations",
        "Report on multi-channel campaign attribution",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "What are the main UTM parameters?", a: "The five standard UTM parameters are: utm_source (traffic source like newsletter or twitter), utm_medium (marketing medium like email or social), utm_campaign (campaign name), utm_term (paid keywords), and utm_content (content variation for A/B testing)." },
        { q: "Do UTM parameters affect SEO?", a: "No, UTM parameters do not affect SEO. Search engines ignore UTM parameters when indexing pages. They only affect analytics tracking when users click the link." },
        { q: "Should I shorten UTM URLs before sharing?", a: "Yes, shortening UTM-tagged URLs is recommended. Long URLs with multiple UTM parameters look cluttered and unprofessional. Shortening creates a clean link while preserving all tracking data." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
