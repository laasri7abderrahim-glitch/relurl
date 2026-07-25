import { generateSEOMetadata } from "@/lib/seo"
import ApiReference from "@/components/api/ApiReference"

export async function generateMetadata() {
  return generateSEOMetadata({
    title: "API Reference - RelURL Documentation",
    description: "Complete REST API reference for RelURL URL shortener. Create, manage, and track short links programmatically.",
    path: "/api-reference",
    keywords: ["url shortener api", "link shortener api", "rest api", "developer api", "api documentation"],
    locale: "en",
  })
}

export default function Page() {
  return <ApiReference />
}
