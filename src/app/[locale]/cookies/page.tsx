import { generateSEOMetadata } from "@/lib/seo"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Cookie Policy - How RELURL Uses Cookies",
    description: "Learn about how RELURL uses cookies and similar technologies to improve your browsing experience.",
    path: "/cookies",
    locale,
  })
}

const cookies = [
  { name: "next-auth.session-token", purpose: "Maintains your login session", type: "Essential", duration: "30 days" },
  { name: "next-auth.csrf-token", purpose: "Protects against CSRF attacks", type: "Essential", duration: "Session" },
  { name: "next-auth.callback-url", purpose: "Stores redirect URL after login", type: "Essential", duration: "Session" },
  { name: "_vercel_insights", purpose: "Analytics to improve performance", type: "Analytics", duration: "1 year" },
]

export default function CookiesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-dark-700">
        <section className="container py-20 max-w-3xl">
          <h1 className="text-4xl font-bold text-dark-50 mb-8">Cookie Policy</h1>
          <div className="prose prose-invert max-w-none space-y-6 text-dark-100">
            <p><em>Last updated: June 2026</em></p>

            <h2 className="text-xl font-bold text-dark-50">What Are Cookies</h2>
            <p>Cookies are small text files stored on your device when you visit a website. They help us provide a better experience.</p>

            <h2 className="text-xl font-bold text-dark-50">Cookies We Use</h2>
            <div className="bg-dark-500 border border-dark-100 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dark-100">
                    <th className="text-left p-3 text-dark-50">Cookie</th>
                    <th className="text-left p-3 text-dark-50">Purpose</th>
                    <th className="text-left p-3 text-dark-50">Type</th>
                    <th className="text-left p-3 text-dark-50">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {cookies.map((c) => (
                    <tr key={c.name} className="border-b border-dark-100 last:border-0">
                      <td className="p-3 font-mono text-xs text-[#6FCF97]">{c.name}</td>
                      <td className="p-3">{c.purpose}</td>
                      <td className="p-3">{c.type}</td>
                      <td className="p-3">{c.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 className="text-xl font-bold text-dark-50">Managing Cookies</h2>
            <p>You can control cookies through your browser settings. Disabling essential cookies may affect functionality.</p>

            <h2 className="text-xl font-bold text-dark-50">Third-Party Cookies</h2>
            <p>Stripe may set cookies during payment processing. Their use is governed by Stripe&apos;s privacy policy.</p>

            <h2 className="text-xl font-bold text-dark-50">Contact</h2>
            <p>For cookie-related questions, contact <a href="mailto:privacy@relurl.com" className="text-[#2FA084] hover:underline">privacy@relurl.com</a>.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}