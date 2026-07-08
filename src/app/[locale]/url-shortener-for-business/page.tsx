import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "URL Shortener for Business",
    description: "Enterprise-grade URL shortener for businesses. Branded links, team collaboration, detailed analytics, and custom domains to manage your company's link infrastructure effectively.",
    path: "/url-shortener-for-business",
    keywords: ["url shortener for business", "business url shortener", "enterprise link shortener", "corporate url shortener"],
    locale,
  })
}

export default function Page() {
  const href = "/url-shortener-for-business"
  const relatedArticles = getPostsByLandingPage("/free-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="URL Shortener for Business"
      subtitle="Enterprise-Grade Links"
      description="Enterprise-grade URL shortener for businesses. Branded links, team collaboration, detailed analytics, and custom domains to manage your company's link infrastructure effectively."
      placeholder="Enter your business URL..."
      generateLabel="Business Plan"
      features={["Custom Domains", "Team Collaboration", "Advanced Analytics", "Custom Branded Slugs", "Bulk Shortening", "API Access"]}
      howItWorks={[
        { step: "Create Your Business Account", desc: "Sign up for a free business account and set up your company profile and team structure." },
        { step: "Brand Your Links", desc: "Configure custom domains and branded slugs so every short link reflects your company identity." },
        { step: "Analyze Performance", desc: "Track all team links, generate reports, and optimize your marketing campaigns with detailed analytics." },
      ]}
      useCases={["Brand all company short links with custom domains", "Collaborate with marketing teams on campaign links", "Track campaign ROI with enterprise-level analytics", "Manage links programmatically via REST API", "Generate bulk product links for e-commerce catalogs"]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "Can my whole team use RELURL under one account?", a: "Yes, RELURL offers team collaboration features so your entire marketing team can create and manage links together." },
        { q: "Can I use my own domain for business short links?", a: "Absolutely. Custom domains let you create branded short links like go.yourcompany.com/product that build trust." },
        { q: "Is there an API for integrating RELURL with our tools?", a: "Yes, RELURL provides a full REST API for programmatic link creation, management, and analytics export." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
