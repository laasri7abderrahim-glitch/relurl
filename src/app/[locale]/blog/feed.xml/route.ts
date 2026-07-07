import { getAllPostMetas } from "@/lib/blog/post-metas"

const SITE_URL = "https://relurl.com"

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function formatRfc2822(dateStr: string): string {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return new Date().toUTCString()
  return d.toUTCString()
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params
  const posts = getAllPostMetas()
  const language = locale === "fr" ? "fr-fr" : "en-us"
  const blogUrl = `${SITE_URL}/${locale}/blog`
  const feedUrl = `${blogUrl}/feed.xml`
  const now = new Date().toUTCString()

  const items = posts.map((post) => {
    const postUrl = `${SITE_URL}/${locale}/blog/${post.slug}`
    return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid>${postUrl}</guid>
      <pubDate>${formatRfc2822(post.date)}</pubDate>
      <description>${escapeXml(post.metaDescription)}</description>
    </item>`
  }).join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>RELURL Blog</title>
  <link>${blogUrl}</link>
  <description>Tips, guides, and product updates about URL shortening, QR codes, and link management.</description>
  <language>${language}</language>
  <lastBuildDate>${now}</lastBuildDate>
  <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
  ${items}
</channel>
</rss>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  })
}
