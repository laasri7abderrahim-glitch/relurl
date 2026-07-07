import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"
import { allQRCodes, getRelatedQrPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "QR Code for Portfolio - Creative Portfolio QR Codes",
    description: "Create QR codes for your creative portfolio website. Let clients and employers scan to view your best work with RELURL's QR code generator.",
    path: "/qr-code-for-portfolio",
    keywords: ["qr code for portfolio", "creative portfolio qr code", "designer qr code", "design portfolio qr code"],
    locale,
  })
}

export default function Page() {
  const href = "/qr-code-for-portfolio"
  const relatedArticles = getPostsByLandingPage(href).slice(0, 3)
  return (
    <QRCodeLandingPage
      title="QR Code for Portfolio"
      subtitle="Showcase Your Work"
      description="Create QR codes for your creative portfolio website. Let clients and employers scan to view your best work and projects instantly."
      placeholder="https://your-portfolio.com"
      defaultValue="https://your-portfolio.com"
      inputLabel="Enter your portfolio URL"
      generateLabel="Create Portfolio QR Code"
      features={["Project Galleries", "Case Study Links", "Testimonial Pages", "Contact Forms", "Video Resume Link", "Client Testimonials"]}
      howItWorks={[
        { step: "Enter Portfolio URL", desc: "Paste your portfolio website or project showcase link." },
        { step: "Generate QR Code", desc: "Create a visually appealing QR code for your brand." },
        { step: "Share Everywhere", desc: "Add to business cards, resumes, and promotional materials." },
      ]}
      useCases={[
        "Business card portfolio links",
        "Exhibition and gallery displays",
        "Conference handouts",
        "Freelance client proposals",
        "Art and design school applications",
        "Architecture project showcases",
      ]}
      relatedPages={getRelatedQrPages(href)}
      allQRCodes={allQRCodes}

      relatedArticles={relatedArticles}
    />
  )
}