import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Signal Link Generator",
    description: "Generate clean, trackable Signal messaging links with RELURL. Create short URLs for Signal group invites, profile links, and message threads.",
    path: "/signal-link-generator",
    keywords: ["signal link generator", "signal url shortener", "signal message link", "signal group invite link"],
    locale,
  })
}

export default function Page() {
  const href = "/signal-link-generator"
  const relatedArticles = getPostsByLandingPage("/free-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="Signal Link Generator"
      subtitle="Messaging Links Made Easy"
      description="Generate clean, trackable Signal messaging links with RELURL. Create short URLs for Signal group invites, profile links, and message threads."
      placeholder="Paste your Signal link here..."
      generateLabel="Generate Signal"
      features={["URL Compression", "Custom Aliases", "Click Analytics", "QR Code Generation", "Social Share Buttons", "Free Forever"]}
      howItWorks={[
        { step: "Copy Your Signal Link", desc: "Copy the Signal group invite or profile link you want to share." },
        { step: "Generate Short Link", desc: "Paste it above and instantly get a clean, compact short URL ready for sharing." },
        { step: "Share Anywhere", desc: "Post your short Signal link on social media, in emails, or on your website for easy access." },
      ]}
      useCases={["Create short Signal group invite links for community promotion", "Share Signal profile links on social media bios", "Track how many people join your Signal group via shared links", "Generate QR codes for Signal group invites at events", "Include clean Signal links in newsletters and email signatures"]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "Can I customize my Signal short link alias?", a: "Yes, you can create custom aliases like relurl.co/signal-group for easy recall and sharing." },
        { q: "Will the Signal link work on mobile devices?", a: "Yes, Signal links work seamlessly on both mobile and desktop devices with proper app redirection." },
        { q: "Can I track how many people click my Signal link?", a: "Absolutely. RELURL provides click analytics so you can see engagement on your Signal invites." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
