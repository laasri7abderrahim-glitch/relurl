import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "RELURL vs Bitly",
    description: "Compare RELURL vs Bitly to find the best enterprise-grade URL shortener. See how RELURL's pricing, analytics, and features compare to Bitly's paid plans.",
    path: "/relurl-vs-bitly",
    keywords: ["relurl vs bitly", "bitly alternative", "relurl or bitly", "compare relurl bitly"],
    locale,
  })
}

export default function Page() {
  const href = "/relurl-vs-bitly"
  const relatedArticles = getPostsByLandingPage("/free-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="RELURL vs Bitly"
      subtitle="The Better Choice"
      description="Compare RELURL vs Bitly to find the best enterprise-grade URL shortener. RELURL offers comparable analytics, custom domains, and team features at a fraction of Bitly's cost."
      placeholder="See how we compare..."
      generateLabel="Compare vs Bitly"
      features={["Advanced Analytics", "Custom Domains", "Team Collaboration", "Bulk Shortening", "API Access", "Free Forever"]}
      howItWorks={[
        { step: "Review Feature Comparison", desc: "Compare RELURL's feature set against Bitly's paid tiers to see where you get more value." },
        { step: "Check Pricing Differences", desc: "RELURL offers a free forever plan with features Bitly charges a premium for." },
        { step: "Switch to RELURL", desc: "Make the switch and enjoy enterprise-grade link management without the enterprise price tag." },
      ]}
      useCases={["Replace costly Bitly subscriptions with RELURL's free plan", "Get Bitly-level analytics without paying per link", "Use custom domains with no premium upsells", "Collaborate with teams without seat licensing fees", "Access API features that Bitly locks behind paid tiers"]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "How does RELURL's free plan compare to Bitly's?", a: "RELURL's free plan includes features Bitly charges for: custom aliases, QR codes, click analytics, and unlimited links." },
        { q: "Does RELURL offer the same analytics quality as Bitly?", a: "Yes, RELURL provides real-time click analytics with geographic data, device tracking, and referrer information comparable to Bitly's paid plans." },
        { q: "Can I use custom domains with RELURL like Bitly?", a: "Absolutely, custom domains are available on RELURL's plans at a much more accessible price point than Bitly." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
