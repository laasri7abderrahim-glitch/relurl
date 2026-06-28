import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export const metadata: Metadata = {
  title: "Changelog - RELURL Updates & Features",
  description: "See what's new in RELURL. Latest features, improvements, and bug fixes for our URL shortener platform.",
  alternates: { canonical: "https://relurl.com/changelog" },
  openGraph: { title: "Changelog", description: "RELURL product updates." },
}

const updates = [
  {
    version: "2.0",
    date: "June 2026",
    title: "Tier 1 Features",
    changes: [
      "Retargeting Pixels - Add Facebook, Google, TikTok, LinkedIn, Twitter pixels to any link",
      "A/B Testing - Split traffic between multiple destinations with weighted distribution",
      "Smart Routing - Redirect by country, device, language, or time of day",
      "AI Link Optimization - Get AI-powered suggestions for best posting times and CTR",
      "Bio Pages - Create link-in-bio pages for social media",
    ],
  },
  {
    version: "1.5",
    date: "May 2026",
    title: "SEO & Landing Pages",
    changes: [
      "20 QR Code landing pages with unique SEO content",
      "10 URL Shortener landing pages",
      "7 Social Media Link Generator pages",
      "100/100 SEO score across all pages",
      "Internal linking and FAQ sections",
    ],
  },
  {
    version: "1.0",
    date: "April 2026",
    title: "Launch",
    changes: [
      "URL shortening with custom slugs and bulk creation",
      "QR code generation with customization",
      "Analytics dashboard with country, browser, device data",
      "Custom domains support",
      "Team management with roles",
      "API platform with 30+ endpoints",
      "Stripe billing integration",
      "Admin panel",
    ],
  },
]

export default function ChangelogPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-dark-700">
        <section className="container py-20 text-center">
          <h1 className="text-4xl font-bold text-dark-50 mb-4">Changelog</h1>
          <p className="text-lg text-dark-100 max-w-2xl mx-auto">
            See what&apos;s new in RELURL. We&apos;re constantly improving the platform.
          </p>
        </section>

        <section className="container pb-20 max-w-3xl">
          <div className="space-y-8">
            {updates.map((update) => (
              <div key={update.version} className="bg-dark-500 border border-dark-100 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-[#1F6F5F] text-white text-sm font-bold rounded-full">
                    v{update.version}
                  </span>
                  <span className="text-sm text-dark-100">{update.date}</span>
                </div>
                <h2 className="text-xl font-bold text-dark-50 mb-3">{update.title}</h2>
                <ul className="space-y-2">
                  {update.changes.map((change, i) => (
                    <li key={i} className="flex items-start gap-2 text-dark-100">
                      <span className="text-[#6FCF97] mt-1">✓</span>
                      {change}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
