import { generateSEOMetadata } from "@/lib/seo"
import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"

export const metadata = generateSEOMetadata({
  title: "TikTok Bio Link Generator - Link in Bio",
  description: "Create the perfect TikTok bio link. Generate a short, branded URL for your TikTok profile that drives traffic to all your content platforms.",
  path: "/tiktok-bio-link-generator",
  keywords: ["tiktok bio link", "tiktok link generator", "link in bio tiktok"],
})

export default function TikTokBioLinkGeneratorPage() {
  const href = "/tiktok-bio-link-generator"
  return (
    <URLLandingPage
      title="TikTok Bio Link Generator"
      subtitle="Maximize Your TikTok Traffic"
      description="TikTok only allows one link in your bio. Make it count with a short, branded URL that drives traffic to all your content and platforms."
      placeholder="https://example.com/your-link-in-bio"
      inputLabel="Enter your link-in-bio URL"
      generateLabel="Generate Link"
      features={[
        "One-Link Optimization",
        "Mobile-First Design",
        "Click Tracking",
        "Custom Aliases",
        "Multiple Destinations",
        "QR Code for Videos",
      ]}
      howItWorks={[
        { step: "Enter Your URL", desc: "Paste your link-in-bio or landing page URL." },
        { step: "Create Short Link", desc: "Generate a clean, memorable short URL." },
        { step: "Add to TikTok Bio", desc: "Paste your short link in your TikTok profile." },
      ]}
      useCases={[
        "TikTok bio link optimization",
        "Product link sharing",
        "YouTube channel promotion",
        "Merchandise store links",
        "Event registration",
        "Cross-platform promotion",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
    />
  )
}
