import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Shorten Spotify Link",
    description: "Shorten Spotify song, album, artist, and playlist links instantly with RELURL. Create clean, trackable short links for your Spotify content to share on social media, in messages, or on your website.",
    path: "/shorten-spotify-link",
    keywords: ["shorten spotify link", "spotify url shortener", "short spotify link"],
    locale,
  })
}

export default function Page() {
  const href = "/shorten-spotify-link"
  const relatedArticles = getPostsByLandingPage("/free-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="Shorten Spotify Link"
      subtitle="Streamline Your Music Links"
      description="Shorten Spotify song, album, artist, and playlist links instantly with RELURL. Create clean, trackable short links for your Spotify content to share on social media, in messages, or on your website."
      placeholder="Paste your Spotify link here..."
      generateLabel="Shorten Spotify Link"
      features={["URL Compression", "Custom Branded Slugs", "Click Analytics", "QR Code Generation", "Link Expiration Control", "Free Forever"]}
      howItWorks={[
        { step: "Paste Your Spotify URL", desc: "Copy any Spotify song, album, artist, or playlist link and paste it into the input field above." },
        { step: "Generate Your Short Link", desc: "Click shorten and we'll instantly create a compact, trackable short URL for your Spotify content." },
        { step: "Share & Track Engagement", desc: "Share your new short link anywhere and monitor clicks, geography, and devices in real time." },
      ]}
      useCases={["Share Spotify playlists on social media with clean links", "Promote podcast episodes on Spotify with trackable URLs", "Track clicks on artist profile links across campaigns", "Share album releases with fans via email and messaging", "Include Spotify links in newsletters without clutter"]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "Can I customize my shortened Spotify link?", a: "Yes, RELURL lets you create custom aliases for your Spotify links so they're memorable and on-brand." },
        { q: "Will my shortened Spotify link stop working?", a: "No, RELURL links never expire. Your Spotify short link will work forever, even on the free plan." },
        { q: "Can I track clicks on my Spotify links?", a: "Absolutely. RELURL provides detailed analytics including click count, geographic data, device types, and referrer information for every shortened link." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
