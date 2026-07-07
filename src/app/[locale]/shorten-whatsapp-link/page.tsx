import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Shorten WhatsApp Link - WhatsApp URL Shortener",
    description: "Shorten URLs to share on WhatsApp cleanly and safely. Make your links compact, trackable, and trustable for WhatsApp chats and groups.",
    path: "/shorten-whatsapp-link",
    keywords: ["shorten whatsapp link", "whatsapp link shortener", "whatsapp url shortener", "short whatsapp link"],
    locale,
  })
}

export default function ShortenWhatsAppLinkPage() {
  const href = "/shorten-whatsapp-link"
  const relatedArticles = getPostsByLandingPage("/whatsapp-link-generator").slice(0, 3)
  return (
    <URLLandingPage
      title="Shorten WhatsApp Link"
      subtitle="Compact Links for Messaging"
      description="Shorten URLs before sharing on WhatsApp to keep your messages clean and professional. Short links are less likely to break formatting and appear more trustworthy in chats."
      placeholder="https://example.com/very-long-url-to-share-on-whatsapp"
      generateLabel="Shorten WhatsApp Link"
      features={[
        "WhatsApp Optimized Links",
        "Clean Message Formatting",
        "Click Tracking",
        "Custom Branded Slugs",
        "Spam Filter Safe",
        "Instant Sharing",
      ]}
      howItWorks={[
        { step: "Paste Your URL", desc: "Enter the long URL you want to share on WhatsApp." },
        { step: "Shorten Instantly", desc: "Click to generate a compact, clean short link." },
        { step: "Share on WhatsApp", desc: "Copy the short link and paste it into your WhatsApp chat or group." },
      ]}
      useCases={[
        "Share product links in WhatsApp Business broadcasts",
        "Send clean article links in group chats",
        "Promote offers and discounts via WhatsApp",
        "Share event registration links with customers",
        "Send document and file links professionally",
        "Track engagement from WhatsApp marketing campaigns",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "Why shorten links before sharing on WhatsApp?", a: "Long URLs can break message formatting, appear suspicious, and consume character space in WhatsApp messages. Shortened links stay compact, look professional, and reduce the risk of being flagged as spam." },
        { q: "Do short links work on WhatsApp Web?", a: "Yes, shortened URLs work perfectly on WhatsApp Web, WhatsApp Desktop, and the mobile app. The redirect is seamless regardless of how recipients access WhatsApp." },
        { q: "Can I customize WhatsApp short links?", a: "Yes, you can add custom slugs to your shortened WhatsApp links. Branded or descriptive slugs like relurl.com/summer-sale build trust and encourage more clicks from your audience." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
