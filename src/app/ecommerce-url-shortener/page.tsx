import type { Metadata } from "next"
import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "E-commerce URL Shortener - Boost Online Sales",
  description: "Shorten product links to boost conversions. Track clicks, optimize campaigns, and drive more sales with RELURL's e-commerce link shortener.",
  path: "/ecommerce-url-shortener",
  keywords: ["ecommerce url shortener", "product link shortener", "shopify link shortener"],
})

export default function EcommerceURLShortenerPage() {
  const href = "/ecommerce-url-shortener"
  return (
    <URLLandingPage
      title="E-commerce URL Shortener"
      subtitle="Boost Online Sales"
      description="Shorten product and category URLs to boost conversions. Track clicks, optimize campaigns, and drive more sales with powerful analytics."
      placeholder="https://your-store.com/products/long-product-name"
      inputLabel="Enter your product URL"
      generateLabel="Shorten URL"
      features={[
        "Product Link Tracking",
        "Conversion Analytics",
        "Bulk Shortening",
        "UTM Parameter Support",
        "Custom Brand Slugs",
        "A/B Testing Ready",
      ]}
      howItWorks={[
        { step: "Paste Product URL", desc: "Enter your product or category page URL." },
        { step: "Customize & Shorten", desc: "Add a branded slug and UTM parameters for tracking." },
        { step: "Share & Track", desc: "Use the short link in ads and emails, then monitor conversions." },
      ]}
      useCases={[
        "Product page link sharing",
        "Email marketing campaigns",
        "Social media product posts",
        "Affiliate program links",
        "Retargeting ad campaigns",
        "Print catalog QR codes",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
    />
  )
}
