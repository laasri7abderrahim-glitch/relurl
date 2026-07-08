import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "URL Shortener in India",
    description: "Best URL shortener in India for businesses, marketers, and content creators. Fast, reliable link shortening with free forever plan, no hidden charges, and local-friendly features.",
    path: "/url-shortener-in-india",
    keywords: ["url shortener india", "best url shortener in india", "indian url shortener", "link shortener india"],
    locale,
  })
}

export default function Page() {
  const href = "/url-shortener-in-india"
  const relatedArticles = getPostsByLandingPage("/free-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="URL Shortener in India"
      subtitle="Best for Indian Users"
      description="Best URL shortener in India for businesses, marketers, and content creators. Fast, reliable link shortening with free forever plan, no hidden charges, and local-friendly features."
      placeholder="Paste your URL to shorten..."
      generateLabel="India Free"
      features={["URL Compression", "Free Forever", "No Expiration", "Click Analytics", "Custom Aliases", "QR Code Generation"]}
      howItWorks={[
        { step: "Paste Your URL", desc: "Copy any long URL from your website, product page, or social media post." },
        { step: "Shorten & Customize", desc: "Click to generate a short link and optionally create a custom alias for your brand." },
        { step: "Share & Track", desc: "Share your short link across WhatsApp, Instagram, and other platforms popular in India." },
      ]}
      useCases={["Share product links on WhatsApp Business with clean short URLs", "Shorten links for Instagram and YouTube influencers in India", "Track click performance on social media campaigns targeting India", "Create branded short links for Indian e-commerce stores", "Generate QR codes for offline marketing in local markets"]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "Is RELURL free for users in India?", a: "Yes, RELURL offers a completely free forever plan with no hidden charges, perfect for Indian users and businesses." },
        { q: "Can I use RELURL for my e-commerce store in India?", a: "Absolutely. RELURL is great for Indian e-commerce businesses needing clean, trackable product links." },
        { q: "Does RELURL work well on mobile networks in India?", a: "Yes, RELURL is optimized for fast loading on all networks and devices commonly used across India." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
