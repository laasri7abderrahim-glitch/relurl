"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DecorativePattern } from "@/components/ui/decorative-pattern"

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QRCode } from "@/components/ui/qr-code";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Image from "next/image";
import {
  ArrowRight,
  BarChart3,
  Globe,
  Link2,
  QrCode,
  Shield,
  Users,
  Copy,
  Check,
  Download,
  Share2,
  Zap,
  Star,
  ExternalLink,
  MousePointerClick,
  Smartphone,
  TrendingUp,
  ChevronRight,
  CheckCircle2,
  Clock,
  Palette,
  Target,
  Activity,
  Sparkles,
  Layers,
  Eye,
} from "lucide-react";

const baseUrl = "https://relurl.com"

const companies = ["Microsoft", "Google", "Shopify", "Netflix", "Spotify", "Adobe"]

const stats = [
  { icon: Users, value: "600K+", labelKey: "homepage.statCustomers" },
  { icon: Link2, value: "256M", labelKey: "homepage.statLinks" },
  { icon: Globe, value: "800+", labelKey: "homepage.statIntegrations" },
  { icon: MousePointerClick, value: "10B", labelKey: "homepage.statClicks" },
]

const products = [
  {
    icon: Link2,
    titleKey: "homepage.productShortenerTitle",
    descKey: "homepage.productShortenerDesc",
    features: [
      "homepage.productShortenerFeat1",
      "homepage.productShortenerFeat2",
      "homepage.productShortenerFeat3",
      "homepage.productShortenerFeat4",
    ],
    href: "/custom-url-shortener",
    accent: "from-primary to-accent",
  },
  {
    icon: QrCode,
    titleKey: "homepage.productQrTitle",
    descKey: "homepage.productQrDesc",
    features: [
      "homepage.productQrFeat1",
      "homepage.productQrFeat2",
      "homepage.productQrFeat3",
      "homepage.productQrFeat4",
    ],
    href: "/qr-code-generator",
    accent: "from-accent to-muted",
  },
  {
    icon: Globe,
    titleKey: "homepage.productPagesTitle",
    descKey: "homepage.productPagesDesc",
    features: [
      "homepage.productPagesFeat1",
      "homepage.productPagesFeat2",
      "homepage.productPagesFeat3",
      "homepage.productPagesFeat4",
    ],
    href: "/instagram-link-generator",
    accent: "from-primary to-muted",
  },
]

const testimonials = [
  { quoteKey: "homepage.testimonial1Quote", name: "Sarah Chen", titleKey: "homepage.testimonial1Title", company: "TechFlow Inc." },
  { quoteKey: "homepage.testimonial2Quote", name: "Marcus Johnson", titleKey: "homepage.testimonial2Title", company: "ScaleUp Labs" },
  { quoteKey: "homepage.testimonial3Quote", name: "Emily Rodriguez", titleKey: "homepage.testimonial3Title", company: "OmniMedia Group" },
]

const avatarColors = [
  "from-primary to-accent",
  "from-primary to-muted",
  "from-accent to-primary",
]

function DecorativeBlob({ className, color }: { className?: string; color: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M200 0C310.457 0 400 89.543 400 200C400 310.457 310.457 400 200 400C89.543 400 0 310.457 0 200C0 89.543 89.543 0 200 0Z" fill={color} />
      <path d="M200 40C288.366 40 360 111.634 360 200C360 288.366 288.366 360 200 360C111.634 360 40 288.366 40 200C40 111.634 111.634 40 200 40Z" fill="url(#g1)" />
      <defs>
        <radialGradient id="g1" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="white" stopOpacity="0.3" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  )
}

export default function HomePage() {
  const locale = useLocale()
  const t = useTranslations()
  const [tab, setTab] = useState<"shorten" | "qr">("shorten");
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [qrValue, setQrValue] = useState("");

  const handleShorten = async () => {
    if (!url) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (res.ok) {
        setShortUrl(window.location.origin + "/" + data.data?.slug);
      } else {
        setError(data.error || t("homepage.genericError"));
      }
    } catch {
      setError(t("homepage.networkError"));
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQR = () => {
    if (!url) return;
    setQrValue(url);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": "https://relurl.com/#website",
          url: "https://relurl.com",
          name: "RELURL",
          description: t("homepage.subtitle"),
          potentialAction: {
            "@type": "SearchAction",
            target: { "@type": "EntryPoint", urlTemplate: "https://relurl.com/search?q={search_term_string}" },
            "query-input": "required name=search_term_string",
          },
        })}}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://relurl.com" },
          ],
        })}}
      />
      <Header />
      <main className="flex-1">

        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 pt-16 pb-16 md:pt-28 md:pb-32 bg-warm">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-primary/10 via-accent/5 to-transparent rounded-full blur-[100px]" />
            <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-accent/10 via-primary/5 to-transparent rounded-full blur-[100px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.03)_0%,transparent_70%)]" />
            <DecorativePattern className="absolute top-20 right-20 w-48 h-48 opacity-50" />
            <DecorativePattern className="absolute bottom-20 left-20 w-36 h-36 opacity-40 rotate-45" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in-up">
                <Badge className="mb-5 px-4 py-1.5 text-sm bg-primary/10 text-foreground border-primary/20 rounded-full font-medium">{t("homepage.badge")}</Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight">
                  <span className="text-gradient">{t("homepage.title")}</span>
                </h1>
                <p className="text-lg text-foreground/70 mb-8 max-w-lg leading-relaxed">
                  {t("homepage.subtitle")}
                </p>

                <Card className="border-accent/20 shadow-xl shadow-primary/5">
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex gap-2 mb-4">
                      <Button
                        variant={tab === "shorten" ? "default" : "ghost"}
                        size="sm"
                        className="flex-1 text-xs sm:text-sm"
                        onClick={() => { setTab("shorten"); setShortUrl(""); setQrValue(""); setUrl(""); }}
                      >
                        <Link2 className="w-4 h-4 mr-1.5" />
                        {t("homepage.shortenTab")}
                      </Button>
                      <Button
                        variant={tab === "qr" ? "default" : "ghost"}
                        size="sm"
                        className="flex-1 text-xs sm:text-sm"
                        onClick={() => { setTab("qr"); setShortUrl(""); setQrValue(""); setUrl(""); }}
                      >
                        <QrCode className="w-4 h-4 mr-1.5" />
                        {t("homepage.qrTab")}
                      </Button>
                    </div>
                    {tab === "shorten" ? (
                      <>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Input
                            placeholder={t("homepage.inputPlaceholder")}
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleShorten()}
                            className="flex-1 h-12 sm:h-11 text-sm"
                          />
                          <Button onClick={handleShorten} disabled={loading} className="h-12 sm:h-11 px-6 w-full sm:w-auto bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/25">
                            {loading ? t("homepage.shortening") : t("homepage.shortenButton")}
                          </Button>
                        </div>
                        {error && (
                          <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-500">
                            {error}{" "}
                            {error.includes("sign in") && (
                              <Link href="/login" className="underline font-medium">{t("homepage.signIn")}</Link>
                            )}
                          </div>
                        )}
                        {shortUrl && (
                          <div className="mt-4 flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-lg">
                            <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-foreground font-medium truncate mr-4">
                              {shortUrl}
                            </a>
                            <Button variant="outline" size="sm" onClick={copyLink} className="shrink-0" aria-label={copied ? "Copied" : "Copy link"}>
                              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                          </div>
                        )}
                        <p className="text-xs text-foreground/50 mt-3">
                          {t("homepage.termsText")}
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Input
                            placeholder={t("homepage.qrInputPlaceholder")}
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleGenerateQR()}
                            className="flex-1 h-12 sm:h-11 text-sm"
                          />
                          <Button onClick={handleGenerateQR} className="h-12 sm:h-11 px-6 w-full sm:w-auto bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/25">
                            <QrCode className="w-4 h-4 mr-2" />
                            {t("homepage.generateButton")}
                          </Button>
                        </div>
                        {qrValue && (
                          <div className="mt-5 flex flex-col items-center gap-4">
                            <QRCode value={qrValue} size={180} />
                            <p className="text-sm text-foreground/60">{t("homepage.qrDescription")}</p>
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const canvas = document.querySelector("canvas");
                                  if (canvas) {
                                    const link = document.createElement("a");
                                    link.download = "qrcode.png";
                                    link.href = canvas.toDataURL("image/png");
                                    link.click();
                                  }
                                }}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                {t("homepage.downloadPNG")}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  navigator.clipboard.writeText(qrValue);
                                  setCopied(true);
                                  setTimeout(() => setCopied(false), 2000);
                                }}
                              >
                                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                {t("homepage.copyURL")}
                              </Button>
                            </div>
                          </div>
                        )}
                        <p className="text-xs text-foreground/50 mt-3">
                          {t("homepage.qrHelp")}
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>

                <div className="mt-5 flex items-center gap-2 text-sm text-foreground/60">
                  <Star className="w-4 h-4 text-accent fill-accent" />
                  <span>{t("homepage.trustedBy")}</span>
                </div>
              </div>

              {/* Right side - Hero illustration */}
              <div className="hidden md:block animate-fade-in">
                <div className="relative">
                  <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-accent/10 to-primary/5 rounded-3xl" />
                  <div className="relative p-6">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 mb-4">
                      <Image
                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80"
                        alt="Analytics dashboard showing link performance metrics"
                        width={600}
                        height={450}
                        className="w-full h-auto object-cover"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="flex-1 p-3 rounded-xl border border-accent/20 bg-white/80 text-center">
                        <QrCode className="w-5 h-5 text-foreground mx-auto mb-1" />
                        <p className="text-xs text-foreground/60">{t("homepage.qrReady")}</p>
                      </div>
                      <div className="flex-1 p-3 rounded-xl border border-accent/20 bg-white/80 text-center">
                        <Shield className="w-5 h-5 text-foreground mx-auto mb-1" />
                        <p className="text-xs text-foreground/60">{t("homepage.secure")}</p>
                      </div>
                      <div className="flex-1 p-3 rounded-xl border border-accent/20 bg-white/80 text-center">
                        <Zap className="w-5 h-5 text-foreground mx-auto mb-1" />
                        <p className="text-xs text-foreground/60">{t("homepage.fast")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By */}
        <section className="py-10 md:py-14 px-4 border-y border-accent/20">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-xs font-medium text-foreground/50 uppercase tracking-widest mb-6 md:mb-8">{t("homepage.trustedByLabel")}</p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-6 md:gap-8 items-center justify-items-center">
              {companies.map((name) => (
                <span key={name} className="text-lg md:text-xl font-bold text-foreground/20 tracking-tight select-none saturate-0 hover:saturate-100 transition-all duration-300">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 md:py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="text-center animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-7 h-7 text-foreground" />
                  </div>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-foreground/60 mt-1">{t(stat.labelKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Product Cards */}
        <section className="py-14 md:py-20 px-4 bg-grid">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-foreground text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                {t("homepage.plansTitle")}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="text-gradient">{t("homepage.productsTitle")}</span>
              </h2>
              <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
                {t("homepage.productsDesc")}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {products.map((product, i) => (
                <Card key={i} className="group border-accent/20 shadow-card hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 overflow-hidden bg-white">
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${product.accent} flex items-center justify-center shadow-lg`}>
                      <product.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mt-5 mb-2">{t(product.titleKey)}</h3>
                    <p className="text-sm text-foreground/60 mb-5 leading-relaxed">{t(product.descKey)}</p>
                    <ul className="space-y-2.5 mb-6">
                      {product.features.map((feat, fi) => (
                        <li key={fi} className="flex items-start gap-2.5 text-sm text-foreground/70">
                          <CheckCircle2 className="w-4 h-4 text-foreground mt-0.5 shrink-0" />
                          {t(feat)}
                        </li>
                      ))}
                    </ul>
                    <Link href={product.href}>
                      <Button variant="outline" className="w-full group-hover:border-primary/50 group-hover:text-foreground transition-colors border-accent/30">
                        {t("homepage.learnMore")} <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Analytics Preview */}
        <section className="py-14 md:py-20 px-4 relative">
          <div className="absolute inset-0 pointer-events-none">
            <DecorativePattern className="absolute top-0 right-0 w-64 h-64 opacity-30" />
            <DecorativePattern className="absolute bottom-0 left-0 w-48 h-48 opacity-20 rotate-45" />
          </div>
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in-up">
                <Badge className="mb-4 px-3 py-1 rounded-full bg-primary/10 text-foreground border-primary/20">Analytics</Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  <span className="text-gradient-primary">{t("homepage.analyticsTitle")}</span>
                </h2>
                <p className="text-lg text-foreground/60 mb-8 leading-relaxed">
                  {t("homepage.analyticsDesc")}
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{t("homepage.realTimeTitle")}</p>
                      <p className="text-xs text-foreground/60">{t("homepage.realTimeDesc")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent/10 to-primary/10 flex items-center justify-center">
                      <Target className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{t("homepage.geoTargetTitle")}</p>
                      <p className="text-xs text-foreground/60">{t("homepage.geoTargetDesc")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{t("homepage.deviceTitle")}</p>
                      <p className="text-xs text-foreground/60">{t("homepage.deviceDesc")}</p>
                    </div>
                  </div>
                </div>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/25" size="lg">
                    {t("homepage.startTracking")} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div className="animate-fade-in">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/10">
                  <Image
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80"
                    alt="Real-time analytics dashboard with charts and metrics"
                    width={600}
                    height={500}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-14 md:py-20 px-4 bg-grid relative">
          <div className="absolute inset-0 pointer-events-none">
            <DecorativePattern className="absolute top-10 left-10 w-40 h-40 opacity-40" />
            <DecorativePattern className="absolute bottom-10 right-10 w-40 h-40 opacity-30 rotate-90" />
          </div>
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-14">
              <Badge className="mb-4 px-3 py-1 rounded-full bg-primary/10 text-foreground border-primary/20">{t("homepage.testimonialsBadge")}</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="text-gradient">{t("homepage.testimonialsTitle")}</span>
              </h2>
              <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
                {t("homepage.testimonialsDesc")}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((tItem, i) => (
                <Card key={i} className="border-accent/20 shadow-card hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, s) => (
                        <Star key={s} className="w-4 h-4 text-accent fill-accent" />
                      ))}
                    </div>
                    <blockquote className="text-foreground/70 mb-6 leading-relaxed text-sm">
                      &ldquo;{t(tItem.quoteKey)}&rdquo;
                    </blockquote>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColors[i]} flex items-center justify-center text-white font-semibold text-sm shadow-lg`}>
                        {tItem.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{tItem.name}</p>
                        <p className="text-xs text-foreground/60">{t(tItem.titleKey)}, {tItem.company}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden py-16 md:py-24 px-4">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary" />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-40 h-40 bg-accent/30 rounded-full blur-[80px]" />
            <div className="absolute bottom-10 right-10 w-60 h-60 bg-accent/20 rounded-full blur-[100px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-muted/5 rounded-full blur-[120px]" />
            <DecorativePattern className="absolute top-20 right-20 w-48 h-48 opacity-20" />
            <DecorativePattern className="absolute bottom-20 left-20 w-36 h-36 opacity-15 rotate-45" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <Badge className="mb-5 px-4 py-1.5 text-sm bg-accent/20 text-muted border-accent/30 rounded-full font-medium">{t("homepage.ctaBadge")}</Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 text-muted leading-tight">
              {t("homepage.ctaTitle")}
            </h2>
            <p className="text-lg text-muted/70 mb-10 max-w-2xl mx-auto leading-relaxed">
              {t("homepage.ctaDesc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link href="/register" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-muted text-foreground hover:bg-muted/90 shadow-xl shadow-muted/20 px-8 text-base font-bold" size="lg">
                  {t("homepage.createAccount")} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/pricing" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-accent/40 text-muted hover:bg-accent/10 px-8 text-base">
                  {t("homepage.viewPlans")}
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}