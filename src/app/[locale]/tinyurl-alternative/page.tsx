import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "TinyURL Alternative - Modern URL Shortener",
    description: "Looking for a TinyURL alternative? RELURL offers custom slugs, click analytics, QR codes, and branded links that TinyURL does not provide.",
    path: "/tinyurl-alternative",
    keywords: ["tinyurl alternative", "tinyurl competitor", "free tinyurl alternative", "better than tinyurl"],
    locale,
  })
}

export default function TinyURLAlternativePage() {
  const href = "/tinyurl-alternative"
  const relatedArticles = getPostsByLandingPage("/free-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="TinyURL Alternative"
      subtitle="Modern Features, No Limits"
       description="Looking for a more capable TinyURL alternative? RELURL includes custom aliases, detailed click analytics, QR code generation, and branded domains that TinyURL lacks."
      placeholder="https://example.com/your-link"
      generateLabel="Try RELURL Free"
      features={[
        "Custom Aliases Included",
        "Detailed Click Analytics",
        "Free QR Code Generator",
        "Branded Domain Support",
        "Unlimited Link Creation",
        "Modern Dashboard",
      ]}
      howItWorks={[
        { step: "Sign Up Free", desc: "Create your RELURL account in seconds. No credit card needed." },
        { step: "Shorten with Custom Slugs", desc: "Create branded short links with meaningful custom aliases." },
        { step: "Track Performance", desc: "Monitor clicks, locations, and devices from your dashboard." },
      ]}
      useCases={[
        "Replace TinyURL with a more feature-rich tool",
        "Add click analytics to your shortened links",
        "Create branded short links with custom slugs",
        "Generate QR codes alongside your short links",
        "Manage all your links from a modern dashboard",
        "Scale link management for business use",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "What features does RELURL have that TinyURL does not?", a: "RELURL offers click analytics, custom slugs, QR code generation, branded domains, and a full dashboard for managing links. TinyURL provides basic shortening without analytics or customization." },
        { q: "Is RELURL as simple to use as TinyURL?", a: "Yes, RELURL is equally easy for basic shortening. Just paste a URL and click shorten. For advanced features like analytics and custom slugs, the tools are intuitive and accessible." },
        { q: "Can I create custom aliases on RELURL for free?", a: "Yes, custom slugs are available on RELURL's free plan. TinyURL does not offer custom aliases on any plan." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
