import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Short.io Alternative - Free URL Shortener",
    description: "Looking for a Short.io alternative? RELURL offers similar features with more affordable pricing, unlimited links, and a generous free plan.",
    path: "/short-io-alternative",
    keywords: ["short.io alternative", "short.io competitor", "free short.io alternative", "shortio alternative"],
    locale,
  })
}

export default function ShortIOAlternativePage() {
  const href = "/short-io-alternative"
  const relatedArticles = getPostsByLandingPage("/free-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="Short.io Alternative"
      subtitle="Same Power, Better Price"
       description="Looking for a Short.io alternative? RELURL delivers custom domains, link analytics, QR codes, and team features at friendlier pricing with a generous free plan."
      placeholder="https://example.com/your-link"
      generateLabel="Try RELURL Free"
      features={[
        "Custom Domain Support",
        "Link Analytics Dashboard",
        "QR Code Generation",
        "Team Collaboration",
        "Unlimited Short Links",
        "Competitive Pricing",
      ]}
      howItWorks={[
        { step: "Create Free Account", desc: "Register for RELURL and start using all features immediately." },
        { step: "Configure Your Setup", desc: "Add custom domains, set up team members, and customize your links." },
        { step: "Launch and Monitor", desc: "Create short links and track their performance from your dashboard." },
      ]}
      useCases={[
        "Replace Short.io with more affordable link management",
        "Access premium features on a smaller budget",
        "Get team features without enterprise pricing",
        "Use built-in QR codes without additional costs",
        "Scale your link infrastructure affordably",
        "Manage links with a generous free tier",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "How does RELURL compare to Short.io's feature set?", a: "RELURL offers comparable features including custom domains, analytics, QR codes, and team collaboration, but at more accessible price points with a stronger free plan." },
        { q: "Does RELURL support API integration like Short.io?", a: "Yes, RELURL provides a RESTful API for programmatic link creation and management, suitable for developers and automated workflows." },
        { q: "Can I migrate from Short.io to RELURL?", a: "Yes, you can recreate your important links in RELURL. Start with your most active links and set up custom slugs to match your existing branding." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
