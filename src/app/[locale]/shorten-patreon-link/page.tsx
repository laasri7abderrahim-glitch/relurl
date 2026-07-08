import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Shorten Patreon Link",
    description: "Shorten Patreon creator and membership links instantly with RELURL. Create clean, trackable short URLs for your Patreon page to grow your subscriber base.",
    path: "/shorten-patreon-link",
    keywords: ["shorten patreon link", "patreon url shortener", "patreon link shortener", "promote patreon"],
    locale,
  })
}

export default function Page() {
  const href = "/shorten-patreon-link"
  const relatedArticles = getPostsByLandingPage("/free-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="Shorten Patreon Link"
      subtitle="Promote Your Membership"
      description="Shorten Patreon creator and membership links instantly with RELURL. Create clean, trackable short URLs for your Patreon page to grow your subscriber base."
      placeholder="Paste your Patreon link here..."
      generateLabel="Shorten Patreon Link"
      features={["URL Compression", "Custom Aliases", "Click Analytics", "Social Share Buttons", "Campaign Tracking", "QR Code Generation"]}
      howItWorks={[
        { step: "Copy Your Patreon URL", desc: "Copy your Patreon creator page or membership tier link from your browser." },
        { step: "Shorten & Customize", desc: "Paste the link above and optionally create a custom alias for your Patreon short URL." },
        { step: "Promote Everywhere", desc: "Share your clean Patreon link on YouTube, Twitter, Instagram, and all your content channels." },
      ]}
      useCases={["Add a clean Patreon link to your YouTube video descriptions", "Share your membership page on social media without long URLs", "Track which platforms drive the most Patreon sign-ups", "Create QR codes for Patreon links on merchandise and posters", "Include a short Patreon link in email newsletter campaigns"]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "Will my Patreon branding still show with a short link?", a: "Yes, all Patreon metadata and branding are preserved when using RELURL short links." },
        { q: "Can I see which social platform sends the most Patreon traffic?", a: "Absolutely. RELURL analytics show referrer data so you can optimize your promotion strategy." },
        { q: "Can I generate a QR code for my Patreon short link?", a: "Yes, every shortened link automatically comes with a downloadable QR code for offline promotion." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
