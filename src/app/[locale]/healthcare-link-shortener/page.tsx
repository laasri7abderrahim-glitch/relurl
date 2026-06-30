import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Healthcare Link Shortener - Medical & Patient Links",
    description: "Shorten patient portal links, appointment booking URLs, and health resources. Secure, HIPAA-conscious link management with RELURL.",
    path: "/healthcare-link-shortener",
    keywords: ["healthcare link shortener", "medical link generator", "patient portal links"],
    locale,
  })
}

export default function HealthcareLinkShortenerPage() {
  const href = "/healthcare-link-shortener"
  const relatedArticles = getPostsByLandingPage("/healthcare-link-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="Healthcare Link Shortener"
      subtitle="Simplify Patient Access"
      description="Shorten patient portal links, appointment booking URLs, and health resources. Make it easy for patients to find and access your services."
      placeholder="https://clinic.health.org/appointments/book"
      inputLabel="Enter your healthcare URL"
      generateLabel="Shorten URL"
      features={[
        "Patient Portal Shortening",
        "Appointment Link Tracking",
        "Health Resource Sharing",
        "Clinic Location Links",
        "Insurance Verification Links",
        "Telehealth Access Links",
      ]}
      howItWorks={[
        { step: "Paste Healthcare URL", desc: "Enter your patient portal, booking, or resource link." },
        { step: "Generate Short Link", desc: "Create a simple, memorable URL for patients." },
        { step: "Share with Patients", desc: "Include in emails, texts, and printed materials." },
      ]}
      useCases={[
        "Patient portal access",
        "Appointment booking links",
        "Telehealth session links",
        "Prescription refill pages",
        "Health education resources",
        "Clinic location directions",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}

      relatedArticles={relatedArticles}
    />
  )
}