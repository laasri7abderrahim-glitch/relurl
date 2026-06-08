"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Globe, Link2, QrCode, Shield, Users, Zap, Sliders, ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const features = [
  {
    icon: Link2,
    title: "Link Shortening",
    desc: "Shorten any long URL into a clean, manageable link in seconds. Our engine handles millions of links daily with 99.9% uptime.",
    details: [
      "Instant URL shortening",
      "Custom aliases (your-brand/your-link)",
      "Expiration dates for time-sensitive links",
      "Password protection for sensitive content",
      "Bulk creation via CSV upload or API",
    ],
  },
  {
    icon: Globe,
    title: "Branded Domains",
    desc: "Use your own domain name for all your shortened links. Build trust and brand recognition with every click.",
    details: [
      "Custom domain support (link.yourbrand.com)",
      "Free SSL certificates",
      "Domain verification in one click",
      "Unlimited branded domains on Pro+",
      "White-label redirect pages",
    ],
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    desc: "Get deep insights into who clicks your links, when, and from where. Make data-driven decisions.",
    details: [
      "Real-time click tracking",
      "Geographic data (country, city)",
      "Device & browser breakdown",
      "Referrer tracking",
      "Export to CSV, Excel, or PDF",
    ],
  },
  {
    icon: QrCode,
    title: "QR Codes",
    desc: "Generate beautiful QR codes for any shortened link. Customize colors, add logos, and download in multiple formats.",
    details: [
      "Dynamic QR codes (edit destination anytime)",
      "Custom colors & branding",
      "High-resolution SVG & PNG export",
      "Bulk QR code generation",
      "QR code analytics & scan tracking",
    ],
  },
  {
    icon: Zap,
    title: "API Platform",
    desc: "Integrate link shortening into your workflow with our powerful REST API. Comprehensive documentation and SDKs.",
    details: [
      "RESTful API with key-based auth",
      "Create, update, delete links programmatically",
      "Webhook notifications on clicks",
      "Rate limiting: up to 10,000 req/hr",
      "OpenAPI/Swagger documentation",
    ],
  },
  {
    icon: Users,
    title: "Team Collaboration",
    desc: "Work together with your team. Share link management, analytics, and billing in one workspace.",
    details: [
      "Multi-user workspaces",
      "Role-based access (Owner, Admin, Member)",
      "Shared link libraries",
      "Team analytics & reporting",
      "Centralized billing",
    ],
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    desc: "Keep your links and data safe with enterprise-grade security features and compliance certifications.",
    details: [
      "SSL/TLS encryption everywhere",
      "Link password protection",
      "Abuse detection & prevention",
      "Audit logs for all actions",
      "GDPR & CCPA compliant",
    ],
  },
  {
    icon: Sliders,
    title: "Link Management",
    desc: "Organize, search, and manage thousands of links from a powerful dashboard. Never lose track of a link again.",
    details: [
      "Bulk operations (edit, delete, archive)",
      "Advanced search & filtering",
      "Tags & categories",
      "Link health monitoring",
      "Broken link detection",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <link rel="canonical" href="https://relurl.com/features" />
      <Header />
      <main className="flex-1">
        <div className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
                Everything You Need for Link Management
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From simple link shortening to enterprise-grade analytics and security — we&apos;ve got you covered.
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
            <div className="text-center mt-24">
              <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
              <p className="text-muted-foreground mb-8">Create your free account and start shortening links in seconds.</p>
              <Link href="/register">
                <Button size="lg" className="px-8">
                  Get Started Free <ArrowRight className="ml-2 w-4 h-4" />
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
