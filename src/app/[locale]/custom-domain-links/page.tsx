import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Custom Domain Links - Branded Short Domain",
    description: "Use your own domain for short links with RELURL. Create branded short URLs that showcase your brand and earn audience trust with every click.",
    path: "/custom-domain-links",
    keywords: ["custom domain links", "branded short domain", "custom url shortener domain", "own domain short links"],
    locale,
  })
}

export default function CustomDomainLinksPage() {
  const href = "/custom-domain-links"
  const relatedArticles = getPostsByLandingPage("/branded-link-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="Custom Domain Links"
      subtitle="Your Brand in Every Link"
      description="Use your own domain for short links to build brand recognition and trust. Every shortened URL becomes a branded asset that reinforces your identity."
      placeholder="https://example.com/your-long-url"
      generateLabel="Create Branded Link"
      features={[
        "Custom Domain Support",
        "Brand Recognition",
        "Increased Trust",
        "Professional Appearance",
        "Unified Analytics",
        "Easy DNS Setup",
      ]}
      howItWorks={[
        { step: "Add Your Domain", desc: "Enter your custom domain in the RELURL dashboard and configure the DNS settings." },
        { step: "Verify Ownership", desc: "Complete the DNS verification to prove you own the domain." },
        { step: "Start Creating Branded Links", desc: "All your short links can now use your branded domain automatically." },
      ]}
      useCases={[
        "Build brand recognition with every shared link",
        "Increase click-through rates with trusted domains",
        "Maintain consistent branding across campaigns",
        "Create professional links for corporate communications",
        "Enhance email marketing with branded URLs",
        "Establish authority in your industry",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "What DNS records do I need to set up?", a: "You need to add a CNAME record pointing to RELURL's verification server. Detailed setup instructions are provided in your dashboard when you add a new domain." },
        { q: "Can I use multiple custom domains?", a: "Yes, depending on your plan, you can add multiple custom domains. This is useful for agencies managing links for multiple brands or departments." },
        { q: "Do custom domains improve click-through rates?", a: "Yes, branded domains significantly increase click-through rates. Users are more likely to click a link on a domain they recognize, and custom domains reduce suspicion compared to generic shortener domains." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
