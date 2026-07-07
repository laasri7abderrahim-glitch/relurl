import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Shorten GitHub URL - GitHub Link Shortener",
    description: "Shorten GitHub repository, issue, and profile URLs for cleaner sharing. Make your GitHub links compact and shareable across developer communities.",
    path: "/shorten-github-url",
    keywords: ["shorten github url", "github link shortener", "github url shortener", "short github link"],
    locale,
  })
}

export default function ShortenGitHubURLPage() {
  const href = "/shorten-github-url"
  const relatedArticles = getPostsByLandingPage("/custom-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="Shorten GitHub URL"
      subtitle="Simplify Your Dev Links"
      description="Shorten GitHub repository URLs, issue links, profile URLs, and gist links for cleaner sharing on social media, documentation, and developer communities."
      placeholder="https://github.com/username/repository-name"
      generateLabel="Shorten GitHub URL"
      features={[
        "GitHub URL Compression",
        "Repo Link Shortening",
        "Issue/PR Link Ready",
        "Custom Branded Slugs",
        "Click Analytics",
        "QR Code Generation",
      ]}
      howItWorks={[
        { step: "Paste GitHub URL", desc: "Copy the GitHub repository, issue, or profile URL." },
        { step: "Shorten Instantly", desc: "Generate a clean, compact short link for your GitHub content." },
        { step: "Share with Devs", desc: "Share your link on Twitter, Slack, Discord, or in documentation." },
      ]}
      useCases={[
        "Share GitHub repo links in tweets and posts",
        "Add short repo links to project documentation",
        "Share issue and PR links in team chats",
        "Include GitHub profile links in resumes",
        "Promote open source projects on social media",
        "Create trackable links for GitHub Pages",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "Can I shorten GitHub repository URLs?", a: "Yes, any GitHub URL can be shortened including repositories, issues, pull requests, profiles, organizations, gists, and GitHub Pages URLs." },
        { q: "Will the short link break if the repo is renamed?", a: "The short link redirects to the GitHub URL you provided. If the repository is renamed, the short link will still redirect but GitHub will redirect the old URL to the new one." },
        { q: "Can I track clicks on my GitHub project links?", a: "Yes, every shortened link includes click analytics. Track how many people click your repository link from different platforms to understand which channels drive the most traffic to your project." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
