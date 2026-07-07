import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Shorten Facebook URL - Free Facebook Link Shortener",
    description: "Shorten Facebook post, page, and event URLs for cleaner sharing. Create trackable short links for your Facebook content with RELURL.",
    path: "/shorten-facebook-url",
    keywords: ["shorten facebook url", "facebook link shortener", "facebook url shortener", "short facebook link"],
    locale,
  })
}

export default function ShortenFacebookURLPage() {
  const href = "/shorten-facebook-url"
  const relatedArticles = getPostsByLandingPage("/facebook-url-generator").slice(0, 3)
  return (
    <URLLandingPage
      title="Shorten Facebook URL"
      subtitle="Simplify Your Facebook Links"
      description="Shorten Facebook post URLs, page links, and event URLs for cleaner sharing across all platforms. Make your Facebook content more accessible and trackable."
      placeholder="https://www.facebook.com/yourpage/posts/example"
      generateLabel="Shorten Facebook URL"
      features={[
        "Facebook Link Compression",
        "Custom Slug Support",
        "Click Analytics",
        "Cross-Platform Sharing",
        "Ad Campaign Tracking",
        "QR Code Generation",
      ]}
      howItWorks={[
        { step: "Paste Facebook URL", desc: "Copy the Facebook post, page, or event URL you want to shorten." },
        { step: "Create Custom Slug", desc: "Optionally choose a descriptive slug for better brand recognition." },
        { step: "Share Anywhere", desc: "Use your short link in ads, email campaigns, or other social platforms." },
      ]}
      useCases={[
        "Shorten Facebook event links for email invitations",
        "Create trackable links for Facebook ad campaigns",
        "Share Facebook page URLs in print materials",
        "Promote Facebook posts on Twitter and LinkedIn",
        "Track clicks from Facebook to your website",
        "Add clean Facebook links to newsletters",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "Are shortened Facebook URLs safe to click?", a: "Yes, RELURL uses HTTPS redirects and never shows ads or interstitial pages. Shortened Facebook links redirect directly to the original URL safely and instantly." },
        { q: "Can I track Facebook ad link clicks?", a: "Yes, create unique short links for each Facebook ad variant. Your dashboard shows click data per link, helping you compare ad performance and optimize your campaigns." },
        { q: "Will shortened Facebook links work in Messenger?", a: "Absolutely. Shortened links work perfectly in Facebook Messenger and display link previews automatically, making them ideal for sharing content in conversations." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
