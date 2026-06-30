import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "SaaS Link Shortener - Software Marketing Links",
    description: "Shorten demo, trial, and feature page links for your SaaS. Track signups, optimize funnels, and boost conversions with RELURL.",
    path: "/saas-link-shortener",
    keywords: ["saas link shortener", "software marketing links", "saas demo links"],
    locale,
  })
}

export default function SaaSLinkShortenerPage() {
  const href = "/saas-link-shortener"
  const relatedArticles = getPostsByLandingPage("/saas-link-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="SaaS Link Shortener"
      subtitle="Accelerate SaaS Growth"
      description="Shorten demo, trial, and feature page links. Track signups through your funnel, optimize campaigns, and accelerate growth."
      placeholder="https://your-saas.com/pricing?ref=campaign"
      inputLabel="Enter your SaaS link"
      generateLabel="Shorten URL"
      features={[
        "Funnel Stage Tracking",
        "Signup Attribution",
        "A/B Test Support",
        "Referral Link Management",
        "Branded Demo Links",
        "Campaign Analytics",
      ]}
      howItWorks={[
        { step: "Paste SaaS URL", desc: "Enter your pricing, demo, or feature page link." },
        { step: "Add Campaign Tags", desc: "Tag the link with UTM parameters for funnel tracking." },
        { step: "Share & Optimize", desc: "Use in ads and emails, then optimize based on signup data." },
      ]}
      useCases={[
        "Free trial promotion",
        "Demo booking campaigns",
        "Feature announcement emails",
        "Affiliate partner links",
        "Webinar registration funnels",
        "Retargeting ad campaigns",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}

      relatedArticles={relatedArticles}
    />
  )
}