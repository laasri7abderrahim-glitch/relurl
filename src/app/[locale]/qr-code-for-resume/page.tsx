import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"
import { allQRCodes, getRelatedQrPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "QR Code for Resume - Digital CV & Portfolio QR Codes",
    description: "Create QR codes for your resume, CV, and online portfolio. Stand out in job applications with a scannable resume QR code from RELURL.",
    path: "/qr-code-for-resume",
    keywords: ["qr code for resume", "cv qr code", "portfolio qr code", "digital cv qr code"],
    locale,
  })
}

export default function Page() {
  const href = "/qr-code-for-resume"
  const relatedArticles = getPostsByLandingPage(href).slice(0, 3)
  return (
    <QRCodeLandingPage
      title="QR Code for Resume"
      subtitle="Stand Out in Applications"
      description="Create QR codes for your resume, CV, and online portfolio. Let recruiters scan to view your full professional profile instantly."
      placeholder="https://your-portfolio.com/resume"
      defaultValue="https://your-portfolio.com/resume"
      inputLabel="Enter your resume or portfolio URL"
      generateLabel="Create Resume QR Code"
      features={["Portfolio Linking", "LinkedIn Integration", "Project Showcases", "Contact Details", "Cover Letter Link", "Certification Proofs"]}
      howItWorks={[
        { step: "Enter Resume URL", desc: "Paste your online resume, portfolio, or LinkedIn profile." },
        { step: "Generate QR Code", desc: "Create a professional QR code for your job applications." },
        { step: "Add to Application", desc: "Print on your resume header or include in email signatures." },
      ]}
      useCases={[
        "Job application resume headers",
        "Business card attachments",
        "LinkedIn profile sharing",
        "Freelancer portfolios",
        "Conference networking",
        "Internship application headers",
      ]}
      relatedPages={getRelatedQrPages(href)}
      allQRCodes={allQRCodes}

      relatedArticles={relatedArticles}
    />
  )
}