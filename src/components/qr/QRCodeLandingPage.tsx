"use client"

import { useState, useMemo } from "react"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CardContent } from "@/components/ui/card"
import { QRCode } from "@/components/ui/qr-code"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { articleFor } from "@/lib/seo"
import { BlogPost } from "@/lib/blog/types"
import { getLandingContent, RichContent } from "@/lib/landing-content"
import { Copy, Check, Download, ArrowRight, QrCode, ChevronRight, Zap, Shield, Smartphone, Globe, BookOpen, Star, CheckCircle2, Lightbulb, Scan, Share2, Settings } from "lucide-react"
import { DecorativePattern } from "@/components/ui/decorative-pattern"
import { Badge } from "@/components/ui/badge"

interface FAQItem {
  q: string
  a: string
}

interface QRPageProps {
  title: string
  subtitle: string
  description: string
  placeholder: string
  defaultValue?: string
  inputLabel?: string
  generateLabel?: string
  presetType?: string
  features: string[]
  howItWorks: { step: string; desc: string }[]
  useCases: string[]
  relatedPages: { title: string; href: string }[]
  allQRCodes: { title: string; href: string }[]
  faqs?: FAQItem[]
  children?: React.ReactNode
  relatedArticles?: BlogPost[]
}

export default function QRCodeLandingPage({
  title,
  subtitle,
  description,
  placeholder,
  defaultValue = "",
  inputLabel = "Enter your URL or data",
  generateLabel = "Generate QR Code",
  features,
  howItWorks,
  useCases,
  faqs,
  relatedPages,
  allQRCodes,
  children,
  relatedArticles = [],
}: QRPageProps) {
  const t = useTranslations()
  const article = articleFor(title)
  const pathname = usePathname()
  const rc = useMemo(() => getLandingContent(pathname, "qr"), [pathname])

  const defaultFaqs: FAQItem[] = faqs ?? [
    {
      q: t("landing.qr.faq1Q", { article, title }),
      a: t("landing.qr.faq1A", { title }),
    },
    {
      q: t("landing.qr.faq2Q", { title }),
      a: t("landing.qr.faq2A", { title }),
    },
    {
      q: t("landing.qr.faq3Q", { article, title }),
      a: t("landing.qr.faq3A", { title }),
    },
    {
      q: t("landing.qr.faq4Q"),
      a: t("landing.qr.faq4A"),
    },
  ]

  const faqSchema = defaultFaqs.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  }))
  const [inputValue, setInputValue] = useState(defaultValue)
  const [qrValue, setQrValue] = useState("")
  const [copied, setCopied] = useState(false)

  const handleGenerate = () => {
    if (!inputValue) return
    setQrValue(inputValue)
  }

  const handleDownload = () => {
    const canvas = document.querySelector("canvas")
    if (canvas) {
      const link = document.createElement("a")
      link.download = "qrcode.png"
      link.href = canvas.toDataURL("image/png")
      link.click()
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(inputValue)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
        {/* Hero Section */}
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
                  {t("landing.qr.freeTool") || "Free QR Generator"}
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
                  <div className="relative p-6 space-y-4">
                    <div className="glass-card p-5">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                          <QrCode className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">Dynamic QR Codes</p>
                          <p className="text-xs text-foreground/60">Edit destinations without reprinting</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2.5 bg-muted/50 rounded-lg">
                        <Smartphone className="w-4 h-4 text-foreground shrink-0" />
                        <span className="text-sm font-medium text-foreground truncate">Scan with any device</span>
                        <Badge className="ml-auto text-xs shrink-0 bg-primary/10 text-foreground border-primary/20">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Works
                        </Badge>
                      </div>
                    </div>
                    <div className="glass-card p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg shadow-accent/20">
                          <Scan className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">Multiple Types</p>
                          <p className="text-xs text-foreground/60">WiFi, vCard, URL, and more</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3 mt-4">
                        <div className="text-center p-2 rounded-lg bg-muted/50">
                          <p className="text-xs text-foreground/60">WiFi</p>
                          <p className="text-lg font-bold text-foreground">Auto</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-muted/50">
                          <p className="text-xs text-foreground/60">WiFi</p>
                          <p className="text-lg font-bold text-foreground">Auto</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-muted/50">
                          <p className="text-xs text-foreground/60">Business</p>
                          <p className="text-lg font-bold text-foreground">Cards</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-muted/50">
                          <p className="text-xs text-foreground/60">Events</p>
                          <p className="text-lg font-bold text-foreground">RSVP</p>
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
          <section className="section-padding pb-0">
            <div className="max-w-4xl mx-auto">
              <p className="text-base text-muted-foreground leading-relaxed">{rc.longDescription}</p>
            </div>
          </section>
        )}

        {/* QR Generator Section */}
        <section className="section-padding pt-0">
          <div className="max-w-4xl mx-auto">
            <div className="glass-card p-1.5 -mt-16 relative z-20">
              <CardContent className="p-6 sm:p-8">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  <div>
                    <label className="block text-sm font-medium mb-2">{inputLabel}</label>
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={placeholder}
                      className="w-full h-32 px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    {children}
                    <div className="flex gap-3 mt-4">
                      <Button onClick={handleGenerate} disabled={!inputValue} className="flex-1 bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 shadow-glow">
                        <QrCode className="w-4 h-4 mr-2" />
                        {generateLabel}
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    {qrValue ? (
                      <>
                        <QRCode value={qrValue} size={220} />
                        <p className="text-sm text-muted-foreground mt-3 mb-4">{t("landing.qr.scanToOpen")}</p>
                        <div className="flex gap-2 w-full">
                          <Button variant="outline" size="sm" className="flex-1" onClick={handleDownload}>
                            <Download className="w-4 h-4 mr-2" />
                            {t("landing.qr.downloadPNG")}
                          </Button>
                          <Button variant="outline" size="sm" onClick={handleCopy}>
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="w-[220px] h-[220px] rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground">
                        <QrCode className="w-12 h-12 mb-3 opacity-30" />
                        <p className="text-sm">{t("landing.qr.placeholder")}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="section-padding bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gradient">{t("landing.qr.featuresTitle")}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => {
                const FeatureIcon = [
                  QrCode, Scan, Smartphone, Share2, Shield, Globe, Settings, Download
                ][i % 8]
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

        {/* Detailed Benefits */}
        {rc && rc.benefits.length > 0 && (
          <section className="section-padding">
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

        {/* How It Works */}
        <section className="section-padding">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gradient">{t("landing.qr.howItWorksTitle")}</h2>
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

        {/* Use Cases */}
        <section className="section-padding bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-gradient">{t("landing.qr.useCasesTitle")}</h2>
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

        {/* Related QR Codes */}
        <section className="section-padding">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-gradient">{t("landing.qr.relatedTitle")}</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedPages.map((page, i) => (
                <Link key={i} href={page.href}>
                  <div className="glass-card p-6 h-full group hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                    <h3 className="font-semibold mb-2">{page.title}</h3>
                    <p className="text-sm text-muted-foreground flex items-center">
                      {t("landing.qr.tryItNow")} <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* All QR Codes Directory */}
        <nav className="section-padding bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-gradient">{t("landing.qr.allToolsTitle")}</h2>
            <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-3">
              {allQRCodes.map((qr, i) => (
                <Link key={i} href={qr.href}>
                  <div className="glass-card p-3 text-center text-sm font-medium cursor-pointer hover:-translate-y-0.5 transition-all duration-300">
                    {qr.title}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Related Blog Articles */}
        {relatedArticles.length > 0 && (
          <section className="section-padding bg-muted/30">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8 text-gradient">{t("landing.qr.relatedArticles")}</h2>
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

        {/* FAQ / SEO Content */}
        <section className="section-padding">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-gradient">{t("landing.qr.faqTitle")}</h2>
            <div className="space-y-4">
              {defaultFaqs.map((faq, i) => (
                <div key={i} className="glass-card p-6 hover:-translate-y-0.5 transition-all duration-300">
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
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