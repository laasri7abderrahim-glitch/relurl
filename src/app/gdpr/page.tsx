import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export const metadata: Metadata = {
  title: "GDPR - RELURL Data Protection",
  description: "RELURL GDPR compliance. Your data protection rights under the General Data Protection Regulation.",
  alternates: { canonical: "https://relurl.com/gdpr" },
}

export default function GdprPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-dark-700">
        <section className="container py-20 max-w-3xl">
          <h1 className="text-4xl font-bold text-dark-50 mb-8">GDPR Compliance</h1>
          <div className="prose prose-invert max-w-none space-y-6 text-dark-100">
            <p><em>Last updated: June 2026</em></p>

            <h2 className="text-xl font-bold text-dark-50">Your Rights Under GDPR</h2>
            <p>If you are in the European Economic Area (EEA), you have the following rights:</p>

            <div className="grid gap-4 mt-4">
              {[
                { right: "Right of Access", desc: "Request a copy of all personal data we hold about you." },
                { right: "Right to Rectification", desc: "Request correction of inaccurate personal data." },
                { right: "Right to Erasure", desc: "Request deletion of your personal data (\"right to be forgotten\")." },
                { right: "Right to Restrict Processing", desc: "Request limiting how we use your data." },
                { right: "Right to Data Portability", desc: "Receive your data in a structured, machine-readable format." },
                { right: "Right to Object", desc: "Object to processing of your personal data for marketing purposes." },
              ].map((item) => (
                <div key={item.right} className="bg-dark-500 border border-dark-100 rounded-lg p-4">
                  <h3 className="font-semibold text-dark-50">{item.right}</h3>
                  <p className="text-sm mt-1">{item.desc}</p>
                </div>
              ))}
            </div>

            <h2 className="text-xl font-bold text-dark-50 mt-8">Data We Collect</h2>
            <ul className="space-y-2">
              <li>• Account information (name, email)</li>
              <li>• Link data (URLs, slugs, tags)</li>
              <li>• Analytics data (clicks, countries, browsers)</li>
              <li>• Payment information (processed by Stripe)</li>
            </ul>

            <h2 className="text-xl font-bold text-dark-50">Data Retention</h2>
            <p>We retain your data as long as your account is active. Delete your account to remove all personal data within 30 days.</p>

            <h2 className="text-xl font-bold text-dark-50">Data Transfers</h2>
            <p>Data may be processed in the US or other countries where our service providers operate. We ensure appropriate safeguards are in place.</p>

            <h2 className="text-xl font-bold text-dark-50">Exercise Your Rights</h2>
            <p>To exercise any of these rights, contact our Data Protection Officer at <a href="mailto:dpo@relurl.com" className="text-[#2FA084] hover:underline">dpo@relurl.com</a> or manage your data from your <Link href="/dashboard/settings" className="text-[#2FA084] hover:underline">account settings</Link>.</p>

            <h2 className="text-xl font-bold text-dark-50">Complaints</h2>
            <p>You have the right to lodge a complaint with your local data protection authority if you believe your rights have been violated.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
