import { generateSEOMetadata } from "@/lib/seo"
export { default } from "./page.client"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Password Protected Link - RELURL",
    description: "Enter the password to access this protected link",
    path: "/p",
    locale,
  })
}
