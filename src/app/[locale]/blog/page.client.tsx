"use client"

import { useEffect } from "react"
import { Link } from "@/i18n/navigation"
import { useLocale, useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import { getPaginatedPostMetas, getTotalPages } from "@/lib/blog/post-metas"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function BlogPageClient() {
  const locale = useLocale()
  const t = useTranslations("blog")
  const searchParams = useSearchParams()
  const currentPage = Math.max(1, Number(searchParams.get("page")) || 1)
  const perPage = 24
  const posts = getPaginatedPostMetas(currentPage, perPage)
  const totalPages = getTotalPages(perPage)
  const blogUrl = `https://relurl.com/${locale}/blog`

  useEffect(() => {
    const links: HTMLLinkElement[] = []
    const canonical = document.createElement("link")
    canonical.rel = "canonical"
    canonical.href = blogUrl
    document.head.appendChild(canonical)
    links.push(canonical)

    if (currentPage > 1) {
      const prev = document.createElement("link")
      prev.rel = "prev"
      prev.href = `${blogUrl}?page=${currentPage - 1}`
      document.head.appendChild(prev)
      links.push(prev)
    }
    if (currentPage < totalPages) {
      const next = document.createElement("link")
      next.rel = "next"
      next.href = `${blogUrl}?page=${currentPage + 1}`
      document.head.appendChild(next)
      links.push(next)
    }

    return () => links.forEach((l) => l.remove())
  }, [currentPage, totalPages, blogUrl])

  const schema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "RELURL Blog",
    description: "Tips, guides, and product updates to help you get the most out of your links.",
    url: blogUrl,
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.metaDescription,
      datePublished: post.date,
      author: { "@type": "Organization", name: "RELURL" },
    })),
  }

  return (
    <div className="min-h-screen flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://relurl.com" },
            { "@type": "ListItem", position: 2, name: "Blog", item: blogUrl },
          ],
        })}}
      />
      <Header />
      <main className="flex-1">
        <div className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">RELURL Blog</h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Tips, guides, and product updates to help you get the most out of your links.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Card key={post.slug} className="border-border/50 hover:border-primary/30 transition-colors duration-200 flex flex-col">
                  <CardContent className="p-6 flex-1">
                    <div className="text-xs font-medium text-primary mb-3 uppercase tracking-wider">{post.category}</div>
                    <h2 className="text-lg font-semibold mb-3 leading-tight">{post.title}</h2>
                    <p className="text-sm text-muted-foreground">{post.metaDescription}</p>
                  </CardContent>
                  <CardFooter className="px-6 pb-4 pt-0 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {t("readTime", { minutes: post.readTime.match(/\d+/)?.[0] || "5" })}</span>
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                      <Button variant="ghost" size="sm" className="text-primary">{t("readArticle")} <ArrowRight className="w-3 h-3 ml-1" /></Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <Link href={currentPage > 1 ? `?page=${currentPage - 1}` : "#"}>
                  <Button variant="outline" size="sm" disabled={currentPage <= 1}>
                    <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                  </Button>
                </Link>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Link key={page} href={`?page=${page}`}>
                    <Button variant={page === currentPage ? "default" : "outline"} size="sm" className="min-w-[40px]">
                      {page}
                    </Button>
                  </Link>
                ))}
                <Link href={currentPage < totalPages ? `?page=${currentPage + 1}` : "#"}>
                  <Button variant="outline" size="sm" disabled={currentPage >= totalPages}>
                    Next <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
