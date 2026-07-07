import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"
import { allQRCodes, getRelatedQrPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "QR Code for Classroom - Education & Learning QR Codes",
    description: "Create QR codes for classroom resources, assignments, and learning materials. Streamline education with scannable QR codes from RELURL.",
    path: "/qr-code-for-class",
    keywords: ["qr code for classroom", "education qr code", "classroom resource qr code", "educational qr code"],
    locale,
  })
}

export default function Page() {
  const href = "/qr-code-for-class"
  const relatedArticles = getPostsByLandingPage(href).slice(0, 3)
  return (
    <QRCodeLandingPage
      title="QR Code for Classroom"
      subtitle="Simplify Learning Access"
      description="Create QR codes for classroom resources, assignments, and learning materials. Let students scan to access course content instantly."
      placeholder="https://school.edu/classroom/math-101/resources"
      defaultValue="https://school.edu/classroom/math-101/resources"
      inputLabel="Enter your classroom resource URL"
      generateLabel="Create Classroom QR Code"
      features={["Assignment Links", "Resource Library", "Parent Portal", "Attendance Tracking", "Quiz and Survey Links", "Video Lesson Access"]}
      howItWorks={[
        { step: "Enter Resource URL", desc: "Paste your assignment, material, or classroom page link." },
        { step: "Generate QR Code", desc: "Create a code for quick student access to resources." },
        { step: "Display in Classroom", desc: "Post on whiteboards, desks, and handouts." },
      ]}
      useCases={[
        "Homework assignment access",
        "Supplementary material sharing",
        "Parent communication links",
        "Library resource access",
        "Virtual classroom entry",
        "Field trip information sharing",
      ]}
      relatedPages={getRelatedQrPages(href)}
      allQRCodes={allQRCodes}

      relatedArticles={relatedArticles}
    />
  )
}