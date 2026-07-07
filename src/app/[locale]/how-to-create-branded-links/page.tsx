import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "How to Create Branded Links - Branding Guide",
    description: "Learn how to create branded links that build trust and increase click-through rates. Step-by-step guide to setting up custom domains and branded short URLs.",
    path: "/how-to-create-branded-links",
    keywords: ["how to create branded links", "branded url shortener", "custom domain links", "branded short links guide"],
    locale,
  })
}

export default function HowToCreateBrandedLinksPage() {
  const href = "/how-to-create-branded-links"
  const relatedArticles = getPostsByLandingPage("/branded-link-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="How to Create Branded Links"
      subtitle="Build Your Brand in Every Link"
       description="Learn how to create branded short URLs that boost brand recall and audience trust. Complete guide to setting up custom domains and branded links."
      placeholder="https://example.com/your-branded-content"
      generateLabel="Create Branded Link"
      features={[
        "Custom Domain Setup",
        "Brand Identity Integration",
        "Click-Through Optimization",
        "DNS Configuration Guide",
        "Analytics Dashboard",
        "Multi-Domain Support",
      ]}
      howItWorks={[
        { step: "Choose Your Brand Domain", desc: "Select a short, memorable domain like go.yourbrand.com for your branded links." },
        { step: "Configure DNS Records", desc: "Add the required CNAME or A records to point your domain to RELURL's platform." },
        { step: "Start Creating Branded Links", desc: "Once verified, every link you create can use your branded domain automatically." },
      ]}
      useCases={[
        "Build brand recognition with every link shared",
        "Increase click-through rates with trusted domains",
        "Create professional links for corporate communications",
        "Enhance email marketing with branded URLs",
        "Maintain brand consistency across campaigns",
        "Establish authority in your industry",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "What domain should I use for branded links?", a: "Choose a short, memorable domain that reflects your brand. Common formats are go.yourbrand.com, link.yourbrand.com, or yourbrand.link. Short domains are easier to communicate verbally." },
        { q: "How do I set up DNS for my branded domain?", a: "You will need to add a CNAME record pointing to RELURL's verification server. Detailed step-by-step instructions are provided in your dashboard when you add a new domain." },
        { q: "Do branded links really increase click-through rates?", a: "Yes, branded domains significantly increase click-through rates. Studies show that links on recognizable domains receive 30-40 percent more clicks than links on generic shortener domains." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
