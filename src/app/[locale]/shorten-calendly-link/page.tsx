import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Shorten Calendly Link",
    description: "Shorten Calendly booking links instantly with RELURL. Create clean, professional short URLs for your scheduling pages to share with clients and prospects.",
    path: "/shorten-calendly-link",
    keywords: ["shorten calendly link", "calendly url shortener", "calendly link shortener", "short scheduling link"],
    locale,
  })
}

export default function Page() {
  const href = "/shorten-calendly-link"
  const relatedArticles = getPostsByLandingPage("/free-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="Shorten Calendly Link"
      subtitle="Clean Booking URLs"
      description="Shorten Calendly booking links instantly with RELURL. Create clean, professional short URLs for your scheduling pages to share with clients and prospects."
      placeholder="Paste your Calendly link here..."
      generateLabel="Shorten Calendly Link"
      features={["URL Compression", "Custom Branded Slugs", "Click Analytics", "Campaign Tracking", "Custom Domains", "Free Forever"]}
      howItWorks={[
        { step: "Copy Your Calendly URL", desc: "Copy your Calendly booking page link from your dashboard or browser." },
        { step: "Paste & Shorten", desc: "Paste the link above and instantly get a clean, branded short scheduling URL." },
        { step: "Add to Every Channel", desc: "Use your short link in email signatures, social bios, business cards, and marketing materials." },
      ]}
      useCases={["Add clean scheduling links to email signatures for easier booking", "Share Calendly links on social media without clutter", "Track how many prospects click your booking link", "Create branded short links for sales outreach campaigns", "Include short Calendly links in PDF portfolios and proposals"]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "Will my Calendly embed still work with a short link?", a: "Yes, the short link redirects to your Calendly page preserving all functionality including embedded scheduling." },
        { q: "Can I use my own domain for Calendly short links?", a: "Absolutely. Custom domains let you create links like book.yourcompany.com for a professional touch." },
        { q: "Can I track how many people view my Calendly page?", a: "Yes, RELURL provides detailed click analytics showing how many people access your scheduling page." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
