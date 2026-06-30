import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Photography Link Shortener - Portfolio & Gallery Links",
    description: "Shorten portfolio, gallery, and booking links for photographers. Showcase your work and track client interest with RELURL.",
    path: "/photography-link-shortener",
    keywords: ["photography link shortener", "portfolio link generator", "photographer marketing"],
    locale,
  })
}

export default function PhotographyLinkShortenerPage() {
  const href = "/photography-link-shortener"
  const relatedArticles = getPostsByLandingPage("/photography-link-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="Photography Link Shortener"
      subtitle="Showcase Your Work"
      description="Shorten portfolio, gallery, and booking links. Showcase your photography work and track client interest from every channel."
      placeholder="https://portfolio.photographer.com/weddings/2024"
      inputLabel="Enter your portfolio URL"
      generateLabel="Shorten URL"
      features={[
        "Portfolio Link Tracking",
        "Gallery Shortening",
        "Booking Page Analytics",
        "Client Proofing Links",
        "Session Type Links",
        "Print Shop Integration",
      ]}
      howItWorks={[
        { step: "Paste Portfolio URL", desc: "Enter your gallery, portfolio, or booking page link." },
        { step: "Create Short Link", desc: "Generate a clean, professional URL for your brand." },
        { step: "Share & Book More", desc: "Share on social media, business cards, and track inquiries." },
      ]}
      useCases={[
        "Wedding portfolio sharing",
        "Client proofing galleries",
        "Booking page promotion",
        "Print shop links",
        "Workshop registration",
        "Social media portfolio posts",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}

      relatedArticles={relatedArticles}
    />
  )
}