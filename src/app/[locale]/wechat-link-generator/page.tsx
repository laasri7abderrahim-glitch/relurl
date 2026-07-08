import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "WeChat Link Generator",
    description: "Generate clean, trackable WeChat links with RELURL. Create short URLs for WeChat group invites, official accounts, and mini-programs to share across channels.",
    path: "/wechat-link-generator",
    keywords: ["wechat link generator", "wechat url shortener", "wechat group link", "wechat share link"],
    locale,
  })
}

export default function Page() {
  const href = "/wechat-link-generator"
  const relatedArticles = getPostsByLandingPage("/free-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="WeChat Link Generator"
      subtitle="WeChat-Ready Links"
      description="Generate clean, trackable WeChat links with RELURL. Create short URLs for WeChat group invites, official accounts, and mini-programs to share across channels."
      placeholder="Paste your WeChat link here..."
      generateLabel="Generate WeChat"
      features={["URL Compression", "Custom Aliases", "Click Analytics", "QR Code Generation", "Campaign Tracking", "No Expiration"]}
      howItWorks={[
        { step: "Copy Your WeChat URL", desc: "Copy the WeChat group invite, official account, or mini-program link you want to share." },
        { step: "Shorten & Customize", desc: "Paste the link above and generate a short, clean URL with optional custom alias." },
        { step: "Promote Your Channel", desc: "Share your WeChat short link on websites, social media, and marketing materials." },
      ]}
      useCases={["Create short WeChat group invite links for community growth", "Share WeChat official account links on websites and blogs", "Track how many users click your WeChat promotion links", "Generate QR codes for WeChat groups at in-person events", "Include clean WeChat links in cross-platform social campaigns"]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "Can I track clicks on my WeChat short links?", a: "Yes, RELURL provides detailed click analytics including geographic data and referral sources." },
        { q: "Will WeChat links work internationally with short URLs?", a: "Yes, short WeChat links work globally and redirect correctly to the WeChat app on any device." },
        { q: "Can I generate QR codes for WeChat links?", a: "Absolutely. Every shortened link on RELURL comes with a free downloadable QR code." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
