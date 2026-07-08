import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Shorten Etsy Link",
    description: "Shorten Etsy shop and product listing links instantly with RELURL. Create clean, trackable short URLs for your Etsy store to boost sales and track marketing performance.",
    path: "/shorten-etsy-link",
    keywords: ["shorten etsy link", "etsy url shortener", "etsy link shortener", "etsy product link shortener"],
    locale,
  })
}

export default function Page() {
  const href = "/shorten-etsy-link"
  const relatedArticles = getPostsByLandingPage("/free-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="Shorten Etsy Link"
      subtitle="Boost Your Shop Listings"
      description="Shorten Etsy shop and product listing links instantly with RELURL. Create clean, trackable short URLs for your Etsy store to boost sales and track marketing performance."
      placeholder="Paste your Etsy link here..."
      generateLabel="Shorten Etsy Link"
      features={["URL Compression", "Custom Branded Slugs", "Click Analytics", "Bulk Shortening", "Campaign Tracking", "QR Code Generation"]}
      howItWorks={[
        { step: "Copy Your Etsy Listing URL", desc: "Copy the link of any Etsy product or your shop front page." },
        { step: "Generate a Clean Link", desc: "Paste it above and instantly get a short, professional URL for your listing." },
        { step: "Share Across Channels", desc: "Use your new short link on Pinterest, Instagram, TikTok, and in ads to drive traffic." },
      ]}
      useCases={["Share Etsy product links on Pinterest with clean URLs", "Track clicks on social media promotions for your Etsy shop", "Create branded short links for Etsy store collections", "Include tidy product links in email marketing campaigns", "Generate QR codes for Etsy listings at craft fairs and markets"]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "Will my Etsy affiliate links still work when shortened?", a: "Yes, RELURL preserves all URL parameters including affiliate tags so your commissions are tracked correctly." },
        { q: "Can I track which products get the most clicks?", a: "Absolutely. Each shortened Etsy link has its own analytics dashboard showing click counts and sources." },
        { q: "Can I bulk shorten all my Etsy product links?", a: "Yes, RELURL supports bulk URL shortening, perfect for Etsy sellers with large product catalogs." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
