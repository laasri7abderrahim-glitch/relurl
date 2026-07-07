"use client";

import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Globe, Link2, QrCode, Shield, Users, Zap, Sliders, ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Image from "next/image";

const featureConfig = [
  { icon: Link2, key: "linkShortening", img: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80", alt: "Link shortening interface preview" },
  { icon: Globe, key: "brandedDomains", img: "https://images.unsplash.com/photo-1504711434969-e33886168d8c?w=600&q=80", alt: "Branded domains and custom links" },
  { icon: BarChart3, key: "advancedAnalytics", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80", alt: "Advanced analytics dashboard with charts" },
  { icon: QrCode, key: "qrCodes", img: "https://images.unsplash.com/photo-1595079676334-5e40e64cecbf?w=600&q=80", alt: "QR code scanning on smartphone" },
  { icon: Zap, key: "apiPlatform", img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80", alt: "API and developer platform code" },
  { icon: Users, key: "teamCollab", img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80", alt: "Team collaboration and workspace" },
  { icon: Shield, key: "enterpriseSecurity", img: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&q=80", alt: "Enterprise security and data protection" },
  { icon: Sliders, key: "linkManagement", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80", alt: "Link management control panel" },
];

export default function FeaturesPageClient() {
  const locale = useLocale()
  const t = useTranslations("features")
  const tRaw = useTranslations("features")
  const features = featureConfig.map((f) => ({
    icon: f.icon,
    title: t(f.key + ".title"),
    desc: t(f.key + ".desc"),
    details: tRaw.raw(f.key + ".details") as string[],
    img: f.img,
    alt: f.alt,
  }));
  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://relurl.com" },
            { "@type": "ListItem", position: 2, name: "Features", item: `https://relurl.com/${locale}/features` },
          ],
        })}}
      />
      <Header />
      <main className="flex-1">
        <div className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
                {t("title")}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
                {t("subtitle")}
              </p>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 max-w-4xl mx-auto">
                <Image
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80"
                  alt="URL shortener analytics dashboard overview"
                  width={1200}
                  height={500}
                  className="w-full h-auto object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent" />
              </div>
            </div>
            <div className="space-y-24">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-12 items-center`}
                >
                  <div className="flex-1">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                      <feature.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">{feature.title}</h2>
                    <p className="text-lg text-muted-foreground mb-6">{feature.desc}</p>
                    <ul className="space-y-3">
                      {feature.details.map((d, j) => (
                        <li key={j} className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex-1 w-full">
                    <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-transparent overflow-hidden">
                      <CardContent className="p-0 overflow-hidden">
                        <div className="relative aspect-video">
                          <Image
                            src={feature.img}
                            alt={feature.alt}
                            fill
                            className="object-cover"
                            loading="lazy"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
            <div className="relative overflow-hidden rounded-3xl p-12 text-center mt-24">
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary" />
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-40 h-40 bg-accent/20 rounded-full blur-[80px]" />
              </div>
              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-muted">{t("ctaTitle")}</h2>
                <p className="text-muted/70 mb-8 max-w-xl mx-auto">{t("ctaDesc")}</p>
                <Link href="/register">
                  <Button size="lg" className="bg-muted text-foreground hover:bg-muted/90 shadow-xl shadow-muted/20 px-8 font-bold">
                    {t("ctaButton")} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
