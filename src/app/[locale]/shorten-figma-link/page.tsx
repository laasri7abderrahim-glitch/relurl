import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Shorten Figma Link",
    description: "Shorten Figma design file and prototype links instantly with RELURL. Create clean, shareable short URLs for your design projects to share with clients and stakeholders.",
    path: "/shorten-figma-link",
    keywords: ["shorten figma link", "figma url shortener", "figma link shortener", "share figma prototype"],
    locale,
  })
}

export default function Page() {
  const href = "/shorten-figma-link"
  const relatedArticles = getPostsByLandingPage("/free-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="Shorten Figma Link"
      subtitle="Share Designs Instantly"
      description="Shorten Figma design file and prototype links instantly with RELURL. Create clean, shareable short URLs for your design projects to share with clients and stakeholders."
      placeholder="Paste your Figma link here..."
      generateLabel="Shorten Figma Link"
      features={["URL Compression", "Custom Aliases", "Click Analytics", "Password Protection", "Link Expiration Control", "No Expiration"]}
      howItWorks={[
        { step: "Copy Your Figma Design URL", desc: "Open your Figma file or prototype and copy the share link from the browser." },
        { step: "Shorten the Link", desc: "Paste the Figma URL above and generate a compact, professional short link." },
        { step: "Send to Stakeholders", desc: "Share the short link with clients, developers, or stakeholders for clean and easy access." },
      ]}
      useCases={["Share Figma prototypes with clients using clean links", "Organize multiple design files with short memorable URLs", "Track how many times design links are viewed by stakeholders", "Password-protect confidential design previews", "Include Figma links in design handoff documentation"]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "Can I set expiration dates on my Figma short links?", a: "Yes, RELURL offers link expiration control so you can auto-disable design links after reviews are complete." },
        { q: "Will my Figma prototype permissions still apply?", a: "Yes, the short link redirects to your original Figma URL, so all existing permission settings remain in effect." },
        { q: "Can I customize the slug of my Figma short link?", a: "Absolutely. You can create custom aliases like relurl.co/figma-v3 for easy recall." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
