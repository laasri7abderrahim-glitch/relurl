import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Shorten Amazon Link",
    description: "Shorten Amazon product and affiliate links instantly with RELURL. Create clean, trackable short URLs for your Amazon listings, storefronts, and referral links to maximize earnings.",
    path: "/shorten-amazon-link",
    keywords: ["shorten amazon link", "amazon url shortener", "amazon affiliate link shortener"],
    locale,
  })
}

export default function Page() {
  const href = "/shorten-amazon-link"
  const relatedArticles = getPostsByLandingPage("/free-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="Shorten Amazon Link"
      subtitle="Clean Up Your Product Links"
      description="Shorten Amazon product and affiliate links instantly with RELURL. Create clean, trackable short URLs for your Amazon listings, storefronts, and referral links to maximize earnings."
      placeholder="Paste your Amazon link here..."
      generateLabel="Shorten Amazon Link"
      features={["URL Compression", "Custom Aliases", "Click Analytics", "Campaign Tracking", "Bulk Shortening", "No Expiration"]}
      howItWorks={[
        { step: "Copy Your Amazon URL", desc: "Copy any Amazon product, storefront, or affiliate link you want to share." },
        { step: "Paste & Shorten", desc: "Paste it into the input above and click to generate a clean, compact short link." },
        { step: "Share & Monitor", desc: "Share your shortened link anywhere and track clicks, conversions, and referral performance." },
      ]}
      useCases={["Share Amazon product links on social media without clutter", "Promote affiliate links with clean, trustworthy URLs", "Track click performance on Amazon referral campaigns", "Organize multiple product links for email newsletters", "Create branded short links for Amazon storefronts"]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "Will shortening my Amazon affiliate links affect commissions?", a: "No, RELURL preserves all affiliate tracking parameters. Your commissions remain intact while links become cleaner." },
        { q: "Can I create custom aliases for my Amazon links?", a: "Yes, you can customize the slug of any shortened Amazon link to make it memorable and brand-friendly." },
        { q: "Do you offer bulk shortening for Amazon product catalogs?", a: "Yes, RELURL supports bulk URL shortening, perfect for sellers managing large product catalogs." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
