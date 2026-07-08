import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Shorten Notion Link",
    description: "Shorten Notion page and database links instantly with RELURL. Create clean, shareable short URLs for your Notion workspace pages, docs, and project trackers.",
    path: "/shorten-notion-link",
    keywords: ["shorten notion link", "notion url shortener", "notion link shortener", "share notion page"],
    locale,
  })
}

export default function Page() {
  const href = "/shorten-notion-link"
  const relatedArticles = getPostsByLandingPage("/free-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="Shorten Notion Link"
      subtitle="Simplify Your Workspace Links"
      description="Shorten Notion page and database links instantly with RELURL. Create clean, shareable short URLs for your Notion workspace pages, docs, and project trackers."
      placeholder="Paste your Notion link here..."
      generateLabel="Shorten Notion Link"
      features={["URL Compression", "Custom Aliases", "No Expiration", "Password Protection", "Team Collaboration", "Click Analytics"]}
      howItWorks={[
        { step: "Copy Your Notion Page URL", desc: "Open the Notion page, database, or doc you want to share and copy its share link." },
        { step: "Paste & Generate", desc: "Paste the Notion URL above and click to create a short, clean link." },
        { step: "Share with Your Team", desc: "Distribute the short link to colleagues, clients, or readers for easy access to your Notion content." },
      ]}
      useCases={["Share Notion docs with clients using clean professional links", "Simplify long Notion database URLs for team collaboration", "Create trackable links for Notion project trackers and roadmaps", "Share Notion portfolios and resumes with short memorable URLs", "Embed clean Notion links in documentation and wikis"]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "Can I password-protect my shortened Notion link?", a: "Yes, RELURL offers password protection so only authorized people can access your Notion pages." },
        { q: "Will the short link work if I update my Notion page permissions?", a: "Yes, once the Notion share link is valid, the shortened version will always redirect to it regardless of permission changes." },
        { q: "Can I track who clicks my Notion link?", a: "Yes, RELURL analytics show click data including device types, locations, and time of access." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
