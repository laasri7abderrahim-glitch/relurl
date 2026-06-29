"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { articleFor } from "@/lib/seo"
import { Copy, Check, Link2, ArrowRight, Zap, BarChart3, Globe, Shield, ChevronRight, QrCode } from "lucide-react"

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
}: URLLandingPageProps) {
  const [url, setUrl] = useState("")
  const [shortUrl, setShortUrl] = useState("")
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleShorten = async () => {
    if (!url) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      if (res.ok) {
        setShortUrl(data.data?.shortUrl || data.short_url || window.location.origin + "/" + (data.data?.slug || data.slug))
      } else if (res.status === 401) {
        setError("Please sign in to shorten URLs")
      } else {
        setError(data.error || "Something went wrong. Please try again.")
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const defaultFaqs: FAQItem[] = faqs ?? [
    {
      q: `What is ${articleFor(title)} ${title}?`,
      a: `${title} is a free tool that transforms long, complex URLs into short, shareable links. Track clicks, customize slugs, and manage all your short links from one dashboard.`,
    },
    {
      q: `Is ${articleFor(title)} ${title} free?`,
      a: "Yes, our basic URL shortening service is completely free. Sign up for a free account to access custom aliases, click analytics, branded domains, and more advanced features.",
    },
    {
      q: `How do I create ${articleFor(title)} ${title.toLowerCase()} link?`,
      a: `Simply paste your long URL into the input field above and click the "${generateLabel}" button. Your short link will be generated instantly. For custom slugs and tracking, create a free account.`,
    },
  ]

  const faqSchema = defaultFaqs.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  }))

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
          url: "https://relurl.com" + "/" + title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
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
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative px-4 pt-24 pb-16 text-center">
          <div className="absolute inset-0 pointer-events-none">
            <svg className="absolute -top-20 -right-40 w-[510px] h-[227px] opacity-20" viewBox="0 0 510 227" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M-87.152 -39.8215C-88.9236 -97.5924 -78.1971 -154.94 -48.4234 -204.479C-20.7542 -250.517 24.1466 -281.369 72.3104 -305.144C118.507 -327.949 168.356 -332.792 219.715 -336.844C285.535 -342.038 369.083 -381.424 412.88 -332.018C457.935 -281.194 406.048 -201.31 399.82 -133.678C395.679 -88.7194 394.135 -46.317 382.55 -2.68C368.135 51.6174 373.1 123.327 324.232 151.04C275.433 178.714 218.732 122.276 162.632 122.037C93.5849 121.742 20.3777 187.044 -37.5683 149.496C-93.687 113.131 -85.1022 27.0177 -87.152 -39.8215Z" fill="url(#u0)" fillOpacity="0.4"/>
              <defs><linearGradient id="u0" x1="403.713" y1="80.0373" x2="-60.6291" y2="-29.7743">              <stop stopColor="#6366f1" stopOpacity="0"/><stop offset="1" stopColor="#6366f1" stopOpacity="0.3"/></linearGradient></defs>
            </svg>
          </div>
          <div className="relative z-10 max-w-4xl mx-auto">
            <p className="text-primary font-medium mb-4">{subtitle}</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gradient leading-tight">{title}</h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">{description}</p>
          </div>
        </section>

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
                  <Button onClick={handleShorten} disabled={loading || !url} size="lg" className="h-12 px-8">
                    {loading ? "Shortening..." : generateLabel}
                  </Button>
                </div>
                {children}
                {error && (
                  <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-500">
                    {error}{" "}
                    {error.includes("sign in") && (
                      <Link href="/login" className="underline font-medium">Sign in</Link>
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
            <h2 className="text-3xl font-bold text-center mb-12 text-gradient">Why Use Our {title}?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <Card key={i} className="border-border/50 hover:border-primary/30 transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm font-medium">{feature}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gradient">How It Works</h2>
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

        {/* Use Cases */}
        <section className="px-4 py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-gradient">Popular Use Cases</h2>
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
            <h2 className="text-3xl font-bold text-center mb-8 text-gradient">Related Tools</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedPages.map((page, i) => (
                <Link key={i} href={page.href}>
                  <Card className="border-border/50 hover:border-primary/30 transition-all hover:-translate-y-1 cursor-pointer h-full">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2">{page.title}</h3>
                      <p className="text-sm text-muted-foreground flex items-center">Try it now <ArrowRight className="w-4 h-4 ml-1" /></p>
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
            <h2 className="text-3xl font-bold text-center mb-8 text-gradient">All URL Shortener Tools</h2>
            <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-3">
              {allPages.map((page, i) => (
                <Link key={i} href={page.href}>
                  <div className="p-3 rounded-lg bg-background border border-border/50 hover:border-primary/30 transition-all text-center text-sm font-medium cursor-pointer">{page.title}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-gradient">Frequently Asked Questions</h2>
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
