import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Discord Link Generator - Server & Community Links",
    description: "Generate short links for Discord servers, channels, and events. Grow your community and track member engagement with RELURL.",
    path: "/discord-link-generator",
    keywords: ["discord link generator", "discord server links", "discord community links"],
    locale,
  })
}

export default function DiscordLinkGeneratorPage() {
  const href = "/discord-link-generator"
  const relatedArticles = getPostsByLandingPage("/discord-link-generator").slice(0, 3)
  return (
    <URLLandingPage
      title="Discord Link Generator"
      subtitle="Grow Your Server"
      description="Generate short links for Discord servers, channels, and events. Grow your community and track member engagement from every source."
      placeholder="https://discord.gg/your-server-invite"
      inputLabel="Enter your Discord URL"
      generateLabel="Generate Link"
      features={[
        "Server Invite Tracking",
        "Channel Link Analytics",
        "Event Promotion Links",
        "Bot Dashboard Links",
        "Custom Branded Invites",
        "Member Source Attribution",
      ]}
      howItWorks={[
        { step: "Paste Discord URL", desc: "Enter your server invite, channel, or event link." },
        { step: "Create Short Link", desc: "Generate a memorable URL for your community." },
        { step: "Share & Grow", desc: "Post across platforms and track where members come from." },
      ]}
      useCases={[
        "Server invite sharing",
        "Event promotion campaigns",
        "Content creator community building",
        "Gaming clan recruitment",
        "Community partner links",
        "Cross-platform growth",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}

      relatedArticles={relatedArticles}
    />
  )
}