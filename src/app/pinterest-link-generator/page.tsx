import type { Metadata } from "next"
import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "Pinterest Link Generator - Pin & Board Links",
  description: "Generate short, trackable links for Pinterest pins and boards. Optimize your Pinterest marketing strategy with RELURL analytics.",
  path: "/pinterest-link-generator",
  keywords: ["pinterest link generator", "pinterest pin links", "pinterest marketing"],
})

export default function PinterestLinkGeneratorPage() {
  const href = "/pinterest-link-generator"
  return (
    <URLLandingPage
      title="Pinterest Link Generator"
      subtitle="Boost Pinterest Engagement"
      description="Generate short, trackable links for Pinterest pins and boards. Optimize your Pinterest marketing and drive more traffic to your site."
      placeholder="https://your-site.com/your-pinterest-worthy-content"
      inputLabel="Enter your destination URL"
      generateLabel="Generate Link"
      features={[
        "Pin Click Tracking",
        "Board Link Analytics",
        "Rich Pin Optimization",
        "Custom Aliases",
        "Seasonal Campaign Support",
        "Visual Content Attribution",
      ]}
      howItWorks={[
        { step: "Paste Your URL", desc: "Enter the page you want to link from Pinterest." },
        { step: "Customize Slug", desc: "Choose a descriptive alias that complements your pin." },
        { step: "Add to Pin", desc: "Use your short link in pins and board descriptions." },
      ]}
      useCases={[
        "Product pin links",
        "Blog post promotion via Pinterest",
        "DIY tutorial traffic",
        "Recipe and food blog links",
        "Fashion and lifestyle pins",
        "Seasonal campaign promotion",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
    />
  )
}
