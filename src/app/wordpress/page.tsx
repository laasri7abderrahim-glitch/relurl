import type { Metadata } from "next"
import { generateSEOMetadata } from "@/lib/seo"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Check, ArrowRight, Zap, BarChart3, Shield, Globe } from "lucide-react"

export const metadata: Metadata = generateSEOMetadata({
  title: "WordPress URL Shortener Plugin",
  description: "Shorten links, track clicks, and manage UTM campaigns directly from WordPress. Free plugin with one-click install and bulk shortening.",
  path: "/wordpress",
  keywords: ["wordpress url shortener", "wordpress plugin", "link shortener plugin", "utm builder wordpress"],
})

const features = [
  { icon: Zap, title: "One-Click Shortening", desc: "Shorten any URL directly from the WordPress admin bar or the dedicated page." },
  { icon: BarChart3, title: "Click Analytics", desc: "View real-time click stats for all your short links without leaving WordPress." },
  { icon: Globe, title: "Bulk Shorten", desc: "Shorten up to 50 URLs at once. Perfect for migrating existing content." },
  { icon: Shield, title: "Retargeting Pixels", desc: "Auto-attach Facebook and Google pixels to every short link for retargeting." },
]

const steps = [
  { step: "1", title: "Install Plugin", desc: "Upload the RELURL plugin to your WordPress site and activate it." },
  { step: "2", title: "Enter API Key", desc: "Get your free API key from relurl.com and paste it in the settings." },
  { step: "3", title: "Start Shortening", desc: "Use the admin bar, shortcodes, or the meta box to create short links." },
]

export default function WordPressPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              WordPress Plugin
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gradient leading-tight">
              URL Shortener for WordPress
            </h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Shorten links, track clicks, and manage UTM campaigns directly from your WordPress dashboard. Free plugin with one-click install.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/register">
                <Button size="lg" className="px-8">Get Free API Key <ArrowRight className="ml-2 w-4 h-4" /></Button>
              </Link>
              <a href="https://wordpress.org/plugins/relurl/" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="px-8">Download Plugin</Button>
              </a>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gradient">Everything You Need</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((f, i) => (
                <Card key={i} className="border-border/50">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <f.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gradient">Get Started in 3 Steps</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">{s.step}</div>
                  <h3 className="font-semibold mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Shortcode Example */}
        <section className="py-24 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-gradient">Simple Shortcode</h2>
            <Card className="border-border/50">
              <CardContent className="p-8">
                <pre className="bg-dark-300/50 rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`[relurl url="https://example.com/long-page" text="Click here" slug="my-link"]`}
                </pre>
                <p className="text-sm text-muted-foreground mt-4">
                  Use shortcodes in posts, pages, or widgets. Parameters: <code>url</code> (required), <code>text</code>, <code>slug</code>
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-gradient">Ready to Supercharge WordPress?</h2>
            <p className="text-muted-foreground mb-8">Free plugin, free tier. Start shortening links today.</p>
            <Link href="/register">
              <Button size="lg" className="px-8">Get Started Free <ArrowRight className="ml-2 w-4 h-4" /></Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
