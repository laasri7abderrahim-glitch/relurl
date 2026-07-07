import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Rebrandly Alternative - Free URL Shortener",
    description: "Looking for a Rebrandly alternative? RELURL offers branded links, custom domains, and team features at more affordable pricing with a generous free plan.",
    path: "/rebrandly-alternative",
    keywords: ["rebrandly alternative", "rebrandly competitor", "free rebrandly alternative", "better than rebrandly"],
    locale,
  })
}

export default function RebrandlyAlternativePage() {
  const href = "/rebrandly-alternative"
  const relatedArticles = getPostsByLandingPage("/branded-link-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="Rebrandly Alternative"
      subtitle="Branded Links, Better Value"
      description="Looking for a Rebrandly alternative with better pricing and more features? RELURL offers branded links, custom domains, click analytics, and team collaboration without Rebrandly's high costs."
      placeholder="https://example.com/your-link"
      generateLabel="Try RELURL Free"
      features={[
        "Branded Link Support",
        "Custom Domain Integration",
        "Team Collaboration",
        "Detailed Analytics",
        "QR Code Generator",
        "More Affordable Plans",
      ]}
      howItWorks={[
        { step: "Sign Up for Free", desc: "Create your RELURL account and explore branded link features immediately." },
        { step: "Connect Your Domain", desc: "Add your custom domain and configure DNS to start creating branded links." },
        { step: "Create and Track", desc: "Generate branded short links and monitor their performance from your dashboard." },
      ]}
      useCases={[
        "Replace Rebrandly for branded link management",
        "Save on branded domain features with better pricing",
        "Access team collaboration without enterprise plans",
        "Get built-in QR codes alongside branded links",
        "Manage multiple brands from one account",
        "Scale branded link campaigns affordably",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "How does RELURL compare to Rebrandly's pricing?", a: "RELURL offers branded domains and team features at significantly lower price points. Our free plan includes features that Rebrandly reserves for paid tiers." },
        { q: "Can I connect multiple custom domains?", a: "Yes, RELURL supports multiple custom domains per account depending on your plan. This is ideal for agencies managing links for different brands." },
        { q: "Does RELURL offer Rebrandly's API features?", a: "Yes, RELURL provides a developer API for programmatic link creation and management, similar to Rebrandly's API but with more accessible rate limits." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
