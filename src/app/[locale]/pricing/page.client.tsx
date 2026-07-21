"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Image from "next/image";

type Plan = "PRO" | "BUSINESS" | "ENTERPRISE"

function getPaddlePriceId(plan: Plan, annual: boolean): string {
  if (plan === "PRO") {
    return annual
      ? (process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_ANNUAL ?? "")
      : (process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO ?? "")
  }
  if (plan === "BUSINESS") {
    return annual
      ? (process.env.NEXT_PUBLIC_PADDLE_PRICE_BUSINESS_ANNUAL ?? "")
      : (process.env.NEXT_PUBLIC_PADDLE_PRICE_BUSINESS ?? "")
  }
  if (plan === "ENTERPRISE") {
    return annual
      ? (process.env.NEXT_PUBLIC_PADDLE_PRICE_ENTERPRISE_ANNUAL ?? "")
      : (process.env.NEXT_PUBLIC_PADDLE_PRICE_ENTERPRISE ?? "")
  }
  return ""
}

const planConfig = [
  { key: "free", href: "/register", authHref: "/dashboard/billing?plan=FREE", popular: false, price: { monthly: 0, annual: 0 } },
  { key: "pro", href: "/register?plan=pro", authHref: "", popular: true, price: { monthly: 29, annual: 290 } },
  { key: "business", href: "/register?plan=business", authHref: "", popular: false, price: { monthly: 99, annual: 990 } },
  { key: "enterprise", href: "/contact", authHref: "/contact", popular: false, price: { monthly: null, annual: null } },
];

export default function PricingPageClient() {
  const locale = useLocale()
  const { data: session } = useSession()
  const t = useTranslations("pricing")
  const tRaw = useTranslations("pricing")
  const [annual, setAnnual] = useState(false);
  const [paddle, setPaddle] = useState<Awaited<ReturnType<typeof import("@paddle/paddle-js").initializePaddle>> | null>(null)
  const [paddleLoading, setPaddleLoading] = useState(false)
  const [upgrading, setUpgrading] = useState<string | null>(null)

  useEffect(() => {
    if (!session) return
    setPaddleLoading(true)
    async function initPaddle() {
      const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
      if (!clientToken) { setPaddleLoading(false); return }
      try {
        const { initializePaddle } = await import("@paddle/paddle-js")
        const instance = await initializePaddle({
          token: clientToken,
          environment: (process.env.NEXT_PUBLIC_PADDLE_ENV as "sandbox" | "production") ?? "sandbox",
        })
        setPaddle(instance)
      } catch {
        // Paddle SDK failed to load - fallback to billing page redirect
      } finally {
        setPaddleLoading(false)
      }
    }
    initPaddle()
  }, [session])

  async function handleCheckout(planId: Plan) {
    const priceId = getPaddlePriceId(planId, annual)
    if (!priceId) return
    if (!paddle) {
      window.location.href = `/dashboard/billing?plan=${planId}`
      return
    }
    setUpgrading(planId)
    try {
      let userId = ""
      try {
        const sessionRes = await fetch("/api/auth/session")
        const s = await sessionRes.json()
        userId = s?.user?.id ?? ""
      } catch {}
      await paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        customData: { userId, plan: planId },
        settings: { displayMode: "overlay", theme: "dark" },
      })
    } catch {
      window.location.href = `/dashboard/billing?plan=${planId}`
    } finally {
      setUpgrading(null)
    }
  }

  const isLoggedIn = !!session

  const plans = planConfig.map((p) => ({
    ...p,
    href: p.key === "free" && isLoggedIn ? "/dashboard/billing" : (p.authHref || (isLoggedIn ? "#" : p.href)),
    name: t(p.key + ".name"),
    desc: t(p.key + ".desc"),
    features: tRaw.raw(p.key + ".features") as string[],
    cta: t(p.key + ".cta"),
  }));

  const faqs = tRaw.raw("faq") as { q: string; a: string }[];

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://relurl.com" },
            { "@type": "ListItem", position: 2, name: "Pricing", item: `https://relurl.com/${locale}/pricing` },
          ],
        })}}
      />
      <Header />
      <main className="flex-1">
      <div className="py-24 px-4">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">{t("title")}</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
          {t("subtitle")}
        </p>
        <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 max-w-4xl mx-auto mb-10">
          <Image
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80"
            alt="Analytics and growth metrics dashboard"
            width={1200}
            height={400}
            className="w-full h-auto object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent" />
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-dark-600 p-1.5 border border-dark-300/50">
          <button
            onClick={() => setAnnual(false)}
            className={`relative px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
              !annual
                ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25"
                : "text-dark-100 hover:text-dark-50"
            }`}
          >
            {t("monthly")}
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={`relative px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
              annual
                ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25"
                : "text-dark-100 hover:text-dark-50"
            }`}
          >
            {t("annual")}
            <Badge variant="outline" className="ml-2 text-primary border-primary text-[10px]">
              {t("saveBadge")}
            </Badge>
          </button>
        </div>
      </div>
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.key}
            className={`relative border-border/50 flex flex-col ${plan.popular ? "border-primary shadow-xl shadow-primary/10 lg:scale-105" : ""}`}
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
                    {annual && plan.price.annual > 0 ? (
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold">${plan.price.annual}</span>
                        <span className="text-muted-foreground">/year</span>
                      </div>
                    ) : (
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold">${plan.price.monthly > 0 ? plan.price.monthly : 0}</span>
                        <span className="text-muted-foreground">{t("perMonth")}</span>
                      </div>
                    )}
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
              {plan.key === "free" || plan.key === "enterprise" || !isLoggedIn ? (
                <Link href={plan.href} className="w-full">
                  <Button
                    className={cn(
                      "w-full",
                      plan.key !== "free" && "bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/25"
                    )}
                    variant={plan.key === "free" ? "outline" : "default"}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              ) : (
                <Button
                  className="w-full bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/25"
                  onClick={() => handleCheckout(plan.key.toUpperCase() as Plan)}
                  disabled={upgrading === plan.key.toUpperCase()}
                >
                  {upgrading === plan.key.toUpperCase() ? (
                    <><span className="mr-2 h-4 w-4 animate-spin inline-block">⟳</span> Processing...</>
                  ) : paddleLoading ? (
                    "Loading..."
                  ) : (
                    plan.cta
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Comparison hint vs TinyURL */}
      <div className="max-w-4xl mx-auto mt-20 mb-8">
        <Card className="border-accent/20 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-foreground/70 mb-2">
              <span className="font-semibold text-foreground">Why choose RELURL?</span> Unlike TinyURL's free plan (zero analytics, no link editing), every RELURL plan includes click analytics, geo & device data, and permanent links. No link expiration. Ever.
            </p>
            <Link href="/relurl-vs-tinyurl" className="text-sm text-accent hover:text-accent/80 font-medium inline-flex items-center gap-1">
              Full comparison → <ArrowRight className="w-3 h-3" />
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-3xl mx-auto mt-8">
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
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-40 h-40 bg-accent/20 rounded-full blur-[80px]" />
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">{t("ctaTitle")}</h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">{t("ctaDesc")}</p>
          <Link href={isLoggedIn ? "/dashboard/billing" : "/register"}>
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-xl shadow-black/20 px-8 font-bold">
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
