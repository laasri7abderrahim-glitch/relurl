import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"

export const metadata = generateSEOMetadata({
  title: "Free URL Shortener - Free Short Links",
  description: "Shorten URLs for free with RELURL. Get custom slugs, basic click analytics, and unlimited links on our free plan with no signup required.",
  path: "/free-url-shortener",
  keywords: ["free url shortener", "free short links", "shorten url free"],
})

export default function FreeURLShortenerPage() {
  const href = "/free-url-shortener"
  return (
    <URLLandingPage
      title="Free URL Shortener"
      subtitle="100% Free, No Strings Attached"
      description="Shorten unlimited URLs for free. No account required. Get clean short links with basic analytics — completely free forever."
      placeholder="https://example.com/your-long-url"
      inputLabel="Paste any URL to shorten it"
      generateLabel="Shorten for Free"
      features={[
        "Unlimited Free Links",
        "No Account Required",
        "Basic Click Analytics",
        "Custom Aliases",
        "Permanent Links",
        "No Expiration",
      ]}
      howItWorks={[
        { step: "Paste URL", desc: "Enter any long URL — no signup needed." },
        { step: "Get Short Link", desc: "Receive your short URL instantly." },
        { step: "Share & Track", desc: "Share your link and monitor clicks in real time." },
      ]}
      useCases={[
        "Personal link sharing",
        "Student projects",
        "Small business websites",
        "Blog post link optimization",
        "Social media sharing",
        "Quick link shortening",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "How is this different from other URL shorteners?", a: "Unlike most free URL shorteners, we never expire your links, provide basic click analytics even on the free plan, and let you create custom aliases without upgrading. No hidden limits or time bombs." },
        { q: "Can I shorten URLs without signing up?", a: "Yes! You can generate short links instantly without any account. However, creating a free account lets you track clicks, manage your links, and use custom slugs." },
        { q: "What happens if my link goes viral?", a: "Shortened links on our platform handle high traffic automatically. Free plan links never expire or break, even if your content goes viral. Our infrastructure scales to meet demand." },
      ]}
    />
  )
}
