import type { Metadata } from "next"
import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"
import { allQRCodes } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "QR Code for Resume - Digital CV & Portfolio QR Codes",
  description: "Create QR codes for your resume, CV, and online portfolio. Stand out in job applications with a scannable resume QR code from RELURL.",
  path: "/qr-code-for-resume",
  keywords: ["qr code for resume", "cv qr code", "portfolio qr code"],
})

export default function Page() {
  return (
    <QRCodeLandingPage
      title="QR Code for Resume"
      subtitle="Stand Out in Applications"
      description="Create QR codes for your resume, CV, and online portfolio. Let recruiters scan to view your full professional profile instantly."
      placeholder="https://your-portfolio.com/resume"
      defaultValue="https://your-portfolio.com/resume"
      inputLabel="Enter your resume or portfolio URL"
      generateLabel="Create Resume QR Code"
      features={["Portfolio Linking", "LinkedIn Integration", "Project Showcases", "Contact Details"]}
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
      ]}
      relatedPages={[
        { title: "QR Code Generator", href: "/qr-code-generator" },
        { title: "QR Code for Business Card", href: "/qr-code-for-business-card" },
        { title: "QR Code for Portfolio", href: "/qr-code-for-portfolio" },
        { title: "QR Code for LinkedIn", href: "/qr-code-for-linkedin" },
        { title: "QR Code for Email", href: "/qr-code-for-email" },
        { title: "QR Code for vCard", href: "/qr-code-for-vcard" },
      ]}
      allQRCodes={allQRCodes}
    />
  )
}
