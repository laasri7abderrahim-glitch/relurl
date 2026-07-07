import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Best URL Shortener - Free & Feature-Rich Link Tool",
    description: "Find the best URL shortener for your needs. Compare features, pricing, and capabilities. RELURL offers unlimited links, analytics, QR codes, and branded domains.",
    path: "/best-url-shortener",
    keywords: ["best url shortener", "top url shortener", "best link shortener", "url shortener comparison"],
    locale,
  })
}

export default function BestURLShortenerPage() {
  const href = "/best-url-shortener"
  const relatedArticles = getPostsByLandingPage("/free-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="Best URL Shortener"
      subtitle="Find Your Perfect Link Tool"
      description="Looking for the best URL shortener? Compare top features including unlimited links, custom slugs, click analytics, QR codes, branded domains, and pricing to find the right tool for your needs."
      placeholder="https://example.com/your-link"
      generateLabel="Shorten Your URL"
      features={[
        "Unlimited Free Links",
        "Custom Slugs & Aliases",
        "Click Analytics Dashboard",
        "QR Code Generator",
        "Branded Domain Support",
        "Link Expiration Controls",
      ]}
      howItWorks={[
        { step: "Compare Features", desc: "Review what matters most: link limits, analytics, custom domains, and pricing." },
        { step: "Try the Best Tool", desc: "Test RELURL with unlimited free links, custom slugs, and analytics." },
        { step: "Make the Switch", desc: "Migrate your links to the platform that best fits your needs and budget." },
      ]}
      useCases={[
        "Find a free URL shortener without link limits",
        "Choose a tool with built-in analytics",
        "Select a platform with custom domain support",
        "Pick a shortener with QR code features",
        "Compare pricing across top URL shorteners",
        "Find the best fit for business link management",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "What should I look for in a URL shortener?", a: "Key features include unlimited link creation, custom slugs, click analytics, QR code generation, branded domain support, link expiration, and API access. Pricing and link limits are also important considerations." },
        { q: "Is RELURL the best free URL shortener?", a: "RELURL offers one of the most generous free plans with unlimited permanent links, custom slugs, and basic analytics. Many competitors limit free plans to a fixed number of links or reserve features for paid tiers." },
        { q: "How do URL shorteners compare on pricing?", a: "Free plans vary widely. Some offer limited monthly links, others expire inactive links. Paid plans range from affordable monthly subscriptions to enterprise pricing. Compare features per dollar to find the best value." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
