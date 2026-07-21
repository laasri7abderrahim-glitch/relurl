"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { DecorativePattern } from "@/components/ui/decorative-pattern"
import {
  Chrome,
  Zap,
  Copy,
  QrCode,
  Smartphone,
  Globe,
  CheckCircle2,
  ArrowRight,
  Star,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react"

const features = [
  {
    icon: Zap,
    titleKey: "extension.feature1Title",
    descKey: "extension.feature1Desc",
  },
  {
    icon: Copy,
    titleKey: "extension.feature2Title",
    descKey: "extension.feature2Desc",
  },
  {
    icon: QrCode,
    titleKey: "extension.feature3Title",
    descKey: "extension.feature3Desc",
  },
  {
    icon: Globe,
    titleKey: "extension.feature4Title",
    descKey: "extension.feature4Desc",
  },
]

const howItWorks = [
  {
    stepKey: "extension.howItWorks1Title",
    descKey: "extension.howItWorks1Desc",
  },
  {
    stepKey: "extension.howItWorks2Title",
    descKey: "extension.howItWorks2Desc",
  },
  {
    stepKey: "extension.howItWorks3Title",
    descKey: "extension.howItWorks3Desc",
  },
]

const reasons = [
  "extension.why1",
  "extension.why2",
  "extension.why3",
  "extension.why4",
]

export default function BrowserExtensionPage() {
  const t = useTranslations()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">

        {/* Hero */}
        <section className="relative overflow-hidden px-4 pt-20 pb-24 md:pt-28 md:pb-32 bg-warm">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-primary/10 via-accent/5 to-transparent rounded-full blur-[100px]" />
            <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-accent/10 via-primary/5 to-transparent rounded-full blur-[100px]" />
            <DecorativePattern className="absolute top-20 right-20 w-48 h-48 opacity-50" />
            <DecorativePattern className="absolute bottom-20 left-20 w-36 h-36 opacity-40 rotate-45" />
          </div>
          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <Badge className="mb-5 px-4 py-1.5 text-sm bg-primary/10 text-foreground border-primary/20 rounded-full font-medium inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              {t("extension.badge")}
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight">
              <span className="text-gradient">{t("extension.title")}</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/70 mb-6 max-w-2xl mx-auto leading-relaxed">
              {t("extension.subtitle")}
            </p>
            <p className="text-base text-foreground/60 mb-10 max-w-xl mx-auto">
              {t("extension.desc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/25 px-8 text-base">
                <Chrome className="w-5 h-5 mr-2" />
                {t("extension.addToChrome")}
              </Button>
              <Button size="lg" variant="outline" className="border-accent/30 px-8 text-base" disabled>
                {t("extension.addToFirefox")}
              </Button>
            </div>
            <p className="text-sm text-foreground/50">
              {t("extension.browsersSupported")}
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 md:py-24 px-4 bg-grid">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="text-gradient">{t("extension.whyTitle")}</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feat, i) => (
                <Card key={i} className="border-accent/20 shadow-card hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto mb-5">
                      <feat.icon className="w-7 h-7 text-foreground" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{t(feat.titleKey)}</h3>
                    <p className="text-sm text-foreground/60 leading-relaxed">{t(feat.descKey)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="text-gradient">{t("extension.howItWorksTitle")}</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {howItWorks.map((step, i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary/5">
                    <span className="text-2xl font-bold text-foreground">{i + 1}</span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{t(step.stepKey)}</h3>
                  <p className="text-sm text-foreground/60 leading-relaxed">{t(step.descKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Section */}
        <section className="py-14 md:py-20 px-4 bg-grid">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="text-gradient">{t("extension.whyTitle")}</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {reasons.map((reason, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-accent/20 shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-foreground shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground/70">{t(reason)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-14 md:py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">FAQs</h2>
            <div className="space-y-4">
              {[
                { q: "extension.faq1Q", a: "extension.faq1A" },
                { q: "extension.faq2Q", a: "extension.faq2A" },
                { q: "extension.faq3Q", a: "extension.faq3A" },
              ].map((faq, i) => (
                <details key={i} className="group border border-accent/20 rounded-xl overflow-hidden bg-white">
                  <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-medium text-foreground hover:bg-accent/5 transition-colors">
                    {t(faq.q)}
                    <ChevronRight className="w-4 h-4 text-foreground/40 group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="px-4 pb-4 text-sm text-foreground/60 leading-relaxed">
                    {t(faq.a)}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden py-16 md:py-24 px-4">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary" />
          <div className="absolute inset-0 opacity-20">
            <DecorativePattern className="absolute top-20 right-20 w-48 h-48 opacity-20" />
            <DecorativePattern className="absolute bottom-20 left-20 w-36 h-36 opacity-15 rotate-45" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 text-muted leading-tight">
              {t("extension.ctaTitle")}
            </h2>
            <p className="text-lg text-muted/70 mb-10 max-w-2xl mx-auto">
              {t("extension.ctaDesc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Button size="lg" className="bg-muted text-foreground hover:bg-muted/90 shadow-xl shadow-muted/20 px-8 text-base font-bold">
                <Chrome className="w-5 h-5 mr-2" />
                {t("extension.addToChrome")}
              </Button>
              <Button size="lg" variant="outline" className="border-accent/40 text-muted hover:bg-accent/10 px-8 text-base" disabled>
                {t("extension.comingSoon")}
              </Button>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
