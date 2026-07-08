import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Shorten Shopify Link",
    description: "Shorten Shopify store, product, and collection links with RELURL. Create clean, branded short URLs for your e-commerce store to boost click-through rates and track performance.",
    path: "/shorten-shopify-link",
    keywords: ["shorten shopify link", "shopify url shortener", "shopify link shortener", "shopify product link shortener"],
    locale,
  })
}

export default function Page() {
  const href = "/shorten-shopify-link"
  const relatedArticles = getPostsByLandingPage("/free-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="Shorten Shopify Link"
      subtitle="Optimize Your Store URLs"
      description="Shorten Shopify store, product, and collection links with RELURL. Create clean, branded short URLs for your e-commerce store to boost click-through rates and track performance."
      placeholder="Paste your Shopify link here..."
      generateLabel="Shorten Shopify Link"
      features={["URL Compression", "Custom Branded Slugs", "Click Analytics", "QR Code Generation", "Bulk Shortening", "Campaign Tracking"]}
      howItWorks={[
        { step: "Copy Your Shopify URL", desc: "Copy any product, collection, or store page link from your Shopify admin." },
        { step: "Generate Short Link", desc: "Paste it above and instantly get a clean, trackable short URL for your store." },
        { step: "Share & Analyze Sales", desc: "Deploy your short link across marketing channels and monitor clicks and conversions." },
      ]}
      useCases={["Share product links on Instagram and TikTok with clean URLs", "Track click-through rates on email marketing campaigns", "Create branded short links for Shopify store collections", "Run Facebook ad campaigns with trackable product links", "Include clean product URLs in influencer collaboration posts"]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "Will short links work with my Shopify custom domain?", a: "Yes, RELURL supports custom domains so you can create branded short links like shop.yourbrand.com/product." },
        { q: "Can I track which products get the most clicks?", a: "Absolutely. RELURL provides per-link analytics so you can see exactly which products drive the most traffic." },
        { q: "Is there a limit on how many Shopify links I can shorten?", a: "No, our free plan offers generous limits and paid plans allow unlimited link shortening for your store." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
