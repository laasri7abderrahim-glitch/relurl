import { generateSEOMetadata } from "@/lib/seo"
import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"

export const metadata = generateSEOMetadata({
  title: "Facebook URL Generator - Link Shortener",
  description: "Generate short Facebook links for pages, posts, events, and groups. Create custom URLs with analytics to optimize your Facebook marketing.",
  path: "/facebook-url-generator",
  keywords: ["facebook url generator", "facebook link shortener", "facebook page link"],
})

export default function FacebookURLGeneratorPage() {
  const href = "/facebook-url-generator"
  return (
    <URLLandingPage
      title="Facebook URL Generator"
      subtitle="Optimize Your Facebook Presence"
      description="Create short, branded links for your Facebook pages, posts, events, and groups. Track engagement and optimize your Facebook marketing."
      placeholder="https://www.facebook.com/your-page-or-post"
      inputLabel="Enter your Facebook URL"
      generateLabel="Generate Link"
      features={[
        "Page Link Shortening",
        "Post Share Links",
        "Event Invitation Links",
        "Group Invite Links",
        "Click Analytics",
        "Custom Aliases",
      ]}
      howItWorks={[
        { step: "Paste Facebook URL", desc: "Enter your page, post, event, or group URL." },
        { step: "Customize Link", desc: "Choose a branded slug for your short link." },
        { step: "Share & Track", desc: "Distribute your link and monitor engagement." },
      ]}
      useCases={[
        "Facebook page promotion",
        "Event invitation sharing",
        "Group membership drives",
        "Post engagement campaigns",
        "Ad campaign tracking",
        "Cross-platform marketing",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
    />
  )
}
