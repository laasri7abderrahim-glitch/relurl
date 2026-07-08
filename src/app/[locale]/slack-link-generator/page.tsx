import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Slack Link Generator",
    description: "Generate clean, trackable Slack links with RELURL. Create short URLs for Slack invite links, channels, messages, and workspaces for easier team sharing.",
    path: "/slack-link-generator",
    keywords: ["slack link generator", "slack url shortener", "slack invite link", "slack channel link shortener"],
    locale,
  })
}

export default function Page() {
  const href = "/slack-link-generator"
  const relatedArticles = getPostsByLandingPage("/free-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="Slack Link Generator"
      subtitle="Team Communication Links"
      description="Generate clean, trackable Slack links with RELURL. Create short URLs for Slack invite links, channels, messages, and workspaces for easier team sharing."
      placeholder="Paste your Slack link here..."
      generateLabel="Generate Slack"
      features={["URL Compression", "Custom Aliases", "Click Analytics", "Team Collaboration", "Password Protection", "Link Expiration Control"]}
      howItWorks={[
        { step: "Copy Your Slack URL", desc: "Copy the Slack channel, message, workspace invite, or thread link you want to shorten." },
        { step: "Generate Short Link", desc: "Paste it above and get a compact short link that's easy to share with your team." },
        { step: "Share Across Teams", desc: "Distribute your Slack short link in emails, docs, and communication channels for quick access." },
      ]}
      useCases={["Create short Slack invite links for community onboarding", "Share Slack channel links in documentation and wikis", "Track how many team members access shared Slack resources", "Password-protect sensitive Slack workspace invite links", "Set expiration dates on temporary Slack channel access links"]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "Can I password-protect my Slack invite link?", a: "Yes, RELURL offers password protection so only authorized people can access your Slack workspace invites." },
        { q: "Can I set an expiration on my Slack short link?", a: "Absolutely. Link expiration control lets you auto-disable Slack invite links after a set time." },
        { q: "Will the short link work in the Slack app?", a: "Yes, the short link redirects correctly whether opened in the Slack app or a web browser." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
