import type { Metadata } from "next"
import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "Course Link Shortener - Online Course Promotion Links",
  description: "Shorten course landing pages and enrollment links. Track signups and optimize your course marketing with RELURL's link shortener.",
  path: "/course-link-shortener",
  keywords: ["course link shortener", "online course links", "course promotion links"],
})

export default function CourseLinkShortenerPage() {
  const href = "/course-link-shortener"
  return (
    <URLLandingPage
      title="Course Link Shortener"
      subtitle="Enroll More Students"
      description="Shorten course landing pages and enrollment links. Track signups, optimize promotions, and grow your online teaching business."
      placeholder="https://teachable.com/your-course/masterclass"
      inputLabel="Enter your course URL"
      generateLabel="Shorten URL"
      features={[
        "Enrollment Tracking",
        "Course Page Analytics",
        "Multi-Platform Links",
        "Coupon Code Integration",
        "Instructor Branding",
        "Student Referral Links",
      ]}
      howItWorks={[
        { step: "Paste Course URL", desc: "Enter your course landing page or enrollment link." },
        { step: "Generate Short Link", desc: "Create a clean URL easy for students to remember." },
        { step: "Promote & Enroll", desc: "Share across channels and track student signups." },
      ]}
      useCases={[
        "Course launch campaigns",
        "Free lesson promotions",
        "Instructor affiliate links",
        "Corporate training signups",
        "Webinar-to-course funnels",
        "Student referral programs",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
    />
  )
}
