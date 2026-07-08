import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Shorten Substack Link",
    description: "Shorten Substack newsletter and article links instantly with RELURL. Create clean, trackable short URLs for your Substack publication to grow your subscriber base.",
    path: "/shorten-substack-link",
    keywords: ["shorten substack link", "substack url shortener", "substack link shortener", "promote substack"],
    locale,
  })
}

export default function Page() {
  const href = "/shorten-substack-link"
  const relatedArticles = getPostsByLandingPage("/free-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="Shorten Substack Link"
      subtitle="Share Your Newsletter"
      description="Shorten Substack newsletter and article links instantly with RELURL. Create clean, trackable short URLs for your Substack publication to grow your subscriber base."
      placeholder="Paste your Substack link here..."
      generateLabel="Shorten Substack Link"
      features={["URL Compression", "Custom Aliases", "Click Analytics", "Campaign Tracking", "Social Share Buttons", "Free Forever"]}
      howItWorks={[
        { step: "Copy Your Substack Article URL", desc: "Copy your Substack newsletter or article link from your publication dashboard." },
        { step: "Paste & Shorten", desc: "Paste the link above and we'll create a compact short URL ready to share." },
        { step: "Grow Your Audience", desc: "Share your short link on Twitter, LinkedIn, and other platforms to drive more subscribers." },
      ]}
      useCases={["Share Substack articles on Twitter/X with clean character-saving links", "Track click-through rates on cross-platform newsletter promotion", "Add short Substack links to your bio on multiple social networks", "Create trackable links for subscriber referral campaigns", "Organize multiple article links for media kits and press pages"]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "Will my Substack article preview card appear with a short link?", a: "Yes, RELURL preserves social preview metadata so your article preview shows correctly on all platforms." },
        { q: "Can I see which platform sends the most readers?", a: "Absolutely. RELURL analytics show referrer information so you can optimize your promotion strategy." },
        { q: "Can I create custom aliases for my Substack short links?", a: "Yes, you can customize every short link slug to match your branding or article topic." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
