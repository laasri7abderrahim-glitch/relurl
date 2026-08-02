type JsonLdWebPageProps = {
  title: string
  description: string
  path: string
}

export function JsonLdWebPage({ title, description, path }: JsonLdWebPageProps) {
  const url = `https://relurl.com${path}`
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": url,
          url,
          name: title,
          description,
          isPartOf: { "@id": "https://relurl.com/#website" },
          about: { "@id": "https://relurl.com/#organization" },
        }),
      }}
    />
  )
}
