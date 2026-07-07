import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Shorten Discord Invite Link - Discord URL Shortener",
    description: "Shorten Discord invite links for cleaner sharing on social media, websites, and communities. Make your Discord server invites look professional and trackable.",
    path: "/shorten-discord-invite-link",
    keywords: ["shorten discord invite link", "discord link shortener", "discord invite shortener", "short discord link"],
    locale,
  })
}

export default function ShortenDiscordInviteLinkPage() {
  const href = "/shorten-discord-invite-link"
  const relatedArticles = getPostsByLandingPage("/discord-link-generator").slice(0, 3)
  return (
    <URLLandingPage
      title="Shorten Discord Invite Link"
      subtitle="Better Server Invites"
      description="Shorten Discord invite links to share them cleanly across social media, websites, and communities. Make your server invites look professional and track engagement."
      placeholder="https://discord.gg/your-invite-code"
      generateLabel="Shorten Discord Invite"
      features={[
        "Discord Invite Compression",
        "Custom Branded Slugs",
        "Click Tracking",
        "Cross-Platform Sharing",
        "Permanent Redirect",
        "QR Code Generation",
      ]}
      howItWorks={[
        { step: "Paste Discord Invite", desc: "Copy your Discord server invite link from the invite settings." },
        { step: "Shorten and Brand", desc: "Generate a short link and add a custom slug like relurl.com/join-server." },
        { step: "Share Your Invite", desc: "Post the clean short link on social media, websites, and community platforms." },
      ]}
      useCases={[
        "Share Discord server invites on Twitter and Instagram",
        "Add Discord invite links to website headers",
        "Promote Discord communities in YouTube descriptions",
        "Track how many people click your server invites",
        "Create branded invite links for marketing campaigns",
        "Generate QR codes for Discord server promotion",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "Can I shorten existing Discord invite links?", a: "Yes, paste any Discord invite link (discord.gg/xxx or discord.com/invite/xxx) and we will create a short, redirecting link that points to your original invite." },
        { q: "Will the short link expire with my invite?", a: "The short link redirects to your original invite. If your Discord invite expires, the short link will still redirect but users will see an expired invite page. You can update the destination URL anytime without changing the short link." },
        { q: "Can I track how many people click my Discord invite?", a: "Yes, every shortened link includes click analytics. See exactly how many people clicked your invite link, where they are from, and what devices they use." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
