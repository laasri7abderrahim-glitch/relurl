import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Bitly Alternative - Free & Better URL Shortener",
    description: "Looking for a Bitly alternative? RELURL offers free unlimited links, custom slugs, analytics, and QR codes without Bitly's link limits and pricing.",
    path: "/bitly-alternative",
    keywords: ["bitly alternative", "bitly competitor", "free bitly alternative", "better than bitly"],
    locale,
  })
}

export default function BitlyAlternativePage() {
  const href = "/bitly-alternative"
  const relatedArticles = getPostsByLandingPage("/free-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="Bitly Alternative"
      subtitle="More Features, Better Pricing"
      description="Looking for a better alternative to Bitly? RELURL provides free unlimited link shortening, custom slugs, click analytics, and QR codes without the restrictive limits and high pricing of Bitly."
      placeholder="https://example.com/your-link"
      generateLabel="Try RELURL Free"
      features={[
        "Unlimited Free Links",
        "Custom Slugs on Free Plan",
        "Built-in Click Analytics",
        "Free QR Code Generation",
        "No Link Expiration",
        "Better Pricing Than Bitly",
      ]}
      howItWorks={[
        { step: "Create Your Free Account", desc: "Sign up for RELURL in seconds with no credit card required. Get access to all core features immediately." },
        { step: "Start Shortening Links", desc: "Create unlimited short links with custom slugs, even on the free plan." },
        { step: "Track and Optimize", desc: "Monitor click analytics and manage all your links from one dashboard." },
      ]}
      useCases={[
        "Replace Bitly for personal link shortening",
        "Migrate business links from Bitly to a more affordable solution",
        "Get custom aliases without Bitly's paid plan requirement",
        "Access click analytics without upgrading",
        "Generate QR codes without additional fees",
        "Scale your link management without cost increases",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "How does RELURL compare to Bitly's free plan?", a: "Bitly's free plan limits you to a fixed number of links per month and expires inactive links after one year. RELURL offers unlimited permanent links with custom slugs and analytics on the free plan." },
        { q: "Can I migrate my links from Bitly to RELURL?", a: "Yes, you can manually recreate your important Bitly links in RELURL. We recommend starting with your most active links and recreating them with your preferred custom slugs." },
        { q: "Does RELURL offer branded domains like Bitly?", a: "Yes, RELURL supports custom branded domains on our mid-tier plans, similar to Bitly's branded domains feature but at a more accessible price point." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
