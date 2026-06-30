import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Nonprofit Link Shortener - Donation & Campaign Links",
    description: "Create short links for donation pages, volunteer signups, and awareness campaigns. Track supporter engagement with RELURL.",
    path: "/nonprofit-link-shortener",
    keywords: ["nonprofit link shortener", "donation link generator", "charity links"],
    locale,
  })
}

export default function NonprofitLinkShortenerPage() {
  const href = "/nonprofit-link-shortener"
  const relatedArticles = getPostsByLandingPage("/nonprofit-link-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="Nonprofit Link Shortener"
      subtitle="Amplify Your Cause"
      description="Create short links for donation pages, volunteer signups, and awareness campaigns. Track supporter engagement and maximize impact."
      placeholder="https://charity.org/donate/annual-fund"
      inputLabel="Enter your campaign URL"
      generateLabel="Shorten URL"
      features={[
        "Donation Page Tracking",
        "Volunteer Signup Analytics",
        "Campaign Attribution",
        "Event Registration Links",
        "Social Media Optimized",
        "Recurring Giving Links",
      ]}
      howItWorks={[
        { step: "Paste Campaign URL", desc: "Enter your donation, volunteer, or campaign page link." },
        { step: "Create Short Link", desc: "Generate a simple, shareable URL for supporters." },
        { step: "Share & Track", desc: "Distribute across channels and measure supporter engagement." },
      ]}
      useCases={[
        "Fundraising campaign promotion",
        "Volunteer recruitment",
        "Awareness campaign links",
        "Event registration",
        "Newsletter donation calls",
        "Social media appeals",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}

      relatedArticles={relatedArticles}
    />
  )
}