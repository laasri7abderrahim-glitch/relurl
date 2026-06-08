import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export const metadata: Metadata = {
  title: "Terms of Service - RELURL",
  description: "RELURL terms of service. Read our terms and conditions for using the URL shortener platform.",
  alternates: { canonical: "https://relurl.com/terms" },
}

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-dark-700">
        <section className="container py-20 max-w-3xl">
          <h1 className="text-4xl font-bold text-dark-50 mb-8">Terms of Service</h1>
          <div className="prose prose-invert max-w-none space-y-6 text-dark-100">
            <p><em>Last updated: June 2026</em></p>

            <h2 className="text-xl font-bold text-dark-50">1. Acceptance of Terms</h2>
            <p>By using RELURL, you agree to these terms. If you do not agree, do not use our services.</p>

            <h2 className="text-xl font-bold text-dark-50">2. Service Description</h2>
            <p>RELURL provides URL shortening, QR code generation, analytics, and related marketing tools. We reserve the right to modify or discontinue services at any time.</p>

            <h2 className="text-xl font-bold text-dark-50">3. Account Responsibilities</h2>
            <p>You are responsible for maintaining account security and all activities under your account. You must be at least 18 years old to use our services.</p>

            <h2 className="text-xl font-bold text-dark-50">4. Acceptable Use</h2>
            <p>You may not use RELURL for spam, phishing, malware distribution, illegal content, or any activity that violates applicable laws. We reserve the right to suspend accounts that violate these terms.</p>

            <h2 className="text-xl font-bold text-dark-50">5. Payment Terms</h2>
            <p>Paid plans are billed in advance. Refunds are available within 14 days of purchase. Stripe processes all payments.</p>

            <h2 className="text-xl font-bold text-dark-50">6. Intellectual Property</h2>
            <p>RELURL and its content are owned by us. You retain ownership of your links and content.</p>

            <h2 className="text-xl font-bold text-dark-50">7. Limitation of Liability</h2>
            <p>RELURL is provided &quot;as is&quot; without warranties. We are not liable for any damages arising from use of our services.</p>

            <h2 className="text-xl font-bold text-dark-50">8. Changes to Terms</h2>
            <p>We may update these terms at any time. Continued use constitutes acceptance of modified terms.</p>

            <h2 className="text-xl font-bold text-dark-50">9. Contact</h2>
            <p>For questions about these terms, contact <a href="mailto:legal@relurl.com" className="text-[#2FA084] hover:underline">legal@relurl.com</a>.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
