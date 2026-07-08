import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Shorten Airbnb Link",
    description: "Shorten Airbnb listing and wishlist links instantly with RELURL. Create clean, shareable short URLs for your property listings to attract more guests.",
    path: "/shorten-airbnb-link",
    keywords: ["shorten airbnb link", "airbnb url shortener", "airbnb listing link shortener", "share airbnb listing"],
    locale,
  })
}

export default function Page() {
  const href = "/shorten-airbnb-link"
  const relatedArticles = getPostsByLandingPage("/free-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="Shorten Airbnb Link"
      subtitle="Share Listings Cleanly"
      description="Shorten Airbnb listing and wishlist links instantly with RELURL. Create clean, shareable short URLs for your property listings to attract more guests."
      placeholder="Paste your Airbnb link here..."
      generateLabel="Shorten Airbnb Link"
      features={["URL Compression", "Custom Aliases", "Click Analytics", "Social Share Buttons", "Campaign Tracking", "No Expiration"]}
      howItWorks={[
        { step: "Copy Your Airbnb Listing URL", desc: "Copy the link of any Airbnb property listing or wishlist from your browser." },
        { step: "Shorten It", desc: "Paste the URL above and instantly get a clean, compact short link." },
        { step: "Share with Guests", desc: "Post your short link on social media, in messages, or on travel forums to attract bookings." },
      ]}
      useCases={["Share Airbnb listings on Instagram Stories with clean links", "Track clicks on property links shared across travel forums", "Create short links for Airbnb wishlists to share with friends", "Include clean listing URLs in email marketing for property managers", "Organize multiple property links with custom aliases per listing"]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "Will the Airbnb booking flow work normally with a short link?", a: "Yes, the short link redirects seamlessly to your Airbnb listing and the full booking experience is preserved." },
        { q: "Can I customize the alias for each Airbnb property?", a: "Absolutely. Create aliases like relurl.co/beach-house or relurl.co/downtown-loft for each listing." },
        { q: "Can I track how many people view my Airbnb listing link?", a: "Yes, RELURL provides click analytics so you can measure interest in each property." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
