import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "URL Shortener No Ads",
    description: "Ad-free URL shortener with clean, distraction-free links. No interstitial ads, no pop-ups, no spam. Just pure, fast link redirection on the free forever plan.",
    path: "/url-shortener-no-ads",
    keywords: ["url shortener no ads", "ad free url shortener", "no ads link shortener", "clean url shortener"],
    locale,
  })
}

export default function Page() {
  const href = "/url-shortener-no-ads"
  const relatedArticles = getPostsByLandingPage("/free-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="URL Shortener No Ads"
      subtitle="Clean, Ad-Free Links"
      description="Ad-free URL shortener with clean, distraction-free links. No interstitial ads, no pop-ups, no spam. Just pure, fast link redirection on the free forever plan."
      placeholder="Paste your URL for ad-free shortening..."
      generateLabel="Ad-Free Links"
      features={["URL Compression", "Free Forever", "No Expiration", "Click Analytics", "Custom Aliases", "QR Code Generation"]}
      howItWorks={[
        { step: "Paste Your URL", desc: "Enter any long URL you want to shorten into the input field above." },
        { step: "Get Your Ad-Free Link", desc: "Click to generate a clean short link with zero ads, pop-ups, or distractions." },
        { step: "Share with Confidence", desc: "Share your ad-free link knowing your audience will go straight to your destination." },
      ]}
      useCases={["Share links on professional platforms without ad interruptions", "Send clean links in business emails and proposals", "Create ad-free short links for client presentations", "Share links in academic and research contexts", "Build trust with audiences using advertisement-free redirects"]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "Does RELURL show ads before redirecting to my link?", a: "No, RELURL never shows interstitial ads or pop-ups. Users go directly to your destination URL." },
        { q: "Is the ad-free experience available on the free plan?", a: "Yes, the free forever plan includes completely ad-free link shortening with no compromises." },
        { q: "How does RELURL make money without ads?", a: "RELURL offers premium plans with advanced features for businesses while keeping the core service free and ad-free." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
