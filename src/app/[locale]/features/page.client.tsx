"use client";

import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Globe, Link2, QrCode, Shield, Users, Zap, Sliders, ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const featureConfig = [
  { icon: Link2, key: "linkShortening" },
  { icon: Globe, key: "brandedDomains" },
  { icon: BarChart3, key: "advancedAnalytics" },
  { icon: QrCode, key: "qrCodes" },
  { icon: Zap, key: "apiPlatform" },
  { icon: Users, key: "teamCollab" },
  { icon: Shield, key: "enterpriseSecurity" },
  { icon: Sliders, key: "linkManagement" },
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
  }));
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
                {t("title")}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t("subtitle")}
              </p>
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
                    <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-transparent">
                      <CardContent className="p-8">
                        <div className="aspect-video rounded-lg bg-background/50 border border-border/50 flex items-center justify-center">
                          <feature.icon className="w-24 h-24 text-primary/30" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
            <div className="relative overflow-hidden rounded-3xl p-12 text-center mt-24">
              <div className="absolute inset-0 bg-gradient-to-br from-[#5E244E] via-[#7a2e63] to-[#AA1C41]" />
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-40 h-40 bg-[#E68457]/20 rounded-full blur-[80px]" />
              </div>
              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#FFE8B4]">{t("ctaTitle")}</h2>
                <p className="text-[#FFE8B4]/70 mb-8 max-w-xl mx-auto">{t("ctaDesc")}</p>
                <Link href="/register">
                  <Button size="lg" className="bg-[#FFE8B4] text-[#5E244E] hover:bg-[#FFE8B4]/90 shadow-xl shadow-[#FFE8B4]/20 px-8 font-bold">
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
