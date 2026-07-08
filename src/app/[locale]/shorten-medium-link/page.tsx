import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Shorten Medium Link",
    description: "Shorten Medium article links instantly with RELURL. Create clean, trackable short URLs for your stories and publications to share on social media, newsletters, and more.",
    path: "/shorten-medium-link",
    keywords: ["shorten medium link", "medium url shortener", "medium article link shortener"],
    locale,
  })
}

export default function Page() {
  const href = "/shorten-medium-link"
  const relatedArticles = getPostsByLandingPage("/free-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="Shorten Medium Link"
      subtitle="Share Your Stories Better"
      description="Shorten Medium article links instantly with RELURL. Create clean, trackable short URLs for your stories and publications to share on social media, newsletters, and cross-platform promotion."
      placeholder="Paste your Medium link here..."
      generateLabel="Shorten Medium Link"
      features={["URL Compression", "Custom Aliases", "Click Analytics", "Social Share Buttons", "Campaign Tracking", "Free Forever"]}
      howItWorks={[
        { step: "Copy Your Medium Article URL", desc: "Open your Medium story and copy the full article link from the browser address bar." },
        { step: "Shorten It", desc: "Paste the link above and we'll compress it into a clean, shareable short URL." },
        { step: "Promote Across Channels", desc: "Use your new short link on Twitter, LinkedIn, email newsletters, and anywhere else you share your writing." },
      ]}
      useCases={["Share Medium articles on Twitter/X with character-saving links", "Include clean URLs in your email newsletter for better engagement", "Track how many readers click through from different platforms", "Promote your Medium publication with branded short links", "Add trackable links to your Medium bio and social profiles"]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "Will my Medium article's preview card still show with a short link?", a: "Yes, RELURL preserves social preview metadata so your article preview card appears on Twitter, LinkedIn, and other platforms." },
        { q: "Can I see how many people clicked my Medium short link?", a: "Absolutely. RELURL shows real-time click counts, geographic data, and referral sources for every link." },
        { q: "Do shortened Medium links expire?", a: "No, RELURL links never expire. Your Medium short links will work forever." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
