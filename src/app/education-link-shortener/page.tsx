import type { Metadata } from "next"
import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "Education Link Shortener - Course & Resource Links",
  description: "Create short links for courses, syllabi, and learning resources. Track student engagement and simplify URL sharing for educators.",
  path: "/education-link-shortener",
  keywords: ["education link shortener", "course link generator", "learning resource links"],
})

export default function EducationLinkShortenerPage() {
  const href = "/education-link-shortener"
  return (
    <URLLandingPage
      title="Education Link Shortener"
      subtitle="Simplify Learning Links"
      description="Create short links for courses, syllabi, and educational resources. Track student engagement and simplify URL sharing for educators."
      placeholder="https://lms.school.edu/courses/math-101/assignments"
      inputLabel="Enter your resource URL"
      generateLabel="Shorten URL"
      features={[
        "Student Click Tracking",
        "Course-Specific Links",
        "LMS Integration",
        "QR Code for Classrooms",
        "Assignment Link Management",
        "Parent Portal Links",
      ]}
      howItWorks={[
        { step: "Paste Resource URL", desc: "Enter your course, assignment, or resource link." },
        { step: "Create Short Link", desc: "Generate a clean URL easy for students to type." },
        { step: "Share with Students", desc: "Post in your LMS, syllabus, or classroom board." },
      ]}
      useCases={[
        "Online course material sharing",
        "Assignment submission links",
        "Parent communication",
        "Library resource links",
        "Event registration for school functions",
        "Alumni network links",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
    />
  )
}
