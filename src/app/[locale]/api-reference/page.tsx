import { generateSEOMetadata } from "@/lib/seo"
import ApiReference from "@/components/api/ApiReference"
import { JsonLdWebPage } from "@/components/seo/JsonLdWebPage"
import { getLocale } from "next-intl/server"

export async function generateMetadata() {
  return generateSEOMetadata({
    title: "API Reference - RelURL Documentation",
    description: "Complete REST API reference for RelURL URL shortener. Create, manage, and track short links programmatically.",
    path: "/api-reference",
    keywords: ["url shortener api", "link shortener api", "rest api", "developer api", "api documentation"],
    locale: "en",
  })
}

export default async function Page() {
  const locale = await getLocale()
  return (
    <>
      <JsonLdWebPage
        title="API Reference - RelURL Documentation"
        description="Complete REST API reference for RelURL URL shortener. Create, manage, and track short links programmatically."
        path={`/${locale}/api-reference`}
      />
      <ApiReference />
    </>
  )
}
