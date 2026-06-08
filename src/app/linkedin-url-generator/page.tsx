import { generateSEOMetadata } from "@/lib/seo"
import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"

export const metadata = generateSEOMetadata({
  title: "LinkedIn URL Generator - Professional Links",
  description: "Generate short LinkedIn links for profiles, company pages, posts, and job listings. Track engagement and optimize your B2B marketing efforts.",
  path: "/linkedin-url-generator",
  keywords: ["linkedin url generator", "linkedin link shortener", "linkedin profile link"],
})

export default function LinkedInURLGeneratorPage() {
  const href = "/linkedin-url-generator"
  return (
    <URLLandingPage
      title="LinkedIn URL Generator"
      subtitle="Professional Link Management"
      description="Create short, professional links for your LinkedIn profile, company page, posts, and job listings. Track engagement and optimize your B2B marketing."
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
    />
  )
}
