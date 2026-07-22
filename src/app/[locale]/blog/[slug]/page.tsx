import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { getPostBySlug, getRelatedPosts, getAllSlugs } from "@/lib/blog/posts"
import { ArticleRenderer } from "@/components/blog/ArticleRenderer"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Calendar, Clock, ArrowLeft, Tag } from "lucide-react"

export function generateStaticParams() {
  const slugs = getAllSlugs()
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  )
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  return {
    title: `${post.title} | RELURL Blog`,
    description: post.metaDescription,
    keywords: post.keywords.join(", "),
    alternates: {
      canonical: `https://relurl.com/${locale}/blog/${slug}`,
      languages: {
        en: `https://relurl.com/en/blog/${slug}`,
        fr: `https://relurl.com/fr/blog/${slug}`,
        es: `https://relurl.com/es/blog/${slug}`,
      },
    },
    openGraph: {
      title: `${post.title} | RELURL Blog`,
      description: post.metaDescription,
      type: "article",
      publishedTime: post.date,
      tags: post.keywords,
      images: post.image ? [{ url: post.image, width: 1200, height: 630, alt: post.imageAlt || post.title }] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()
  const t = await getTranslations({ locale, namespace: "blog" })

  const relatedPosts = getRelatedPosts(slug)
  const blogUrl = `https://relurl.com/${locale}/blog/${slug}`

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "@id": `${blogUrl}#article`,
          headline: post.title,
          description: post.metaDescription,
          datePublished: post.date,
          author: { "@type": "Organization", name: "RELURL" },
          image: post.image || "/api/og",
          mainEntityOfPage: { "@type": "WebPage", "@id": blogUrl },
        })}}
      />
      <Header />
      <main className="flex-1">
        <div className="py-12 px-4">
          <div className="max-w-3xl mx-auto">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              {t("backToBlog")}
            </Link>
            <div className="mb-8">
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {post.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {t("readTime", { minutes: post.readTime.match(/\d+/)?.[0] || "5" })}</span>
                <span className="flex items-center gap-1"><Tag className="w-4 h-4" /> {post.category}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
              <p className="text-lg text-muted-foreground mb-8">{post.metaDescription}</p>
              {post.image && (
                <div className="aspect-video relative overflow-hidden rounded-xl bg-muted mb-8">
                  <img
                    src={post.image}
                    alt={post.imageAlt || post.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
            <ArticleRenderer post={post} />
            <div className="mt-12 pt-8 border-t border-border/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <span className="font-medium text-foreground">{t("targetKeyword")}:</span>
                <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">{post.keywords[0]}</span>
              </div>
              <Link
                href={post.landingPage}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                {t("useTheTool", { keyword: post.keywords[0] })}
              </Link>
            </div>
            {relatedPosts.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-bold mb-6">{t("relatedArticles")}</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {relatedPosts.map((related) => (
                    <Link
                      key={related.slug}
                      href={`/blog/${related.slug}`}
                      className="border border-border/50 rounded-lg p-4 hover:border-primary/30 transition-colors"
                    >
                      <div className="text-xs font-medium text-primary mb-2 uppercase tracking-wider">{related.category}</div>
                      <h3 className="font-semibold text-sm leading-tight">{related.title}</h3>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}