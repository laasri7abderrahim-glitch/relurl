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
    accent: "from-[#AA1C41] to-[#E68457]",
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
    accent: "from-[#E68457] to-[#FFE8B4]",
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
    accent: "from-[#5E244E] to-[#AA1C41]",
  },
]

const testimonials = [
  { quoteKey: "homepage.testimonial1Quote", name: "Sarah Chen", titleKey: "homepage.testimonial1Title", company: "TechFlow Inc." },
  { quoteKey: "homepage.testimonial2Quote", name: "Marcus Johnson", titleKey: "homepage.testimonial2Title", company: "ScaleUp Labs" },
  { quoteKey: "homepage.testimonial3Quote", name: "Emily Rodriguez", titleKey: "homepage.testimonial3Title", company: "OmniMedia Group" },
]

const avatarColors = [
  "from-[#AA1C41] to-[#E68457]",
  "from-[#5E244E] to-[#AA1C41]",
  "from-[#E68457] to-[#5E244E]",
]

function DecorativeBlob({ className, color }: { className?: string; color: string }) {
  return (
    <svg className={className} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
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

      <Header />
      <main className="flex-1">

        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 pt-16 pb-16 md:pt-28 md:pb-32 bg-warm">
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
                <Badge className="mb-5 px-4 py-1.5 text-sm bg-[#AA1C41]/10 text-[#AA1C41] border-[#AA1C41]/20 rounded-full font-medium">{t("homepage.badge")}</Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight">
                  <span className="text-gradient">{t("homepage.title")}</span>
                </h1>
                <p className="text-lg text-[#5E244E]/70 mb-8 max-w-lg leading-relaxed">
                  {t("homepage.subtitle")}
                </p>

                <Card className="border-[#E68457]/20 shadow-xl shadow-[#AA1C41]/5">
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
                          <Button onClick={handleShorten} disabled={loading} className="h-12 sm:h-11 px-6 w-full sm:w-auto bg-gradient-to-r from-[#AA1C41] to-[#E68457] text-white hover:from-[#8f1a39] hover:to-[#d97a4f] shadow-lg shadow-[#AA1C41]/25">
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
                          <div className="mt-4 flex items-center justify-between p-3 bg-[#AA1C41]/5 border border-[#AA1C41]/20 rounded-lg">
                            <a href={shortUrl} target="_blank" className="text-[#AA1C41] font-medium truncate mr-4">
                              {shortUrl}
                            </a>
                            <Button variant="outline" size="sm" onClick={copyLink} className="shrink-0">
                              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                          </div>
                        )}
                        <p className="text-xs text-[#5E244E]/50 mt-3">
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
                          <Button onClick={handleGenerateQR} className="h-12 sm:h-11 px-6 w-full sm:w-auto bg-gradient-to-r from-[#AA1C41] to-[#E68457] text-white hover:from-[#8f1a39] hover:to-[#d97a4f] shadow-lg shadow-[#AA1C41]/25">
                            <QrCode className="w-4 h-4 mr-2" />
                            {t("homepage.generateButton")}
                          </Button>
                        </div>
                        {qrValue && (
                          <div className="mt-5 flex flex-col items-center gap-4">
                            <QRCode value={qrValue} size={180} />
                            <p className="text-sm text-[#5E244E]/60">{t("homepage.qrDescription")}</p>
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
                        <p className="text-xs text-[#5E244E]/50 mt-3">
                          {t("homepage.qrHelp")}
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>

                <div className="mt-5 flex items-center gap-2 text-sm text-[#5E244E]/60">
                  <Star className="w-4 h-4 text-[#E68457] fill-[#E68457]" />
                  <span>{t("homepage.trustedBy")}</span>
                </div>
              </div>

              {/* Right side - Hero illustration cards */}
              <div className="hidden md:block animate-fade-in">
                <div className="relative">
                  <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-[#E68457]/10 to-[#AA1C41]/5 rounded-3xl" />
                  <div className="relative p-6">
                    <div className="grid gap-4">
                      <Card className="border-[#E68457]/20 shadow-lg shadow-[#AA1C41]/5">
                        <CardContent className="p-5">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#AA1C41] to-[#E68457] flex items-center justify-center shadow-lg shadow-[#AA1C41]/20">
                              <Link2 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-[#5E244E]">{t("homepage.shortenerTitle")}</p>
                              <p className="text-xs text-[#5E244E]/60">{t("homepage.shortenerDesc")}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 p-2.5 bg-[#FFE8B4]/50 rounded-lg">
                            <Globe className="w-4 h-4 text-[#AA1C41] shrink-0" />
                            <span className="text-sm font-medium text-[#AA1C41] truncate">relurl.com/abc123</span>
                            <Badge className="ml-auto text-xs shrink-0 bg-[#AA1C41]/10 text-[#AA1C41] border-[#AA1C41]/20">
                              <CheckCircle2 className="w-3 h-3 mr-1" /> Live
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-[#E68457]/20 shadow-lg shadow-[#AA1C41]/5">
                        <CardContent className="p-5">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E68457] to-[#5E244E] flex items-center justify-center shadow-lg shadow-[#E68457]/20">
                              <BarChart3 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-[#5E244E]">{t("homepage.analyticsCardTitle")}</p>
                              <p className="text-xs text-[#5E244E]/60">{t("homepage.analyticsCardDesc")}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="text-center p-2 rounded-lg bg-[#FFE8B4]/50">
                              <p className="text-xs text-[#5E244E]/60">{t("homepage.clicks")}</p>
                              <p className="text-lg font-bold text-[#5E244E]">24.8K</p>
                            </div>
                            <div className="text-center p-2 rounded-lg bg-[#FFE8B4]/50">
                              <p className="text-xs text-[#5E244E]/60">{t("homepage.ctr")}</p>
                              <p className="text-lg font-bold text-[#5E244E]">12.4%</p>
                            </div>
                            <div className="text-center p-2 rounded-lg bg-[#FFE8B4]/50">
                              <p className="text-xs text-[#5E244E]/60">{t("homepage.countries")}</p>
                              <p className="text-lg font-bold text-[#5E244E]">32</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="flex gap-3">
                        <div className="flex-1 p-3 rounded-xl border border-[#E68457]/20 bg-white/80 text-center">
                          <QrCode className="w-5 h-5 text-[#AA1C41] mx-auto mb-1" />
                          <p className="text-xs text-[#5E244E]/60">{t("homepage.qrReady")}</p>
                        </div>
                        <div className="flex-1 p-3 rounded-xl border border-[#E68457]/20 bg-white/80 text-center">
                          <Shield className="w-5 h-5 text-[#AA1C41] mx-auto mb-1" />
                          <p className="text-xs text-[#5E244E]/60">{t("homepage.secure")}</p>
                        </div>
                        <div className="flex-1 p-3 rounded-xl border border-[#E68457]/20 bg-white/80 text-center">
                          <Zap className="w-5 h-5 text-[#AA1C41] mx-auto mb-1" />
                          <p className="text-xs text-[#5E244E]/60">{t("homepage.fast")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By */}
        <section className="py-10 md:py-14 px-4 border-y border-[#E68457]/20">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-xs font-medium text-[#5E244E]/50 uppercase tracking-widest mb-6 md:mb-8">{t("homepage.trustedByLabel")}</p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-6 md:gap-8 items-center justify-items-center">
              {companies.map((name) => (
                <span key={name} className="text-lg md:text-xl font-bold text-[#5E244E]/20 tracking-tight select-none saturate-0 hover:saturate-100 transition-all duration-300">
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
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#AA1C41]/10 to-[#E68457]/10 flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-7 h-7 text-[#AA1C41]" />
                  </div>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#5E244E]">{stat.value}</p>
                  <p className="text-sm text-[#5E244E]/60 mt-1">{t(stat.labelKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Product Cards */}
        <section className="py-14 md:py-20 px-4 bg-grid">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#AA1C41]/10 text-[#AA1C41] text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                {t("homepage.plansTitle")}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="text-gradient">{t("homepage.productsTitle")}</span>
              </h2>
              <p className="text-lg text-[#5E244E]/60 max-w-2xl mx-auto">
                {t("homepage.productsDesc")}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {products.map((product, i) => (
                <Card key={i} className="group border-[#E68457]/20 shadow-card hover:shadow-xl hover:shadow-[#AA1C41]/5 transition-all duration-300 hover:-translate-y-1 overflow-hidden bg-white">
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${product.accent} flex items-center justify-center shadow-lg`}>
                      <product.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[#5E244E] mt-5 mb-2">{t(product.titleKey)}</h3>
                    <p className="text-sm text-[#5E244E]/60 mb-5 leading-relaxed">{t(product.descKey)}</p>
                    <ul className="space-y-2.5 mb-6">
                      {product.features.map((feat, fi) => (
                        <li key={fi} className="flex items-start gap-2.5 text-sm text-[#5E244E]/70">
                          <CheckCircle2 className="w-4 h-4 text-[#AA1C41] mt-0.5 shrink-0" />
                          {t(feat)}
                        </li>
                      ))}
                    </ul>
                    <Link href={product.href}>
                      <Button variant="outline" className="w-full group-hover:border-[#AA1C41]/50 group-hover:text-[#AA1C41] transition-colors border-[#E68457]/30">
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
                <Badge className="mb-4 px-3 py-1 rounded-full bg-[#AA1C41]/10 text-[#AA1C41] border-[#AA1C41]/20">Analytics</Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  <span className="text-gradient-primary">{t("homepage.analyticsTitle")}</span>
                </h2>
                <p className="text-lg text-[#5E244E]/60 mb-8 leading-relaxed">
                  {t("homepage.analyticsDesc")}
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#AA1C41]/10 to-[#E68457]/10 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-[#AA1C41]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#5E244E]">{t("homepage.realTimeTitle")}</p>
                      <p className="text-xs text-[#5E244E]/60">{t("homepage.realTimeDesc")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#E68457]/10 to-[#AA1C41]/10 flex items-center justify-center">
                      <Target className="w-5 h-5 text-[#E68457]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#5E244E]">{t("homepage.geoTargetTitle")}</p>
                      <p className="text-xs text-[#5E244E]/60">{t("homepage.geoTargetDesc")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#5E244E]/10 to-[#AA1C41]/10 flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-[#5E244E]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#5E244E]">{t("homepage.deviceTitle")}</p>
                      <p className="text-xs text-[#5E244E]/60">{t("homepage.deviceDesc")}</p>
                    </div>
                  </div>
                </div>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-[#AA1C41] to-[#E68457] text-white hover:from-[#8f1a39] hover:to-[#d97a4f] shadow-lg shadow-[#AA1C41]/25" size="lg">
                    {t("homepage.startTracking")} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div className="animate-fade-in">
                <Card className="border-[#E68457]/20 shadow-xl shadow-[#AA1C41]/5 overflow-hidden bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#AA1C41]" />
                        <h4 className="font-semibold text-sm text-[#5E244E]">{t("homepage.performanceTitle")}</h4>
                      </div>
                      <Badge className="bg-[#FFE8B4] text-[#5E244E] border-[#E68457]/30 text-xs font-medium">
                        <Eye className="w-3 h-3 mr-1" /> {t("homepage.live")}
                      </Badge>
                    </div>
                    <div className="space-y-5">
                      <div>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-[#5E244E]/60">{t("homepage.totalClicks")}</span>
                          <span className="font-semibold text-[#5E244E]">24,846</span>
                        </div>
                        <div className="w-full bg-[#FFE8B4]/50 rounded-full h-2.5">
                          <div className="bg-gradient-to-r from-[#AA1C41] to-[#E68457] rounded-full h-2.5 w-[85%]" />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center py-2">
                        <div>
                          <p className="text-xs text-[#5E244E]/60 mb-0.5">{t("homepage.topCountry")}</p>
                          <p className="font-semibold text-sm text-[#5E244E]">{t("homepage.unitedStates")}</p>
                          <p className="text-xs text-[#5E244E]/50">43%</p>
                        </div>
                        <div className="border-x border-[#E68457]/20">
                          <p className="text-xs text-[#5E244E]/60 mb-0.5">{t("homepage.topDevice")}</p>
                          <p className="font-semibold text-sm text-[#5E244E]">{t("homepage.mobile")}</p>
                          <p className="text-xs text-[#5E244E]/50">68%</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#5E244E]/60 mb-0.5">{t("homepage.avgCtr")}</p>
                          <p className="font-semibold text-sm text-[#5E244E]">12.4%</p>
                          <p className="text-xs text-emerald-500">+2.1% ↑</p>
                        </div>
                      </div>
                      <div className="space-y-2 pt-5 border-t border-[#E68457]/20">
                        <p className="text-xs text-[#5E244E]/60 mb-3">{t("homepage.clicksLast7Days")}</p>
                        {[
                          { day: t("homepage.mon"), val: 70 },
                          { day: t("homepage.tue"), val: 45 },
                          { day: t("homepage.wed"), val: 90 },
                          { day: t("homepage.thu"), val: 60 },
                          { day: t("homepage.fri"), val: 85 },
                          { day: t("homepage.sat"), val: 50 },
                          { day: t("homepage.sun"), val: 75 },
                        ].map((d, i) => (
                          <div key={i} className="flex items-center gap-3 text-xs">
                            <span className="w-8 text-[#5E244E]/60">{d.day}</span>
                            <div className="flex-1 bg-[#FFE8B4]/50 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-[#AA1C41]/60 to-[#E68457]/60 rounded-full h-2 transition-[width] duration-500"
                                style={{ width: `${d.val}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
              <Badge className="mb-4 px-3 py-1 rounded-full bg-[#AA1C41]/10 text-[#AA1C41] border-[#AA1C41]/20">{t("homepage.testimonialsBadge")}</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="text-gradient">{t("homepage.testimonialsTitle")}</span>
              </h2>
              <p className="text-lg text-[#5E244E]/60 max-w-2xl mx-auto">
                {t("homepage.testimonialsDesc")}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((tItem, i) => (
                <Card key={i} className="border-[#E68457]/20 shadow-card hover:shadow-xl hover:shadow-[#AA1C41]/5 transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, s) => (
                        <Star key={s} className="w-4 h-4 text-[#E68457] fill-[#E68457]" />
                      ))}
                    </div>
                    <blockquote className="text-[#5E244E]/70 mb-6 leading-relaxed text-sm">
                      &ldquo;{t(tItem.quoteKey)}&rdquo;
                    </blockquote>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColors[i]} flex items-center justify-center text-white font-semibold text-sm shadow-lg`}>
                        {tItem.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-[#5E244E]">{tItem.name}</p>
                        <p className="text-xs text-[#5E244E]/60">{t(tItem.titleKey)}, {tItem.company}</p>
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
          <div className="absolute inset-0 bg-gradient-to-br from-[#5E244E] via-[#7a2e63] to-[#AA1C41]" />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-40 h-40 bg-[#E68457]/30 rounded-full blur-[80px]" />
            <div className="absolute bottom-10 right-10 w-60 h-60 bg-[#E68457]/20 rounded-full blur-[100px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#FFE8B4]/5 rounded-full blur-[120px]" />
            <DecorativePattern className="absolute top-20 right-20 w-48 h-48 opacity-20" />
            <DecorativePattern className="absolute bottom-20 left-20 w-36 h-36 opacity-15 rotate-45" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <Badge className="mb-5 px-4 py-1.5 text-sm bg-[#E68457]/20 text-[#FFE8B4] border-[#E68457]/30 rounded-full font-medium">{t("homepage.ctaBadge")}</Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 text-[#FFE8B4] leading-tight">
              {t("homepage.ctaTitle")}
            </h2>
            <p className="text-lg text-[#FFE8B4]/70 mb-10 max-w-2xl mx-auto leading-relaxed">
              {t("homepage.ctaDesc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link href="/register" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-[#FFE8B4] text-[#5E244E] hover:bg-[#FFE8B4]/90 shadow-xl shadow-[#FFE8B4]/20 px-8 text-base font-bold" size="lg">
                  {t("homepage.createAccount")} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/pricing" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-[#E68457]/40 text-[#FFE8B4] hover:bg-[#E68457]/10 px-8 text-base">
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