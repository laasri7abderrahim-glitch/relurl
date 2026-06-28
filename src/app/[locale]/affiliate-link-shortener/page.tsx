import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"

export const metadata = generateSEOMetadata({
  title: "Affiliate Link Shortener - Cloak & Track Links",
  description: "Shorten and cloak your affiliate links for a cleaner look. Track clicks, conversions, and optimize your affiliate marketing campaigns with analytics.",
  path: "/affiliate-link-shortener",
  keywords: ["affiliate link shortener", "affiliate link cloaker", "affiliate tracking"],
})

export default function AffiliateLinkShortenerPage() {
  const href = "/affiliate-link-shortener"
  return (
    <URLLandingPage
      title="Affiliate Link Shortener"
      subtitle="Maximize Affiliate Revenue"
      description="Shorten, cloak, and track your affiliate links. Get clean, professional URLs and detailed click analytics to optimize your affiliate campaigns."
      placeholder="https://affiliate-network.com/product?ref=your-id&campaign=spring"
      inputLabel="Paste your affiliate link"
      generateLabel="Shorten Link"
      features={[
        "Link Cloaking",
        "Click Tracking",
        "Conversion Analytics",
        "A/B Testing Support",
        "Geo-Targeting",
        "Device Targeting",
      ]}
      howItWorks={[
        { step: "Paste Affiliate URL", desc: "Enter your long affiliate link with all tracking parameters." },
        { step: "Customize Slug", desc: "Choose a clean, memorable alias for your affiliate link." },
        { step: "Share & Earn", desc: "Use your short link and track every click and conversion." },
      ]}
      useCases={[
        "Amazon affiliate marketing",
        "Course and product recommendations",
        "Blog monetization",
        "YouTube description links",
        "Email newsletter affiliate offers",
        "Social media affiliate promotions",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "Can I cloak my affiliate links?", a: "Yes, our link masking hides your affiliate IDs from visitors while keeping the tracking intact. This protects your commissions from hijacking and creates cleaner URLs to share." },
        { q: "Do you support affiliate network tracking?", a: "We work with all major affiliate networks including Amazon Associates, ShareASale, Commission Junction, ClickBank, and Rakuten. The shortened link preserves all tracking parameters." },
        { q: "Will shortened affiliate links hurt my commissions?", a: "Not at all. Shortened links pass all UTM and tracking parameters through to your destination. Some affiliates report higher conversions because clean links build trust with their audience." },
      ]}
    />
  )
}
