import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Link in Bio - Short Links for Social Profiles",
    description: "Create a professional link in bio for Instagram, TikTok, and other social platforms. Manage multiple destinations from a single short link.",
    path: "/link-in-bio",
    keywords: ["link in bio", "bio link shortener", "social media bio link", "link in bio tool"],
    locale,
  })
}

export default function LinkInBioPage() {
  const href = "/link-in-bio"
  const relatedArticles = getPostsByLandingPage("/instagram-link-generator").slice(0, 3)
  return (
    <URLLandingPage
      title="Link in Bio"
      subtitle="One Link to Rule Them All"
      description="Create a single short link that directs followers to multiple destinations. Perfect for Instagram, TikTok, and other platforms that limit you to one bio link."
      placeholder="https://example.com/your-content"
      generateLabel="Create Bio Link"
      features={[
        "Single Bio Link Solution",
        "Multiple Destinations",
        "Easy Link Updates",
        "Click Analytics",
        "Custom Branded URLs",
        "Social Platform Ready",
      ]}
      howItWorks={[
        { step: "Create Your Bio Link", desc: "Shorten your primary URL or create a link that redirects to multiple destinations." },
        { step: "Update Destinations Anytime", desc: "Change where your bio link points without editing your social media profile." },
        { step: "Track Bio Link Performance", desc: "Monitor how many profile visitors click through to your destinations." },
      ]}
      useCases={[
        "Optimize your single Instagram bio link",
        "Manage TikTok bio link destinations",
        "Rotate bio links for different campaigns",
        "Track engagement from social profiles",
        "Create branded bio links for influencers",
        "Link to multiple resources from one URL",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "How is this different from a regular short link?", a: "A link-in-bio is designed specifically for social media profiles where you can only add one link. You can update the destination anytime without editing your profile." },
        { q: "Can I track how many people click my bio link?", a: "Yes, every short link includes click analytics. See exactly how many profile visitors click through to your content from Instagram, TikTok, or any other platform." },
        { q: "Do I need a separate link for each campaign?", a: "You can create multiple short links for different campaigns and swap your bio link whenever your focus changes, all without editing your social media profile." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
