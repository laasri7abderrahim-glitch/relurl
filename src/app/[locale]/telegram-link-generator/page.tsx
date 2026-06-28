import { generateSEOMetadata } from "@/lib/seo"
import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"

export const metadata = generateSEOMetadata({
  title: "Telegram Link Generator - Share Telegram Links",
  description: "Generate short Telegram links for channels, groups, and bots. Create custom t.me URLs with analytics to grow your Telegram community.",
  path: "/telegram-link-generator",
  keywords: ["telegram link generator", "t.me link", "telegram group link"],
})

export default function TelegramLinkGeneratorPage() {
  const href = "/telegram-link-generator"
  return (
    <URLLandingPage
      title="Telegram Link Generator"
      subtitle="Grow Your Telegram Community"
      description="Create short, memorable links for your Telegram channels, groups, and bots. Track clicks and grow your Telegram audience."
      placeholder="https://example.com/your-telegram-content"
      inputLabel="Enter your Telegram URL or content link"
      generateLabel="Generate Link"
      features={[
        "Channel Invite Links",
        "Group Join Links",
        "Bot Start Links",
        "Custom Aliases",
        "Click Analytics",
        "QR Code Support",
      ]}
      howItWorks={[
        { step: "Enter Telegram URL", desc: "Paste your t.me link or content URL." },
        { step: "Customize Slug", desc: "Choose a short, memorable alias." },
        { step: "Share & Track", desc: "Distribute your link and monitor engagement." },
      ]}
      useCases={[
        "Telegram channel promotion",
        "Group membership drives",
        "Bot user acquisition",
        "Content sharing",
        "Community building",
        "Marketing campaigns",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
    />
  )
}
