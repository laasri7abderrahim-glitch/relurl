import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "URL Shortener No Signup",
    description: "Shorten URLs instantly with no signup required. Use RELURL's free URL shortener without creating an account. Fast, private, and no registration needed.",
    path: "/url-shortener-no-signup",
    keywords: ["url shortener no signup", "shorten url without signup", "no registration url shortener", "instant url shortener"],
    locale,
  })
}

export default function Page() {
  const href = "/url-shortener-no-signup"
  const relatedArticles = getPostsByLandingPage("/free-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="URL Shortener No Signup"
      subtitle="Shorten Instantly"
      description="Shorten URLs instantly with no signup required. Use RELURL's free URL shortener without creating an account. Fast, private, and no registration needed."
      placeholder="Paste your long URL..."
      generateLabel="Shorten Now"
      features={["URL Compression", "No Expiration", "Free Forever", "Click Analytics", "QR Code Generation", "Custom Aliases"]}
      howItWorks={[
        { step: "Paste Your Long URL", desc: "Copy any long URL and paste it into the input field above. No account needed." },
        { step: "Shorten Instantly", desc: "Click the button and get a compact short URL immediately with zero registration friction." },
        { step: "Share Your Link", desc: "Copy your new short link and share it anywhere. Simple as that." },
      ]}
      useCases={["Shorten a link quickly without creating an account", "Share URLs privately without saving history", "Get a short link for a one-time use case", "Test URL shortening before committing to a platform", "Create disposable short links for temporary campaigns"]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "Do I really not need to sign up?", a: "Correct. You can shorten URLs instantly with no account, no email, and no registration required." },
        { q: "Will my shortened link expire?", a: "No, RELURL links never expire even without an account. Your short link will work forever." },
        { q: "Can I still track clicks without signing up?", a: "Basic click tracking is available. For detailed analytics, you can create a free account to access full reporting." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
