"use client"

import { useState, useMemo } from "react"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CardContent } from "@/components/ui/card"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { articleFor } from "@/lib/seo"
import { BlogPost } from "@/lib/blog/types"
import { getLandingContent, RichContent } from "@/lib/landing-content"
import { Copy, Check, Link2, ArrowRight, Zap, BarChart3, Globe, Shield, ChevronRight, QrCode, BookOpen, TrendingUp, Target, CheckCircle2, Star, Lightbulb, Activity, Hash, Users, MousePointerClick } from "lucide-react"
import { DecorativePattern } from "@/components/ui/decorative-pattern"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

interface FAQItem {
  q: string
  a: string
}

interface URLLandingPageProps {
  title: string
  subtitle: string
  description: string
  placeholder?: string
  inputLabel?: string
  generateLabel?: string
  features: string[]
  howItWorks: { step: string; desc: string }[]
  useCases: string[]
  relatedPages: { title: string; href: string }[]
  allPages: { title: string; href: string }[]
  faqs?: FAQItem[]
  children?: React.ReactNode
  relatedArticles?: BlogPost[]
}

export default function URLLandingPage({
  title,
  subtitle,
  description,
  placeholder = "https://example.com/my-very-long-url-that-needs-shortening",
  inputLabel = "Paste your long URL",
  generateLabel = "Shorten URL",
  features,
  howItWorks,
  useCases,
  relatedPages,
  allPages,
  faqs,
  children,
  relatedArticles = [],
}: URLLandingPageProps) {
  const [url, setUrl] = useState("")
  const [shortUrl, setShortUrl] = useState("")
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const t = useTranslations()
  const article = articleFor(title)
  const pathname = usePathname()
  const rc = useMemo(() => {
    const socialPaths = ["instagram", "whatsapp", "tiktok", "youtube", "facebook", "linkedin", "pinterest", "snapchat", "reddit", "discord", "twitch", "twitter", "threads", "mastodon", "telegram"]
    const category = socialPaths.some(p => pathname.includes(p)) ? "social" : "url"
    return getLandingContent(pathname, category)
  }, [pathname])

  const defaultFaqs: FAQItem[] = faqs ?? [
    {
      q: t("landing.url.faq1Q", { article, title }),
      a: t("landing.url.faq1A", { title }),
    },
    {
      q: t("landing.url.faq2Q", { article, title }),
      a: t("landing.url.faq2A", { title }),
    },
    {
      q: t("landing.url.faq3Q", { article, title }),
      a: t("landing.url.faq3A", { title }),
    },
  ]

  const faqSchema = defaultFaqs.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  }))

  const handleShorten = async () => {
    if (!url.trim()) return
    setLoading(true)
    setError("")
    setShortUrl("")
    try {
      const res = await fetch("/api/url/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to shorten")
      setShortUrl(data.shortUrl)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const copyLink = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "@id": "https://relurl.com/#software",
          name: title,
          applicationCategory: "WebApplication",
          operatingSystem: "Web",
          url: "https://relurl.com",
          description,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          mainEntityOfPage: { "@type": "WebPage", "@id": `https://relurl.com${pathname}` },
        })}}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqSchema,
        })}}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: `How to use our ${title}`,
          step: howItWorks.map((item, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: item.step,
            text: item.desc,
          })),
        })}}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://relurl.com" },
            { "@type": "ListItem", position: 2, name: title, item: `https://relurl.com${pathname}` },
          ],
        })}}
      />
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden section-padding bg-warm">
          <div className="bg-noise absolute inset-0 z-0" />
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-40 -right-40 w-[700px] h-[700px] bg-gradient-to-br from-primary/10 via-accent/5 to-transparent rounded-full blur-[120px] floating" />
            <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-gradient-to-tr from-accent/10 via-primary/5 to-transparent rounded-full blur-[120px] floating-delayed" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(170,28,65,0.03)_0%,transparent_70%)]" />
            <DecorativePattern className="absolute top-20 right-20 w-48 h-48 opacity-50 floating-slower" />
            <DecorativePattern className="absolute bottom-20 left-20 w-36 h-36 opacity-40 rotate-45 floating-delayed" />
          </div>
          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="reveal">
                <Badge className="mb-5 px-4 py-1.5 text-sm bg-primary/10 text-foreground border-primary/20 rounded-full font-medium">
                  {t("landing.url.freeTool") || "Free URL Shortener"}
                </Badge>
                <p className="text-primary font-medium mb-2">{subtitle}</p>
                <h1 className="mb-5 text-balance">
                  <span className="text-gradient">{title}</span>
                </h1>
                <p className="text-lg text-foreground/60 mb-8 max-w-lg leading-relaxed text-balance">{description}</p>
              </div>
              <div className="hidden md:block reveal reveal-delay-2">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-br from-accent/10 via-primary/5 to-transparent rounded-3xl blur-2xl" />
                  <div className="relative rounded-2xl overflow-hidden shadow-strong glass">
                    <Image
                      src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80"
                      alt="Team collaborating on link management and analytics"
                      width={600}
                      height={450}
                      className="w-full h-auto object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Long Description */}
        {rc && (
          <section className="px-4 py-12 bg-gradient-to-b from-background to-muted/20">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-4 items-start p-6 rounded-xl bg-background border border-border/50">
                <BookOpen className="w-6 h-6 text-primary shrink-0 mt-1 hidden sm:block" />
                <p className="text-base text-muted-foreground leading-relaxed">{rc.longDescription}</p>
              </div>
            </div>
          </section>
        )}

        {/* Shortener */}
        <section className="section-padding pt-0">
          <div className="max-w-3xl mx-auto">
            <div className="glass-card p-1.5 -mt-16 relative z-20">
              <CardContent className="p-6 sm:p-8">
                <label className="block text-sm font-medium mb-3">{inputLabel}</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    placeholder={placeholder}
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleShorten()}
                    className="flex-1 h-12"
                  />
                  <Button onClick={handleShorten} disabled={loading || !url} size="lg" className="h-12 px-8 w-full sm:w-auto bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 shadow-glow">
                    {loading ? t("common.loading") : generateLabel}
                  </Button>
                </div>
                {children}
                {error && (
                  <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-500">
                    {error}{" "}
                    {error.includes("sign in") && (
                      <Link href="/login" className="underline font-medium">{t("layout.nav.login")}</Link>
                    )}
                  </div>
                )}
                {shortUrl && (
                  <div className="mt-4 flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-lg">
                    <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-primary font-medium truncate mr-4">{shortUrl}</a>
                    <Button variant="outline" size="sm" onClick={copyLink} className="shrink-0" aria-label={copied ? t("common.copied") : t("common.copy")}>
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                )}
              </CardContent>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="section-padding bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gradient">{t("landing.url.featuresTitle", { title })}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => {
                const FeatureIcon = [
                  Zap, BarChart3, Globe, Shield, Link2, TrendingUp, Target, Users, MousePointerClick, Activity, Hash
                ][i % 11]
                return (
                <div key={i} className="glass-card p-6 text-center group hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                    <FeatureIcon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-medium">{feature}</p>
                </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="section-padding">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gradient">{t("landing.url.howItWorksTitle")}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {howItWorks.map((item, i) => (
                <div key={i} className="glass-card p-6 text-center group hover:-translate-y-1 transition-all duration-300">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center mx-auto mb-4 text-lg font-bold shadow-md shadow-primary/20">{i + 1}</div>
                  <h3 className="font-semibold mb-2">{item.step}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Detailed Benefits */}
        {rc && rc.benefits.length > 0 && (
          <section className="section-padding bg-muted/30">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-gradient">Why Use Our {title}</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {rc.benefits.map((benefit, i) => (
                  <div key={i} className="glass-card p-6 flex gap-4 group hover:-translate-y-0.5 transition-all duration-300">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Star className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1.5">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{benefit.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Why Choose */}
        {rc && (
          <section className="section-padding">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8 text-gradient">What Makes RELURL Different</h2>
              <div className="glass-card p-8">
                <p className="text-base text-muted-foreground leading-relaxed">{rc.whyChoose}</p>
              </div>
            </div>
          </section>
        )}

        {/* Comparison */}
        {rc && rc.comparisonPoints.length > 0 && (
          <section className="section-padding bg-muted/30">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8 text-gradient">How We Compare to Alternatives</h2>
              <div className="space-y-4">
                {rc.comparisonPoints.map((point, i) => (
                  <div key={i} className="glass-card p-5 flex items-start gap-3 hover:-translate-y-0.5 transition-all duration-300">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Use Cases */}
        <section className="section-padding bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-gradient">{t("landing.url.useCasesTitle")}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {useCases.map((useCase, i) => (
                <div key={i} className="glass-card p-4 flex items-center gap-3 group hover:-translate-y-0.5 transition-all duration-300">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-sm">{useCase}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related */}
        <section className="section-padding">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-gradient">{t("landing.url.relatedTitle")}</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedPages.map((page, i) => (
                <Link key={i} href={page.href}>
                  <div className="glass-card p-6 h-full group hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                    <h3 className="font-semibold mb-2">{page.title}</h3>
                    <p className="text-sm text-muted-foreground flex items-center">{t("landing.url.tryItNow")} <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" /></p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* All Pages Directory */}
        <nav aria-label={t("landing.url.allToolsTitle")} className="section-padding bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-gradient">{t("landing.url.allToolsTitle")}</h2>
            <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-3">
              {allPages.map((page, i) => (
                <Link key={i} href={page.href}>
                  <div className="glass-card p-3 text-center text-sm font-medium cursor-pointer hover:-translate-y-0.5 transition-all duration-300">{page.title}</div>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Related Blog Articles */}
        {relatedArticles.length > 0 && (
          <section className="section-padding bg-muted/30">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8 text-gradient">{t("landing.url.relatedArticles")}</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {relatedArticles.map((article) => (
                  <Link key={article.slug} href={`/blog/${article.slug}`}>
                    <div className="glass-card p-6 h-full group hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                      <div className="text-xs font-medium text-primary mb-2 uppercase tracking-wider">{article.category}</div>
                      <h3 className="font-semibold mb-2 text-sm leading-tight">{article.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{article.metaDescription}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Tips */}
        {rc && rc.tips.length > 0 && (
          <section className="section-padding">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8 text-gradient">Tips and Best Practices</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {rc.tips.map((tip, i) => (
                  <div key={i} className="glass-card p-6 group hover:-translate-y-1 transition-all duration-300">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Lightbulb className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2 text-sm">{tip.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{tip.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="section-padding">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-gradient">{t("landing.url.faqTitle")}</h2>
            <div className="space-y-4">
              {defaultFaqs.map((faq, i) => (
                <div key={i} className="glass-card p-6 hover:-translate-y-0.5 transition-all duration-300">
                  <article itemScope itemType="https://schema.org/Question">
                    <h3 itemProp="name" className="font-semibold mb-2">{faq.q}</h3>
                    <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                      <p itemProp="text" className="text-sm text-muted-foreground">{faq.a}</p>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}