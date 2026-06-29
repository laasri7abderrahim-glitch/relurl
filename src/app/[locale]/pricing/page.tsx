"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: { monthly: 0, annual: 0 },
    desc: "Perfect for getting started with link shortening.",
    features: ["1,000 links/month", "1,000 clicks/month", "Basic analytics", "Standard support", "API access (100 req/hr)"],
    cta: "Get Started",
    href: "/register",
    popular: false,
  },
  {
    name: "Pro",
    price: { monthly: 12, annual: 9 },
    desc: "For professionals who need more power and control.",
    features: [
      "Unlimited links",
      "100,000 clicks/month",
      "Detailed analytics",
      "Custom branded domains",
      "Priority support",
      "API access (1,000 req/hr)",
      "Team seats (5)",
      "CSV export",
    ],
    cta: "Start Free Trial",
    href: "/register?plan=pro",
    popular: true,
  },
  {
    name: "Business",
    price: { monthly: 49, annual: 39 },
    desc: "For teams and businesses with advanced needs.",
    features: [
      "Unlimited links",
      "1,000,000 clicks/month",
      "Real-time analytics",
      "Multiple branded domains",
      "Dedicated support",
      "API access (10,000 req/hr)",
      "Team seats (25)",
      "Advanced integrations",
    ],
    cta: "Contact Sales",
    href: "/contact",
    popular: false,
  },
  {
    name: "Enterprise",
    price: { monthly: null, annual: null },
    desc: "Custom solutions for large organizations.",
    features: [
      "Everything in Business",
      "Unlimited clicks",
      "Custom SLA",
      "SSO/SAML",
      "Dedicated account manager",
      "Custom integrations",
      "On-premise option",
      "Unlimited team seats",
    ],
    cta: "Contact Us",
    href: "/contact",
    popular: false,
  },
];

const faqs = [
  { q: "Can I change my plan later?", a: "Yes, you can upgrade or downgrade at any time. Changes take effect immediately." },
  { q: "Is there a free trial?", a: "Yes, all paid plans come with a 14-day free trial. No credit card required." },
  { q: "What happens when I exceed my plan limits?", a: "We'll notify you and optionally auto-upgrade your plan or pause link creation." },
  { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time. You'll retain access until the end of your billing period." },
];

const baseUrl = "https://relurl.com"

export default function PricingPage() {
  const locale = useLocale()
  const [annual, setAnnual] = useState(false);

  return (
    <div className="py-24 px-4">
      <link rel="canonical" href={locale === "en" ? `${baseUrl}/pricing` : `${baseUrl}/${locale}/pricing`} />
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">Simple, Transparent Pricing</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
          Choose the plan that fits your needs. No hidden fees. No surprises.
        </p>
        <div className="flex items-center justify-center gap-4">
          <span className={annual ? "text-muted-foreground" : "text-white font-medium"}>Monthly</span>
          <button
            onClick={() => setAnnual(!annual)}
            className="relative w-14 h-7 rounded-full bg-primary cursor-pointer transition-colors"
            aria-label={`Switch to ${annual ? "monthly" : "annual"} billing`}
          >
            <div
              className={`absolute top-0.5 w-6 h-6 rounded-full bg-white transition-all ${annual ? "left-7" : "left-0.5"}`}
            />
          </button>
          <span className={annual ? "text-white font-medium" : "text-muted-foreground"}>
            Annual
            <Badge variant="outline" className="ml-2 text-primary border-primary">
              Save 20%
            </Badge>
          </span>
        </div>
      </div>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative border-border/50 flex flex-col ${plan.popular ? "border-primary shadow-xl shadow-primary/10 scale-105" : ""}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
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
                    <span className="text-muted-foreground ml-1">/month</span>
                  </>
                ) : (
                  <span className="text-3xl font-bold">Custom</span>
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
                <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                  {plan.cta}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="max-w-3xl mx-auto mt-24">
        <h2 className="text-2xl font-bold text-center mb-10">Frequently Asked Questions</h2>
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
    </div>
  );
}
