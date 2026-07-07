import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Shorten LinkedIn URL - LinkedIn Link Shortener",
    description: "Shorten LinkedIn profile, post, and company page URLs for professional sharing. Create clean, trackable links for your LinkedIn content.",
    path: "/shorten-linkedin-url",
    keywords: ["shorten linkedin url", "linkedin link shortener", "linkedin url shortener", "short linkedin link"],
    locale,
  })
}

export default function ShortenLinkedInURLPage() {
  const href = "/shorten-linkedin-url"
  const relatedArticles = getPostsByLandingPage("/linkedin-url-generator").slice(0, 3)
  return (
    <URLLandingPage
      title="Shorten LinkedIn URL"
      subtitle="Professional Link Management"
      description="Shorten LinkedIn profile URLs, post links, and company page URLs for sharing across your professional network. Clean links look more professional in messages and posts."
      placeholder="https://www.linkedin.com/in/yourprofile"
      generateLabel="Shorten LinkedIn URL"
      features={[
        "LinkedIn URL Compression",
        "Profile Link Shortening",
        "Post Link Tracking",
        "Custom Aliases",
        "Professional Appearance",
        "QR Code Ready",
      ]}
      howItWorks={[
        { step: "Paste LinkedIn URL", desc: "Copy the LinkedIn profile, post, or company page URL." },
        { step: "Shorten and Customize", desc: "Generate a short link and optionally add a custom slug." },
        { step: "Share Professionally", desc: "Use your clean short link in emails, resumes, and presentations." },
      ]}
      useCases={[
        "Add clean LinkedIn profile links to email signatures",
        "Share LinkedIn articles on Twitter and other platforms",
        "Track clicks on LinkedIn posts shared externally",
        "Include LinkedIn company page links in newsletters",
        "Share job posting URLs in recruitment campaigns",
        "Promote LinkedIn content in professional presentations",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "Can I shorten LinkedIn profile URLs?", a: "Yes, you can shorten any LinkedIn URL including personal profiles, company pages, posts, articles, and job listings. The short link redirects to the original LinkedIn page." },
        { q: "Do short links look professional on LinkedIn?", a: "Shortened URLs with custom slugs look clean and professional. Instead of a long LinkedIn URL with parameters, you can share relurl.com/your-profile for a polished appearance." },
        { q: "Can I track clicks on shared LinkedIn links?", a: "Yes, every shortened link includes click analytics. Track how many people click your LinkedIn profile link from your email signature or how many views your shared LinkedIn article generates." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
