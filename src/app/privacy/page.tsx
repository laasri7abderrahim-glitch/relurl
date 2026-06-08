import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export const metadata: Metadata = {
  title: "Privacy Policy - RELURL",
  description: "RELURL privacy policy. Learn how we collect, use, and protect your personal information.",
  alternates: { canonical: "https://relurl.com/privacy" },
}

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-dark-700">
        <section className="container py-20 max-w-3xl">
          <h1 className="text-4xl font-bold text-dark-50 mb-8">Privacy Policy</h1>
          <div className="prose prose-invert max-w-none space-y-6 text-dark-100">
            <p><em>Last updated: June 2026</em></p>

            <h2 className="text-xl font-bold text-dark-50">1. Information We Collect</h2>
            <p>We collect information you provide directly, including account information (name, email, password), link data, and payment information. We also collect usage data such as IP addresses, browser type, and click analytics.</p>

            <h2 className="text-xl font-bold text-dark-50">2. How We Use Your Information</h2>
            <p>We use your information to provide and improve our services, process transactions, send communications, and ensure security. We do not sell your personal information to third parties.</p>

            <h2 className="text-xl font-bold text-dark-50">3. Data Storage</h2>
            <p>Your data is stored securely on encrypted servers. We use industry-standard security measures to protect your information.</p>

            <h2 className="text-xl font-bold text-dark-50">4. Cookies</h2>
            <p>We use cookies to maintain sessions and remember preferences. See our <Link href="/cookies" className="text-[#2FA084] hover:underline">Cookie Policy</Link> for details.</p>

            <h2 className="text-xl font-bold text-dark-50">5. Third-Party Services</h2>
            <p>We use Stripe for payments, Google for OAuth, and Resend for emails. Each has its own privacy policy governing data use.</p>

            <h2 className="text-xl font-bold text-dark-50">6. Your Rights</h2>
            <p>You can access, update, or delete your account data at any time from your dashboard. For EU users, see our <Link href="/gdpr" className="text-[#2FA084] hover:underline">GDPR page</Link>.</p>

            <h2 className="text-xl font-bold text-dark-50">7. Contact</h2>
            <p>For privacy concerns, contact us at <a href="mailto:privacy@relurl.com" className="text-[#2FA084] hover:underline">privacy@relurl.com</a>.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
