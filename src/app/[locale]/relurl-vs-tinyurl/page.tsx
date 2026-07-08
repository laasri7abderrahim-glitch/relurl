import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "RELURL vs TinyURL",
    description: "Compare RELURL vs TinyURL to find the best URL shortener for your needs. See feature differences, pricing, link management capabilities, and analytics quality.",
    path: "/relurl-vs-tinyurl",
    keywords: ["relurl vs tinyurl", "tinyurl alternative", "relurl or tinyurl", "compare url shorteners"],
    locale,
  })
}

export default function Page() {
  const href = "/relurl-vs-tinyurl"
  const relatedArticles = getPostsByLandingPage("/free-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="RELURL vs TinyURL"
      subtitle="Which Is Better?"
      description="Compare RELURL vs TinyURL to find the best URL shortener for your needs. RELURL offers modern analytics, custom aliases, QR codes, and a free forever plan with no link expiration."
      placeholder="Compare features now..."
      generateLabel="Compare vs TinyURL"
      features={["Click Analytics", "Custom Branded Slugs", "QR Code Generation", "Real-time Tracking", "No Expiration", "Free Forever"]}
      howItWorks={[
        { step: "Compare Feature Sets", desc: "See how RELURL's modern link management platform stacks up against TinyURL's basic shortening service." },
        { step: "Check Analytics Quality", desc: "RELURL provides real-time click analytics with geo-location data, while TinyURL offers limited stats." },
        { step: "Choose Your Platform", desc: "Pick RELURL for advanced features, custom domains, and a generous free plan that TinyURL can't match." },
      ]}
      useCases={["Replace TinyURL with a more feature-rich alternative", "Get detailed analytics TinyURL doesn't offer", "Create custom branded slugs for professional links", "Generate QR codes for every shortened link", "Use custom domains for branded short URLs"]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "What features does RELURL have that TinyURL doesn't?", a: "RELURL offers click analytics, custom aliases, QR code generation, custom domains, link expiration control, and password protection — all on a free plan." },
        { q: "Is RELURL really free compared to TinyURL?", a: "Yes, RELURL has a generous free forever plan with no link expiration, unlike TinyURL which limits free features." },
        { q: "Can I migrate my links from TinyURL to RELURL?", a: "While you can't migrate automatically, you can recreate your important links on RELURL with custom aliases to match." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
