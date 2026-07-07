import { generateSEOMetadata } from "@/lib/seo"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const metadata = generateSEOMetadata({
    title: "Blog - URL Shortening Tips & Guides",
    description: "Read the latest tips, guides, and product updates from RELURL. Learn about URL shortening, QR codes, and link management best practices.",
    path: "/blog",
    locale,
  })
  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      types: {
        "application/rss+xml": `https://relurl.com/${locale}/blog/feed.xml`,
      },
    },
  }
}

export { default } from "./page.client"
