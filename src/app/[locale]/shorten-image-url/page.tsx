import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Shorten Image URL - Free Image Link Shortener",
    description: "Shorten image URLs for smoother sharing on social media, forums, and messaging apps. Make your image links tidy and trackable with RELURL.",
    path: "/shorten-image-url",
    keywords: ["shorten image url", "image url shortener", "short image link", "image link shortener"],
    locale,
  })
}

export default function ShortenImageURLPage() {
  const href = "/shorten-image-url"
  const relatedArticles = getPostsByLandingPage("/custom-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="Shorten Image URL"
      subtitle="Streamline Image Sharing"
       description="Shorten image URLs to share photos, graphics, and screenshots neatly across social media, forums, and messaging platforms. Tidy links for all your images."
      placeholder="https://example.com/images/photo-2024.jpg"
      generateLabel="Shorten Image URL"
      features={[
        "Image URL Compression",
        "All Format Support",
        "Custom Branded Slugs",
        "Click Analytics",
        "Social Media Ready",
        "QR Code Generation",
      ]}
      howItWorks={[
        { step: "Paste Image URL", desc: "Copy the direct URL of the image you want to share." },
        { step: "Shorten Instantly", desc: "Generate a clean short link for your image." },
        { step: "Share Your Image", desc: "Use the short link in messages, posts, or emails." },
      ]}
      useCases={[
        "Share photos on social media with clean links",
        "Send screenshots via messaging apps",
        "Include image links in design portfolios",
        "Share graphics and memes on forums",
        "Track clicks on shared images",
        "Create QR codes linked to images",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "Can I shorten any image URL?", a: "Yes, any direct image URL can be shortened including JPG, PNG, GIF, WebP, SVG, and other common formats. The short link redirects to the original image file." },
        { q: "Does the short link preserve image embedding?", a: "The short link provides a redirect to the original image. For embedding images directly in web pages, you should use the original image URL rather than the short link." },
        { q: "Can I see how many people viewed my image?", a: "Yes, click analytics show how many times your shortened image link was accessed. This helps you understand engagement with your visual content." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
