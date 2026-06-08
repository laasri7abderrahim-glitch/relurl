import type { Metadata } from "next"
import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "Startup Link Shortener - Launch & Growth Links",
  description: "Shorten landing pages, product hunt links, and pitch deck URLs. Track investor and user interest from every channel with RELURL.",
  path: "/startup-link-shortener",
  keywords: ["startup link shortener", "product launch links", "pitch deck link shortener"],
})

export default function StartupLinkShortenerPage() {
  const href = "/startup-link-shortener"
  return (
    <URLLandingPage
      title="Startup Link Shortener"
      subtitle="Accelerate Growth"
      description="Shorten landing pages, Product Hunt links, and pitch deck URLs. Track investor and user interest from every channel."
      placeholder="https://your-startup.com/landing/beta-signup"
      inputLabel="Enter your startup URL"
      generateLabel="Shorten URL"
      features={[
        "Landing Page Tracking",
        "Investor Link Analytics",
        "Product Hunt Optimization",
        "Beta Signup Attribution",
        "Pitch Deck Sharing",
        "Growth Metric Dashboard",
      ]}
      howItWorks={[
        { step: "Paste Startup URL", desc: "Enter your landing page, Product Hunt, or pitch link." },
        { step: "Generate Short Link", desc: "Create a memorable URL for your startup campaign." },
        { step: "Launch & Measure", desc: "Share with investors and users, then track traction." },
      ]}
      useCases={[
        "Product Hunt launch campaigns",
        "Beta signup promotion",
        "Investor pitch sharing",
        "Demo day links",
        "Press release distribution",
        "Founder social media posts",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
    />
  )
}
