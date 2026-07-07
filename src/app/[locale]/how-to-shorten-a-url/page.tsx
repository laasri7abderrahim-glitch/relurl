import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "How to Shorten a URL - Step by Step Guide",
    description: "Learn how to shorten a URL in seconds. Follow our step-by-step guide to create compact, shareable links for social media, email, and campaigns.",
    path: "/how-to-shorten-a-url",
    keywords: ["how to shorten a url", "shorten url guide", "create short link", "url shortening tutorial"],
    locale,
  })
}

export default function HowToShortenAURLPage() {
  const href = "/how-to-shorten-a-url"
  const relatedArticles = getPostsByLandingPage("/free-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="How to Shorten a URL"
      subtitle="Complete Step-by-Step Guide"
       description="Learn how to shorten a URL quickly and easily. This guide covers simple link shortening alongside advanced tools like custom slugs, analytics, and QR codes."
      placeholder="https://example.com/very-long-url-that-you-want-to-shorten"
      generateLabel="Shorten This URL"
      features={[
        "Quick URL Shortening",
        "Custom Alias Creation",
        "Click Analytics Setup",
        "QR Code Generation",
        "Branded Link Options",
        "Bulk Shortening Tools",
      ]}
      howItWorks={[
        { step: "Copy Your URL", desc: "Copy the long URL you want to shorten from your browser's address bar or分享 dialog." },
        { step: "Paste and Shorten", desc: "Paste the URL into the tool above and click the shorten button. Your short link will appear instantly." },
        { step: "Share Your Short Link", desc: "Copy your new short link and share it anywhere. Use custom slugs and track clicks for better results." },
      ]}
      useCases={[
        "Shorten links for social media posts",
        "Create clean URLs for email campaigns",
        "Make memorable links for print materials",
        "Track engagement on shared content",
        "Generate short links for messaging apps",
        "Create branded links for marketing",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "How long does it take to shorten a URL?", a: "Shortening a URL with RELURL takes less than a second. Paste your link and click the button to get an instant short URL." },
        { q: "Do I need an account to shorten URLs?", a: "You can shorten URLs instantly without an account. Creating a free account lets you save your links, add custom slugs, and access analytics." },
        { q: "Can I customize my shortened URL?", a: "Yes, you can add custom slugs to your shortened URLs to make them more memorable and brandable. Custom slugs are available on all plans including free." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
