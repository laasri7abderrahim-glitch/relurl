"use client"

import { useState, useMemo } from "react"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { articleFor } from "@/lib/seo"
import { BlogPost } from "@/lib/blog/types"
import { getLandingContent, RichContent } from "@/lib/landing-content"
import { Copy, Check, Link2, ArrowRight, Zap, BarChart3, Globe, Shield, ChevronRight, QrCode, BookOpen, TrendingUp, Target, CheckCircle2, Star, Lightbulb, Activity, Hash, Users, MousePointerClick } from "lucide-react"
import { DecorativePattern } from "@/components/ui/decorative-pattern"
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
          name: title,
          applicationCategory: "WebApplication",
          operatingSystem: "Web",
          url: "https://relurl.com",
          description,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
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
            { "@type": "ListItem", position: 2, name: title, item: "https://relurl.com" },
          ],
        })}}
      />
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden px-4 pt-24 pb-16 md:pt-28 md:pb-32 bg-warm">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-[#AA1C41]/10 via-[#E68457]/5 to-transparent rounded-full blur-[100px]" />
            <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-[#E68457]/10 via-[#AA1C41]/5 to-transparent rounded-full blur-[100px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(170,28,65,0.03)_0%,transparent_70%)]" />
            <DecorativePattern className="absolute top-20 right-20 w-48 h-48 opacity-50" />
            <DecorativePattern className="absolute bottom-20 left-20 w-36 h-36 opacity-40 rotate-45" />
          </div>
          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in-up">
                <Badge className="mb-5 px-4 py-1.5 text-sm bg-[#AA1C41]/10 text-[#AA1C41] border-[#AA1C41]/20 rounded-full font-medium">
                  {t("landing.url.freeTool") || "Free URL Shortener"}
                </Badge>
                <p className="text-primary font-medium mb-2">{subtitle}</p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight">
                  <span className="text-gradient">{title}</span>
                </h1>
                <p className="text-lg text-[#5E244E]/70 mb-8 max-w-lg leading-relaxed">{description}</p>
              </div>
              <div className="hidden md:block animate-fade-in">
                <div className="relative">
                  <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-[#E68457]/10 to-[#AA1C41]/5 rounded-3xl" />
                  <div className="relative p-6 space-y-4">
                    <div className="rounded-xl border border-[#E68457]/20 bg-background p-5 shadow-lg shadow-[#AA1C41]/5">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#AA1C41] to-[#E68457] flex items-center justify-center shadow-lg shadow-[#AA1C41]/20">
                          <Link2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#5E244E]">Smart Short Links</p>
                          <p className="text-xs text-[#5E244E]/60">Custom aliases with analytics</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2.5 bg-[#FFE8B4]/50 rounded-lg">
                        <Globe className="w-4 h-4 text-[#AA1C41] shrink-0" />
                        <span className="text-sm font-medium text-[#AA1C41] truncate">relurl.com/your-brand</span>
                        <Badge className="ml-auto text-xs shrink-0 bg-[#AA1C41]/10 text-[#AA1C41] border-[#AA1C41]/20">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Live
                        </Badge>
                      </div>
                    </div>
                    <div className="rounded-xl border border-[#E68457]/20 bg-background p-5 shadow-lg shadow-[#AA1C41]/5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E68457] to-[#5E244E] flex items-center justify-center shadow-lg shadow-[#E68457]/20">
                          <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#5E244E]">Real-Time Analytics</p>
                          <p className="text-xs text-[#5E244E]/60">Track clicks, locations, devices</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3 mt-4">
                        <div className="text-center p-2 rounded-lg bg-[#FFE8B4]/50">
                          <p className="text-xs text-[#5E244E]/60">Clicks</p>
                          <p className="text-lg font-bold text-[#5E244E]">24.8K</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-[#FFE8B4]/50">
                          <p className="text-xs text-[#5E244E]/60">CTR</p>
                          <p className="text-lg font-bold text-[#5E244E]">12.4%</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-[#FFE8B4]/50">
                          <p className="text-xs text-[#5E244E]/60">Countries</p>
                          <p className="text-lg font-bold text-[#5E244E]">32</p>
                        </div>
                      </div>
                    </div>
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
        <section className="px-4 pb-16">
          <div className="max-w-3xl mx-auto">
            <Card className="border-border/50 shadow-2xl shadow-primary/5">
              <CardContent className="p-8">
                <label className="block text-sm font-medium mb-2">{inputLabel}</label>
                <div className="flex gap-3">
                  <Input
                    placeholder={placeholder}
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleShorten()}
                    className="flex-1 h-12"
                  />
                  <Button onClick={handleShorten} disabled={loading || !url} size="lg" className="h-12 px-8 bg-gradient-to-r from-[#AA1C41] to-[#E68457] text-white hover:from-[#8f1a39] hover:to-[#d97a4f] shadow-lg shadow-[#AA1C41]/25">
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
                  <div className="mt-4 flex items-center justify-between p-3 bg-primary/10 border border-primary/20 rounded-lg">
                    <a href={shortUrl} target="_blank" className="text-primary font-medium truncate mr-4">{shortUrl}</a>
                    <Button variant="outline" size="sm" onClick={copyLink} className="shrink-0">
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features */}
        <section className="px-4 py-16 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gradient">{t("landing.url.featuresTitle", { title })}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => {
                const FeatureIcon = [
                  Zap, BarChart3, Globe, Shield, Link2, TrendingUp, Target, Users, MousePointerClick, Activity, Hash
                ][i % 11]
                return (
                <Card key={i} className="border-border/50 shadow-card hover:border-primary/30 shadow-card-hover transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#AA1C41] to-[#E68457] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#AA1C41]/20">
                      <FeatureIcon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm font-medium">{feature}</p>
                  </CardContent>
                </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gradient">{t("landing.url.howItWorksTitle")}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {howItWorks.map((item, i) => (
                <div key={i} className="text-center">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-lg font-bold">{i + 1}</div>
                  <h3 className="font-semibold mb-2">{item.step}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Detailed Benefits */}
        {rc && rc.benefits.length > 0 && (
          <section className="px-4 py-16 bg-muted/30">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-gradient">Why Use Our {title}</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {rc.benefits.map((benefit, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <Star className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{benefit.title}</h3>
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
          <section className="px-4 py-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8 text-gradient">What Makes RELURL Different</h2>
              <div className="bg-background border border-border/50 rounded-xl p-8">
                <p className="text-base text-muted-foreground leading-relaxed">{rc.whyChoose}</p>
              </div>
            </div>
          </section>
        )}

        {/* Comparison */}
        {rc && rc.comparisonPoints.length > 0 && (
          <section className="px-4 py-16 bg-muted/30">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8 text-gradient">How We Compare to Alternatives</h2>
              <div className="space-y-4">
                {rc.comparisonPoints.map((point, i) => (
                  <div key={i} className="flex items-start gap-3 p-5 rounded-xl bg-background border border-border/50">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Use Cases */}
        <section className="px-4 py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-gradient">{t("landing.url.useCasesTitle")}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {useCases.map((useCase, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-lg bg-background border border-border/50">
                  <ChevronRight className="w-5 h-5 text-primary shrink-0" />
                  <p className="text-sm">{useCase}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related */}
        <section className="px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-gradient">{t("landing.url.relatedTitle")}</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedPages.map((page, i) => (
                <Link key={i} href={page.href}>
                  <Card className="border-border/50 hover:border-primary/30 transition-colors duration-200 cursor-pointer h-full">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2">{page.title}</h3>
                      <p className="text-sm text-muted-foreground flex items-center">{t("landing.url.tryItNow")} <ArrowRight className="w-4 h-4 ml-1" /></p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* All Pages Directory */}
        <section className="px-4 py-16 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-gradient">{t("landing.url.allToolsTitle")}</h2>
            <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-3">
              {allPages.map((page, i) => (
                <Link key={i} href={page.href}>
                  <div className="p-3 rounded-lg bg-background border border-border/50 hover:border-primary/30 transition-colors duration-200 text-center text-sm font-medium cursor-pointer">{page.title}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Related Blog Articles */}
        {relatedArticles.length > 0 && (
          <section className="px-4 py-16 bg-muted/30">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8 text-gradient">{t("landing.url.relatedArticles")}</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {relatedArticles.map((article) => (
                  <Link key={article.slug} href={`/blog/${article.slug}`}>
                    <Card className="border-border/50 hover:border-primary/30 transition-colors duration-200 cursor-pointer h-full">
                      <CardContent className="p-6">
                        <div className="text-xs font-medium text-primary mb-2 uppercase tracking-wider">{article.category}</div>
                        <h3 className="font-semibold mb-2 text-sm leading-tight">{article.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">{article.metaDescription}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Tips */}
        {rc && rc.tips.length > 0 && (
          <section className="px-4 py-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8 text-gradient">Tips and Best Practices</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {rc.tips.map((tip, i) => (
                  <Card key={i} className="border-border/50 shadow-card">
                    <CardContent className="p-6">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Lightbulb className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2 text-sm">{tip.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{tip.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-gradient">{t("landing.url.faqTitle")}</h2>
            <div className="space-y-4">
              {defaultFaqs.map((faq, i) => (
                <Card key={i} className="border-border/50">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">{faq.q}</h3>
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}