import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Pinterest Link Generator - Pin & Board Links",
    description: "Create short links for Pinterest pins and boards to drive visual traffic. Optimize your pin marketing strategy with RELURL click analytics.",
    path: "/pinterest-link-generator",
    keywords: ["pinterest link generator", "pinterest pin links", "pinterest marketing"],
    locale,
  })
}

export default function PinterestLinkGeneratorPage() {
  const href = "/pinterest-link-generator"
  const relatedArticles = getPostsByLandingPage("/pinterest-link-generator").slice(0, 3)
  return (
    <URLLandingPage
      title="Pinterest Link Generator"
      subtitle="Boost Pinterest Engagement"
       description="Create short links for Pinterest pins and boards to boost visual traffic. Optimize your pin marketing and drive more visitors to your site."
      placeholder="https://your-site.com/your-pinterest-worthy-content"
      inputLabel="Enter your destination URL"
      generateLabel="Generate Link"
      features={[
        "Pin Click Tracking",
        "Board Link Analytics",
        "Rich Pin Optimization",
        "Custom Aliases",
        "Seasonal Campaign Support",
        "Visual Content Attribution",
      ]}
      howItWorks={[
        { step: "Paste Your URL", desc: "Enter the page you want to link from Pinterest." },
        { step: "Customize Slug", desc: "Choose a descriptive alias that complements your pin." },
        { step: "Add to Pin", desc: "Use your short link in pins and board descriptions." },
      ]}
      useCases={[
        "Product pin links",
        "Blog post promotion via Pinterest",
        "DIY tutorial traffic",
        "Recipe and food blog links",
        "Fashion and lifestyle pins",
        "Seasonal campaign promotion",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}

      relatedArticles={relatedArticles}
    />
  )
}