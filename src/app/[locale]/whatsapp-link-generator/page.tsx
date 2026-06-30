import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"
import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "WhatsApp Link Generator - Click to Chat Links",
    description: "Generate WhatsApp click-to-chat links. Create short URLs that open WhatsApp conversations with your phone number and pre-filled messages.",
    path: "/whatsapp-link-generator",
    keywords: ["whatsapp link generator", "whatsapp click to chat", "wa.me link"],
    locale,
  })
}

export default function WhatsAppLinkGeneratorPage() {
  const href = "/whatsapp-link-generator"
  const relatedArticles = getPostsByLandingPage("/whatsapp-link-generator").slice(0, 3)
  return (
    <URLLandingPage
      title="WhatsApp Link Generator"
      subtitle="Start WhatsApp Conversations Instantly"
      description="Create short, scannable links that open WhatsApp chat with your phone number and a pre-filled message. Perfect for customer support and marketing."
      placeholder="https://example.com/your-page"
      inputLabel="Enter your website or landing page URL"
      generateLabel="Generate Link"
      features={[
        "Click-to-Chat Links",
        "Pre-filled Messages",
        "Phone Number Support",
        "Custom Messages",
        "QR Code Ready",
        "Analytics Tracking",
      ]}
      howItWorks={[
        { step: "Enter URL", desc: "Paste the URL you want to share via WhatsApp." },
        { step: "Generate Link", desc: "Create a short link that redirects to WhatsApp." },
        { step: "Share Anywhere", desc: "Use your link in emails, social media, or print." },
      ]}
      useCases={[
        "Customer support chat links",
        "Sales inquiry channels",
        "Order confirmation links",
        "Event RSVP via WhatsApp",
        "Marketing campaign CTAs",
        "Website contact buttons",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}

      relatedArticles={relatedArticles}
    />
  )
}