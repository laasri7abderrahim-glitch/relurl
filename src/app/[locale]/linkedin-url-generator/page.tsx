import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"
import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "LinkedIn URL Generator - Professional Links",
    description: "Generate short LinkedIn links for profiles, company pages, posts, and job listings. Monitor clicks and refine your B2B marketing strategy.",
    path: "/linkedin-url-generator",
    keywords: ["linkedin url generator", "linkedin link shortener", "linkedin profile link"],
    locale,
  })
}

export default function LinkedInURLGeneratorPage() {
  const href = "/linkedin-url-generator"
  const relatedArticles = getPostsByLandingPage("/linkedin-url-generator").slice(0, 3)
  return (
    <URLLandingPage
      title="LinkedIn URL Generator"
      subtitle="Professional Link Management"
       description="Create short, professional links for your LinkedIn profile, company page, posts, and job listings. Measure clicks and improve your B2B marketing reach."
      placeholder="https://www.linkedin.com/in/your-profile-or-company"
      inputLabel="Enter your LinkedIn URL"
      generateLabel="Generate Link"
      features={[
        "Profile Link Shortening",
        "Company Page Links",
        "Post Share Links",
        "Job Listing Links",
        "B2B Analytics",
        "Custom Aliases",
      ]}
      howItWorks={[
        { step: "Paste LinkedIn URL", desc: "Enter your profile, company, or post URL." },
        { step: "Customize Slug", desc: "Choose a professional, branded alias." },
        { step: "Share & Track", desc: "Distribute your link and measure engagement." },
      ]}
      useCases={[
        "LinkedIn profile promotion",
        "Job posting distribution",
        "Company page marketing",
        "Content sharing campaigns",
        "B2B lead generation",
        "Professional networking",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}

      relatedArticles={relatedArticles}
    />
  )
}