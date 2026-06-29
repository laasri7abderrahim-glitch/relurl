import type { Metadata } from "next"
import QRCodeLandingPage from "@/components/qr/QRCodeLandingPage"
import { allQRCodes } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "QR Code for Classroom - Education & Learning QR Codes",
  description: "Create QR codes for classroom resources, assignments, and learning materials. Streamline education with scannable QR codes from RELURL.",
  path: "/qr-code-for-class",
  keywords: ["qr code for classroom", "education qr code", "classroom resource qr code"],
})

export default function Page() {
  return (
    <QRCodeLandingPage
      title="QR Code for Classroom"
      subtitle="Simplify Learning Access"
      description="Create QR codes for classroom resources, assignments, and learning materials. Let students scan to access course content instantly."
      placeholder="https://school.edu/classroom/math-101/resources"
      defaultValue="https://school.edu/classroom/math-101/resources"
      inputLabel="Enter your classroom resource URL"
      generateLabel="Create Classroom QR Code"
      features={["Assignment Links", "Resource Library", "Parent Portal", "Attendance Tracking"]}
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
      ]}
      relatedPages={[
        { title: "QR Code Generator", href: "/qr-code-generator" },
        { title: "QR Code for WiFi", href: "/qr-code-for-wifi" },
        { title: "QR Code for PDF", href: "/qr-code-for-pdf" },
        { title: "QR Code for Email", href: "/qr-code-for-email" },
        { title: "QR Code for Event", href: "/qr-code-for-event" },
        { title: "QR Code for App Download", href: "/qr-code-for-app-download" },
      ]}
      allQRCodes={allQRCodes}
    />
  )
}
