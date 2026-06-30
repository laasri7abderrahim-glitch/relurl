import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Branded Link Shortener - Branded Short URLs",
    description: "Shorten URLs with your own brand name. Create branded short links that build trust, recognition, and click-through rates with every shared link.",
    path: "/branded-link-shortener",
    keywords: ["branded link shortener", "branded short urls", "brand links"],
    locale,
  })
}

export default function BrandedLinkShortenerPage() {
  const href = "/branded-link-shortener"
  const relatedArticles = getPostsByLandingPage("/branded-link-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="Branded Link Shortener"
      subtitle="Put Your Brand on Every Link"
      description="Shorten URLs with your custom branded domain. Create short links that reinforce your brand identity and build trust with every click."
      placeholder="https://example.com/your-long-url"
      inputLabel="Enter your long URL"
      generateLabel="Shorten URL"
      features={[
        "Custom Branded Domains",
        "Consistent Brand Voice",
        "Trust-Building Links",
        "Custom Back-Half Names",
        "Link Management Dashboard",
        "Click Analytics by Brand",
      ]}
      howItWorks={[
        { step: "Connect Your Domain", desc: "Add your branded domain like go.yourbrand.com." },
        { step: "Create Branded Links", desc: "Use your brand name in the short URL slug." },
        { step: "Track & Optimize", desc: "Monitor click performance across all branded links." },
      ]}
      useCases={[
        "Company-wide link standardization",
        "Product marketing campaigns",
        "Social media profile links",
        "Press releases and media mentions",
        "Customer support documentation",
        "Partner and affiliate programs",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "What is a branded short domain?", a: "A branded short domain is a custom domain (like go.yourcompany.com) that you use for your shortened links instead of a generic domain. It keeps your brand front and center in every link you share." },
        { q: "How do I connect my own domain?", a: "From your dashboard, go to Domains and add your custom domain. You'll need to configure a CNAME record with your DNS provider. Once verified, all links can use your branded domain." },
        { q: "Does branded link shortening improve trust?", a: "Yes. Links on branded domains get 30-40% higher click-through rates because users trust recognizable domains. Branded links also look professional in marketing materials and social media." },
      ]}

      relatedArticles={relatedArticles}
    />
  )
}