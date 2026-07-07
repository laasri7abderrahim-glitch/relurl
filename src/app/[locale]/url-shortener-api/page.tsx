import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "URL Shortener API - Developer API for Short Links",
    description: "Integrate RELURL's URL shortening into your applications with our developer API. Create, manage, and track short links programmatically.",
    path: "/url-shortener-api",
    keywords: ["url shortener api", "link shortener api", "shorten url api", "api url shortener"],
    locale,
  })
}

export default function URLShortenerAPIPage() {
  const href = "/url-shortener-api"
  const relatedArticles = getPostsByLandingPage("/custom-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="URL Shortener API"
      subtitle="Integrate Short Links Everywhere"
      description="Integrate RELURL's URL shortening capabilities into your applications, workflows, and platforms using our powerful developer API. Create and manage short links programmatically."
      placeholder="https://example.com/api-documentation"
      generateLabel="Try the API"
      features={[
        "RESTful API Endpoints",
        "Programmatic Link Creation",
        "Bulk URL Shortening",
        "Analytics Integration",
        "Custom Slug Support",
        "JSON Responses",
      ]}
      howItWorks={[
        { step: "Get Your API Key", desc: "Sign up for a free RELURL account and generate your API key from the dashboard." },
        { step: "Make API Calls", desc: "Use our RESTful endpoints to create, manage, and track short links in your applications." },
        { step: "Scale Automatically", desc: "Integrate link shortening into your workflows, from CMS plugins to marketing automation." },
      ]}
      useCases={[
        "Automate link creation in your application",
        "Integrate with your CMS for automatic link shortening",
        "Build custom URL management workflows",
        "Create short links in bulk from your database",
        "Fetch analytics data programmatically",
        "Connect with marketing automation tools",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "Is the API free to use?", a: "Yes, the URL shortener API is available on all plans including the free tier. Higher tiers include higher rate limits and additional features." },
        { q: "What authentication does the API use?", a: "The API uses API key authentication. You can generate and manage your API keys from your RELURL dashboard settings." },
        { q: "What rate limits apply to the API?", a: "Rate limits vary by plan. Free tier users get generous daily limits, while paid plans include higher limits for production applications." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
