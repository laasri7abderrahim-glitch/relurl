import { generateSEOMetadata } from "@/lib/seo"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "DMCA Policy - Copyright Complaints",
    description: "Learn how to submit a DMCA copyright complaint regarding content on the RELURL platform.",
    path: "/dmca",
    locale,
  })
}

export default function DmcaPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-dark-700">
        <section className="container py-20 max-w-3xl">
          <h1 className="text-4xl font-bold text-dark-50 mb-8">DMCA Policy</h1>
          <div className="prose prose-invert max-w-none space-y-6 text-dark-100">
            <p><em>Last updated: June 2026</em></p>

            <h2 className="text-xl font-bold text-dark-50">Reporting Copyright Infringement</h2>
            <p>RELURL respects the intellectual property of others. If you believe that content hosted through our service infringes your copyright, please submit a DMCA takedown request.</p>

            <h2 className="text-xl font-bold text-dark-50">How to File a DMCA Notice</h2>
            <p>Your written notice must include:</p>
            <ul className="space-y-2 mt-4">
              <li>1. A physical or electronic signature of the copyright owner or authorized agent</li>
              <li>2. Identification of the copyrighted work claimed to be infringed</li>
              <li>3. Identification of the infringing material and its location on RELURL</li>
              <li>4. Your contact information (name, address, phone, email)</li>
              <li>5. A statement that you have a good faith belief the use is unauthorized</li>
              <li>6. A statement under penalty of perjury that the information is accurate</li>
            </ul>

            <h2 className="text-xl font-bold text-dark-50 mt-8">Submit a Notice</h2>
            <div className="bg-dark-500 border border-dark-100 rounded-xl p-6">
              <p className="mb-3">Send DMCA notices to:</p>
              <p className="font-mono text-accent">dmca@relurl.com</p>
              <p className="mt-2 text-sm">or mail to:</p>
              <p className="text-sm">RELURL DMCA Agent<br />123 Privacy Way<br />San Francisco, CA 94102</p>
            </div>

            <h2 className="text-xl font-bold text-dark-50 mt-8">Counter-Notification</h2>
            <p>If your content was removed and you believe it was a mistake, you may file a counter-notification. Include your identification of the removed material and a statement under penalty of perjury.</p>

            <h2 className="text-xl font-bold text-dark-50">Repeat Infringers</h2>
            <p>RELURL will terminate accounts of users who are determined to be repeat infringers.</p>

            <h2 className="text-xl font-bold text-dark-50">Good Faith</h2>
            <p>File DMCA notices only for genuine copyright concerns. Abuse of the DMCA process may result in legal liability.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}