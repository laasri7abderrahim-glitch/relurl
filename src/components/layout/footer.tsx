"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Twitter, Github, Linkedin, Mail, ArrowRight, Check } from "lucide-react"

const footerSections = [
  { title: "layout.footer.product", key: "product", links: [
    { label: "layout.footer.features", href: "/features" },
    { label: "layout.footer.pricing", href: "/pricing" },
    { label: "layout.footer.integrations", href: "/integrations" },
    { label: "layout.footer.api", href: "/api" },
    { label: "layout.footer.changelog", href: "/changelog" },
    { label: "layout.footer.browserExtension", href: "/browser-extension" },
  ]},
  { title: "layout.footer.urlShortener", key: "url", links: [
    { label: "layout.footer.customURL", href: "/custom-url-shortener" },
    { label: "layout.footer.brandedLink", href: "/branded-link-shortener" },
    { label: "layout.footer.bulkURL", href: "/bulk-url-shortener" },
    { label: "layout.footer.freeURL", href: "/free-url-shortener" },
    { label: "layout.footer.allURLTools", href: "/custom-url-shortener" },
  ]},
  { title: "layout.footer.qrCodes", key: "qr", links: [
    { label: "layout.footer.qrGenerator", href: "/qr-code-generator" },
    { label: "layout.footer.dynamicQR", href: "/dynamic-qr-code-generator" },
    { label: "layout.footer.wifiQR", href: "/qr-code-for-wifi" },
    { label: "layout.footer.vcardQR", href: "/qr-code-for-vcard" },
    { label: "layout.footer.allQRCodes", href: "/qr-code-generator" },
  ]},
  { title: "layout.footer.socialLinks", key: "social", links: [
    { label: "layout.footer.instagram", href: "/instagram-link-generator" },
    { label: "layout.footer.whatsapp", href: "/whatsapp-link-generator" },
    { label: "layout.footer.tiktok", href: "/tiktok-bio-link-generator" },
    { label: "layout.footer.youtube", href: "/youtube-link-generator" },
    { label: "layout.footer.allSocial", href: "/instagram-link-generator" },
  ]},
  { title: "layout.footer.legal", key: "legal", links: [
    { label: "layout.footer.privacy", href: "/privacy" },
    { label: "layout.footer.terms", href: "/terms" },
    { label: "layout.footer.cookies", href: "/cookies" },
    { label: "layout.footer.gdpr", href: "/gdpr" },
    { label: "layout.footer.dmca", href: "/dmca" },
  ]},
]

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Mail, href: "#", label: "Email" },
]

function Footer() {
  const t = useTranslations()
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail("")
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <footer className="relative border-t border-border/60 bg-background overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />

      <div className="container relative z-10 section-padding">
        {/* Newsletter */}
        <div className="glass-card rounded-xl p-6 md:p-8 mb-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Get the latest updates
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Subscribe to our newsletter for new features and tips.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full md:w-64"
                required
              />
              <Button type="submit" disabled={subscribed}>
                {subscribed ? (
                  <><Check className="w-4 h-4 mr-1" /> Subscribed!</>
                ) : (
                  <><ArrowRight className="w-4 h-4 mr-1" /> Subscribe</>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Link Sections */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
          {footerSections.map((section) => (
            <div
              key={section.key}
              className={`glass-card rounded-lg p-4 ${
                section.key === "legal" ? "md:col-span-1" : ""
              }`}
            >
              <h3 className="mb-4 text-sm font-semibold text-foreground">
                {t(section.title)}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {t(link.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border/30">
          <div className="glass-card rounded-lg px-6 py-4">
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center gap-1.5 text-lg font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">REL</span>
                  <span className="text-foreground">URL</span>
                </Link>
                <div className="hidden sm:flex items-center gap-3">
                  {socialLinks.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      className="group relative flex items-center justify-center w-8 h-8 rounded-full text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
                      aria-label={s.label}
                    >
                      <div className="absolute inset-0 rounded-full bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300" />
                      <s.icon className="w-4 h-4 relative z-10" />
                    </a>
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {t("layout.footer.copyright")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
