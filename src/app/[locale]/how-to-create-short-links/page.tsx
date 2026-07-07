import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "How to Create Short Links - Complete Guide",
    description: "Learn how to create short links with custom slugs, analytics, and branding. Step-by-step guide to creating professional short URLs for any purpose.",
    path: "/how-to-create-short-links",
    keywords: ["how to create short links", "create short url", "make short link", "short link creation guide"],
    locale,
  })
}

export default function HowToCreateShortLinksPage() {
  const href = "/how-to-create-short-links"
  const relatedArticles = getPostsByLandingPage("/custom-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="How to Create Short Links"
      subtitle="Professional Link Creation Guide"
       description="Learn how to create professional short links with custom slugs, click tracking, and branded domains. Master everything from quick URL creation to advanced link management."
      placeholder="https://example.com/your-content"
      generateLabel="Create Short Link"
      features={[
        "Custom Slug Creation",
        "Branded Short Links",
        "Click Tracking Setup",
        "Bulk Link Generation",
        "QR Code Integration",
        "Link Management Tips",
      ]}
      howItWorks={[
        { step: "Choose Your URL", desc: "Select the long URL you want to transform into a short, professional link." },
        { step: "Customize Your Link", desc: "Add a custom slug that reflects your brand or content topic for better recognition." },
        { step: "Share and Monitor", desc: "Deploy your short link across channels and track its performance from your dashboard." },
      ]}
      useCases={[
        "Create branded links for your business",
        "Build custom short URLs for campaigns",
        "Generate trackable links for marketing",
        "Create memorable URLs for events",
        "Make clean links for social profiles",
        "Build organized link libraries for teams",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "What makes a good short link?", a: "A good short link is memorable, relevant to the content, and easy to type. Using custom slugs with keywords related to your content creates the most effective short links." },
        { q: "Can I create short links in bulk?", a: "Yes, RELURL supports bulk URL shortening. You can upload multiple URLs at once and generate short links for all of them, saving time on large projects." },
        { q: "How do I create branded short links?", a: "To create branded short links, add your custom domain to RELURL and configure the DNS settings. Once verified, all your short links can use your branded domain." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
