import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "How to Create QR Codes - Step by Step Guide",
    description: "Learn how to create QR codes for URLs, WiFi, vCards, and more. Complete guide to generating and using QR codes for your business and personal needs.",
    path: "/how-to-create-qr-codes",
    keywords: ["how to create qr codes", "qr code generator guide", "make qr code", "qr code creation tutorial"],
    locale,
  })
}

export default function HowToCreateQRCodesPage() {
  const href = "/how-to-create-qr-codes"
  const relatedArticles = getPostsByLandingPage("/qr-code-generator").slice(0, 3)
  return (
    <URLLandingPage
      title="How to Create QR Codes"
      subtitle="Complete QR Code Guide"
      description="Learn how to create QR codes for any purpose. From URLs to WiFi credentials, this guide covers everything you need to know about generating and using QR codes."
      placeholder="https://example.com/your-qr-destination"
      generateLabel="Generate QR Code"
      features={[
        "QR Code Generation",
        "Multiple Data Types",
        "High-Resolution Output",
        "Dynamic QR Codes",
        "Scan Analytics",
        "Print-Ready Downloads",
      ]}
      howItWorks={[
        { step: "Choose Your Data Type", desc: "Select what your QR code should contain: URL, text, WiFi, vCard, email, or other options." },
        { step: "Enter Your Information", desc: "Fill in the details based on your chosen data type, such as the URL or WiFi credentials." },
        { step: "Download and Use", desc: "Download your high-resolution QR code and use it in print, digital, or signage materials." },
      ]}
      useCases={[
        "Create QR codes for restaurant menus",
        "Generate QR codes for business cards",
        "Make QR codes for WiFi access",
        "Create QR codes for event registration",
        "Generate QR codes for product packaging",
        "Make dynamic QR codes for marketing campaigns",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "Do I need special software to create QR codes?", a: "No, you can create QR codes directly in your browser using RELURL's QR code generator. No software installation or technical skills required." },
        { q: "What types of QR codes can I create?", a: "You can create QR codes for URLs, plain text, WiFi credentials, vCard contacts, email addresses, phone numbers, SMS messages, and calendar events." },
        { q: "What is the difference between static and dynamic QR codes?", a: "Static QR codes have a fixed destination that cannot be changed. Dynamic QR codes redirect through a short URL, allowing you to update the destination, track scans, and modify the target without reprinting." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
