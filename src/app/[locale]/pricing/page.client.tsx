"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const planConfig = [
  { key: "free", href: "/register", popular: false, price: { monthly: 0, annual: 0 } },
  { key: "pro", href: "/register?plan=pro", popular: true, price: { monthly: 12, annual: 9 } },
  { key: "business", href: "/contact", popular: false, price: { monthly: 49, annual: 39 } },
  { key: "enterprise", href: "/contact", popular: false, price: { monthly: null, annual: null } },
];

export default function PricingPageClient() {
  const locale = useLocale()
  const t = useTranslations("pricing")
  const tRaw = useTranslations("pricing")
  const [annual, setAnnual] = useState(false);

  const plans = planConfig.map((p) => ({
    ...p,
    name: t(p.key + ".name"),
    desc: t(p.key + ".desc"),
    features: tRaw.raw(p.key + ".features") as string[],
    cta: t(p.key + ".cta"),
  }));

  const faqs = tRaw.raw("faq") as { q: string; a: string }[];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
      <div className="py-24 px-4">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">{t("title")}</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
          {t("subtitle")}
        </p>
        <div className="flex items-center justify-center gap-4">
          <span className={annual ? "text-muted-foreground" : "text-white font-medium"}>{t("monthly")}</span>
          <button
            onClick={() => setAnnual(!annual)}
            className="relative w-14 h-7 rounded-full bg-primary cursor-pointer transition-colors"
            aria-label={t("toggleAria", { billing: annual ? "monthly" : "annual" })}
          >
            <div
              className={`absolute top-0.5 w-6 h-6 rounded-full bg-white transition-all ${annual ? "left-7" : "left-0.5"}`}
            />
          </button>
          <span className={annual ? "text-white font-medium" : "text-muted-foreground"}>
            {t("annual")}
            <Badge variant="outline" className="ml-2 text-primary border-primary">
              {t("saveBadge")}
            </Badge>
          </span>
        </div>
      </div>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.key}
            className={`relative border-border/50 flex flex-col ${plan.popular ? "border-primary shadow-xl shadow-primary/10 scale-105" : ""}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">{t("popularBadge")}</Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.desc}</CardDescription>
              <div className="mt-4">
                {plan.price.monthly !== null ? (
                  <>
                    <span className="text-4xl font-bold">
                      ${annual ? plan.price.annual : plan.price.monthly}
                    </span>
                    <span className="text-muted-foreground ml-1">{t("perMonth")}</span>
                  </>
                ) : (
                  <span className="text-3xl font-bold">{t("custom")}</span>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Link href={plan.href} className="w-full">
                <Button className={cn("w-full", plan.popular && "bg-gradient-to-r from-[#AA1C41] to-[#E68457] text-white hover:from-[#8f1a39] hover:to-[#d97a4f] shadow-lg shadow-[#AA1C41]/25")} variant={plan.popular ? "default" : "outline"}>
                  {plan.cta}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="max-w-3xl mx-auto mt-24">
        <h2 className="text-2xl font-bold text-center mb-10">{t("faqTitle")}</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <Card key={i} className="border-border/50">
              <CardContent className="p-4">
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer font-medium">
                    {faq.q}
                    <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-3 text-muted-foreground text-sm">{faq.a}</p>
                </details>
              </CardContent>
            </Card>
          ))}
        </div>
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
      </main>
      <Footer />
    </div>
  );
}
