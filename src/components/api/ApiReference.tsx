"use client"

import { useState } from "react"
import { useLocale } from "next-intl"

type Lang = "curl" | "javascript" | "python"

const LANG_LABELS: Record<Lang, string> = { curl: "cURL", javascript: "JavaScript", python: "Python" }

function CodeBlock({ code, lang: initial }: { code: Record<Lang, string>; lang?: Lang }) {
  const [lang, setLang] = useState<Lang>(initial ?? "curl")
  return (
    <div className="glass-card overflow-hidden">
      <div className="flex border-b border-border/40">
        {(Object.keys(code) as Lang[]).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              lang === l ? "bg-primary/10 text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {LANG_LABELS[l]}
          </button>
        ))}
      </div>
      <pre className="p-4 text-sm overflow-x-auto bg-black/20"><code>{code[lang]}</code></pre>
    </div>
  )
}

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: "bg-emerald-500/20 text-emerald-400",
    POST: "bg-blue-500/20 text-blue-400",
    PATCH: "bg-amber-500/20 text-amber-400",
    DELETE: "bg-red-500/20 text-red-400",
    PUT: "bg-purple-500/20 text-purple-400",
  }
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${colors[method] || "bg-gray-500/20 text-gray-400"}`}>
      {method}
    </span>
  )
}

function Endpoint({ method, path, desc, code, params }: {
  method: string
  path: string
  desc: string
  code: Record<Lang, string>
  params?: { name: string; type: string; required?: boolean; desc: string }[]
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/5 transition-colors"
      >
        <MethodBadge method={method} />
        <code className="font-mono text-sm flex-1">{path}</code>
        <span className="text-xs text-muted-foreground flex-1">{desc}</span>
        <span className="text-muted-foreground">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="border-t border-border/40 p-4 space-y-4">
          {params && params.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2">Parameters</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/40">
                      <th className="text-left py-2 pr-4">Name</th>
                      <th className="text-left py-2 pr-4">Type</th>
                      <th className="text-left py-2 pr-4">Required</th>
                      <th className="text-left py-2">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {params.map((p) => (
                      <tr key={p.name} className="border-b border-border/20">
                        <td className="py-2 pr-4 font-mono text-xs">{p.name}</td>
                        <td className="py-2 pr-4 text-xs">{p.type}</td>
                        <td className="py-2 pr-4 text-xs">{p.required ? "Yes" : "No"}</td>
                        <td className="py-2 text-xs">{p.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <div>
            <h4 className="text-sm font-semibold mb-2">Example</h4>
            <CodeBlock code={code} />
          </div>
        </div>
      )}
    </div>
  )
}

function Section({ title, id, children }: { title: string; id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-12">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

export default function ApiReference() {
  const locale = useLocale()
  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden bg-noise">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative section-padding">
          <div className="max-w-5xl mx-auto reveal">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              RelURL <span className="text-primary">API Reference</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
              Complete documentation for the RelURL REST API. Create, manage, and track short links programmatically.
            </p>

            <div className="glass-card p-4 mb-12">
              <h3 className="font-semibold mb-2">Base URL</h3>
              <code className="text-sm bg-black/20 px-3 py-1.5 rounded font-mono">https://relurl.com/api</code>
              <h3 className="font-semibold mt-4 mb-2">Authentication</h3>
              <p className="text-sm text-muted-foreground mb-2">Include your API key in the Authorization header:</p>
              <code className="text-sm bg-black/20 px-3 py-1.5 rounded font-mono">Authorization: Bearer YOUR_API_KEY</code>
              <p className="text-xs text-muted-foreground mt-3">
                Get your API key from the{" "}
                 <a href={`/${locale}/dashboard/api-keys`} className="text-primary hover:underline">dashboard</a>.
               </p>
             </div>

             <nav className="glass-card p-4 mb-12 flex flex-wrap gap-2">
              {["links", "analytics", "qrcodes", "domains", "campaigns", "tags", "webhooks", "teams"].map((s) => (
                <a
                  key={s}
                  href={`#section-${s}`}
                  className="px-3 py-1.5 text-sm bg-black/20 rounded-full hover:bg-primary/20 transition-colors"
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </a>
              ))}
            </nav>

            <Section title="Links" id="section-links">
              <Endpoint
                method="POST"
                path="/links"
                desc="Create a new short link"
                code={{
                  curl: 'curl -X POST https://relurl.com/api/links \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d \'{\n    "url": "https://example.com/very-long-url",\n    "title": "My Link",\n    "tags": ["marketing", "social"]\n  }\'',
                  javascript: 'const res = await fetch("https://relurl.com/api/links", {\n  method: "POST",\n  headers: {\n    Authorization: "Bearer YOUR_API_KEY",\n    "Content-Type": "application/json",\n  },\n  body: JSON.stringify({\n    url: "https://example.com/very-long-url",\n    title: "My Link",\n    tags: ["marketing", "social"],\n  }),\n})\nconst data = await res.json()',
                  python: 'import requests\n\nres = requests.post(\n    "https://relurl.com/api/links",\n    headers={"Authorization": "Bearer YOUR_API_KEY"},\n    json={\n        "url": "https://example.com/very-long-url",\n        "title": "My Link",\n        "tags": ["marketing", "social"],\n    },\n)\ndata = res.json()',
                }}
                params={[
                  { name: "url", type: "string", required: true, desc: "The long URL to shorten" },
                  { name: "slug", type: "string", required: false, desc: "Custom short code (3-20 chars, alphanumeric)" },
                  { name: "title", type: "string", required: false, desc: "Human-readable title" },
                  { name: "tags", type: "string[]", required: false, desc: "Array of tags for organization" },
                  { name: "password", type: "string", required: false, desc: "Password protect the link" },
                  { name: "expiresAt", type: "ISO8601", required: false, desc: "Expiration timestamp" },
                  { name: "utmSource", type: "string", required: false, desc: "UTM source parameter" },
                ]}
              />

              <Endpoint
                method="GET"
                path="/links"
                desc="List all your short links"
                code={{
                  curl: 'curl -H "Authorization: Bearer YOUR_API_KEY" \\\n  "https://relurl.com/api/links?page=1&limit=20&search=example"',
                  javascript: 'const res = await fetch(\n  "https://relurl.com/api/links?page=1&limit=20&search=example",\n  { headers: { Authorization: "Bearer YOUR_API_KEY" } }\n)\nconst data = await res.json()',
                  python: 'import requests\n\nres = requests.get(\n    "https://relurl.com/api/links",\n    params={"page": 1, "limit": 20, "search": "example"},\n    headers={"Authorization": "Bearer YOUR_API_KEY"},\n)\ndata = res.json()',
                }}
                params={[
                  { name: "page", type: "integer", required: false, desc: "Page number (default: 1)" },
                  { name: "limit", type: "integer", required: false, desc: "Results per page (default: 20, max: 100)" },
                  { name: "search", type: "string", required: false, desc: "Search by URL, slug, or title" },
                  { name: "domain", type: "string", required: false, desc: "Filter by domain" },
                  { name: "isActive", type: "boolean", required: false, desc: "Filter by active status" },
                ]}
              />

              <Endpoint
                method="GET"
                path="/links/{id}"
                desc="Get a single link's details"
                code={{
                  curl: 'curl -H "Authorization: Bearer YOUR_API_KEY" \\\n  https://relurl.com/api/links/LINK_ID',
                  javascript: 'const res = await fetch(\n  `https://relurl.com/api/links/${linkId}`,\n  { headers: { Authorization: "Bearer YOUR_API_KEY" } }\n)\nconst data = await res.json()',
                  python: 'import requests\n\nres = requests.get(\n    f"https://relurl.com/api/links/{link_id}",\n    headers={"Authorization": "Bearer YOUR_API_KEY"},\n)\ndata = res.json()',
                }}
                params={[
                  { name: "id", type: "string", required: true, desc: "Link UUID from creation response" },
                ]}
              />

              <Endpoint
                method="PATCH"
                path="/links/{id}"
                desc="Update a short link"
                code={{
                  curl: 'curl -X PATCH https://relurl.com/api/links/LINK_ID \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"url": "https://example.com/new-destination", "title": "Updated Title"}\'',
                  javascript: 'const res = await fetch(`https://relurl.com/api/links/${linkId}`, {\n  method: "PATCH",\n  headers: {\n    Authorization: "Bearer YOUR_API_KEY",\n    "Content-Type": "application/json",\n  },\n  body: JSON.stringify({ url: "https://example.com/new-destination", title: "Updated Title" }),\n})\nconst data = await res.json()',
                  python: 'import requests\n\nres = requests.patch(\n    f"https://relurl.com/api/links/{link_id}",\n    headers={"Authorization": "Bearer YOUR_API_KEY"},\n    json={"url": "https://example.com/new-destination", "title": "Updated Title"},\n)\ndata = res.json()',
                }}
                params={[
                  { name: "id", type: "string", required: true, desc: "Link UUID" },
                  { name: "url", type: "string", required: false, desc: "New destination URL" },
                  { name: "title", type: "string", required: false, desc: "New title" },
                  { name: "isActive", type: "boolean", required: false, desc: "Enable/disable the link" },
                ]}
              />

              <Endpoint
                method="DELETE"
                path="/links/{id}"
                desc="Delete a short link"
                code={{
                  curl: 'curl -X DELETE -H "Authorization: Bearer YOUR_API_KEY" \\\n  https://relurl.com/api/links/LINK_ID',
                  javascript: 'await fetch(`https://relurl.com/api/links/${linkId}`, {\n  method: "DELETE",\n  headers: { Authorization: "Bearer YOUR_API_KEY" },\n})',
                  python: 'import requests\n\nres = requests.delete(\n    f"https://relurl.com/api/links/{link_id}",\n    headers={"Authorization": "Bearer YOUR_API_KEY"},\n)',
                }}
                params={[
                  { name: "id", type: "string", required: true, desc: "Link UUID to delete" },
                ]}
              />

              <Endpoint
                method="POST"
                path="/links/expand"
                desc="Resolve a short URL to its original long URL"
                code={{
                  curl: 'curl -X POST https://relurl.com/api/links/expand \\\n  -H "Content-Type: application/json" \\\n  -d \'{"shortUrl": "https://relurl.com/abc123"}\'',
                  javascript: 'const res = await fetch("https://relurl.com/api/links/expand", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify({ shortUrl: "https://relurl.com/abc123" }),\n})\nconst data = await res.json()',
                  python: 'import requests\n\nres = requests.post(\n    "https://relurl.com/api/links/expand",\n    json={"shortUrl": "https://relurl.com/abc123"},\n)\ndata = res.json()',
                }}
                params={[
                  { name: "shortUrl", type: "string", required: true, desc: "The short URL to expand" },
                ]}
              />

              <Endpoint
                method="POST"
                path="/links/bulk"
                desc="Create up to 50 links at once"
                code={{
                  curl: 'curl -X POST https://relurl.com/api/links/bulk \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"links": [{"url": "https://example.com/1"}, {"url": "https://example.com/2"}]}\'',
                  javascript: 'await fetch("https://relurl.com/api/links/bulk", {\n  method: "POST",\n  headers: { Authorization: "Bearer YOUR_API_KEY", "Content-Type": "application/json" },\n  body: JSON.stringify({ links: [{ url: "https://example.com/1" }, { url: "https://example.com/2" }] }),\n})',
                  python: 'import requests\n\nres = requests.post(\n    "https://relurl.com/api/links/bulk",\n    headers={"Authorization": "Bearer YOUR_API_KEY"},\n    json={"links": [{"url": "https://example.com/1"}, {"url": "https://example.com/2"}]},\n)',
                }}
              />

              <Endpoint
                method="PATCH"
                path="/links/{id}/tags"
                desc="Update tags on a link"
                code={{
                  curl: 'curl -X PATCH https://relurl.com/api/links/LINK_ID/tags \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"tags": ["marketing", "summer-campaign"]}\'',
                  javascript: 'await fetch(`https://relurl.com/api/links/${linkId}/tags`, {\n  method: "PATCH",\n  headers: { Authorization: "Bearer YOUR_API_KEY", "Content-Type": "application/json" },\n  body: JSON.stringify({ tags: ["marketing", "summer-campaign"] }),\n})',
                  python: 'import requests\n\nres = requests.patch(\n    f"https://relurl.com/api/links/{link_id}/tags",\n    headers={"Authorization": "Bearer YOUR_API_KEY"},\n    json={"tags": ["marketing", "summer-campaign"]},\n)',
                }}
                params={[
                  { name: "id", type: "string", required: true, desc: "Link UUID" },
                  { name: "tags", type: "string[]", required: true, desc: "Replaces all existing tags (max 20)" },
                ]}
              />
            </Section>

            <Section title="Analytics" id="section-analytics">
              <Endpoint
                method="GET"
                path="/analytics"
                desc="Get aggregate analytics for all your links"
                code={{
                  curl: 'curl -H "Authorization: Bearer YOUR_API_KEY" \\\n  "https://relurl.com/api/analytics?period=30d&groupBy=day"',
                  javascript: 'const res = await fetch(\n  "https://relurl.com/api/analytics?period=30d&groupBy=day",\n  { headers: { Authorization: "Bearer YOUR_API_KEY" } }\n)\nconst data = await res.json()',
                  python: 'import requests\n\nres = requests.get(\n    "https://relurl.com/api/analytics",\n    params={"period": "30d", "groupBy": "day"},\n    headers={"Authorization": "Bearer YOUR_API_KEY"},\n)\ndata = res.json()',
                }}
                params={[
                  { name: "period", type: "string", required: false, desc: "7d, 30d, 90d, or all (default: 30d)" },
                  { name: "groupBy", type: "string", required: false, desc: "day, week, or month (default: day)" },
                ]}
              />

              <Endpoint
                method="GET"
                path="/analytics/{linkId}"
                desc="Get per-link click analytics"
                code={{
                  curl: 'curl -H "Authorization: Bearer YOUR_API_KEY" \\\n  "https://relurl.com/api/analytics/LINK_ID?period=7d"',
                  javascript: 'await fetch(\n  `https://relurl.com/api/analytics/${linkId}?period=7d`,\n  { headers: { Authorization: "Bearer YOUR_API_KEY" } }\n)',
                  python: 'import requests\n\nres = requests.get(\n    f"https://relurl.com/api/analytics/{link_id}",\n    params={"period": "7d"},\n    headers={"Authorization": "Bearer YOUR_API_KEY"},\n)',
                }}
                params={[
                  { name: "linkId", type: "string", required: true, desc: "Link UUID" },
                  { name: "period", type: "string", required: false, desc: "7d, 30d, 90d, or all" },
                ]}
              />
            </Section>

            <Section title="QR Codes" id="section-qrcodes">
              <Endpoint
                method="GET"
                path="/qrcodes"
                desc="List all your QR codes"
                code={{
                  curl: 'curl -H "Authorization: Bearer YOUR_API_KEY" \\\n  https://relurl.com/api/qrcodes',
                  javascript: 'await fetch("https://relurl.com/api/qrcodes", {\n  headers: { Authorization: "Bearer YOUR_API_KEY" },\n})',
                  python: 'import requests\n\nres = requests.get(\n    "https://relurl.com/api/qrcodes",\n    headers={"Authorization": "Bearer YOUR_API_KEY"},\n)',
                }}
              />

              <Endpoint
                method="POST"
                path="/qrcodes"
                desc="Generate a QR code for a link"
                code={{
                  curl: 'curl -X POST https://relurl.com/api/qrcodes \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"linkId": "LINK_ID", "name": "My QR", "size": 300, "format": "png"}\'',
                  javascript: 'await fetch("https://relurl.com/api/qrcodes", {\n  method: "POST",\n  headers: { Authorization: "Bearer YOUR_API_KEY", "Content-Type": "application/json" },\n  body: JSON.stringify({ linkId: "LINK_ID", name: "My QR", size: 300, format: "png" }),\n})',
                  python: 'import requests\n\nres = requests.post(\n    "https://relurl.com/api/qrcodes",\n    headers={"Authorization": "Bearer YOUR_API_KEY"},\n    json={"linkId": "LINK_ID", "name": "My QR", "size": 300, "format": "png"},\n)',
                }}
                params={[
                  { name: "linkId", type: "string", required: true, desc: "Link UUID to encode" },
                  { name: "name", type: "string", required: false, desc: "Display name" },
                  { name: "size", type: "integer", required: false, desc: "QR code size in px (default: 300)" },
                  { name: "format", type: "string", required: false, desc: "png or svg (default: png)" },
                ]}
              />
            </Section>

            <Section title="Tags" id="section-tags">
              <Endpoint
                method="GET"
                path="/tags"
                desc="List all tags used across your links"
                code={{
                  curl: 'curl -H "Authorization: Bearer YOUR_API_KEY" \\\n  "https://relurl.com/api/tags?search=market"',
                  javascript: 'await fetch(\n  "https://relurl.com/api/tags?search=market",\n  { headers: { Authorization: "Bearer YOUR_API_KEY" } }\n)',
                  python: 'import requests\n\nres = requests.get(\n    "https://relurl.com/api/tags",\n    params={"search": "market"},\n    headers={"Authorization": "Bearer YOUR_API_KEY"},\n)',
                }}
                params={[
                  { name: "search", type: "string", required: false, desc: "Filter tags by name" },
                ]}
              />

              <Endpoint
                method="DELETE"
                path="/tags/{tag}"
                desc="Remove a tag from all your links"
                code={{
                  curl: 'curl -X DELETE -H "Authorization: Bearer YOUR_API_KEY" \\\n  "https://relurl.com/api/tags/marketing"',
                  javascript: 'await fetch(\n  "https://relurl.com/api/tags/marketing",\n  { method: "DELETE", headers: { Authorization: "Bearer YOUR_API_KEY" } },\n)',
                  python: 'import requests\n\nres = requests.delete(\n    "https://relurl.com/api/tags/marketing",\n    headers={"Authorization": "Bearer YOUR_API_KEY"},\n)',
                }}
                params={[
                  { name: "tag", type: "string", required: true, desc: "Tag name to remove from all links" },
                ]}
              />
            </Section>

            <Section title="Webhooks" id="section-webhooks">
              <Endpoint
                method="POST"
                path="/webhooks"
                desc="Create a new webhook endpoint"
                code={{
                  curl: "curl -X POST https://relurl.com/api/webhooks \\\n  -H \"Authorization: Bearer YOUR_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"url\": \"https://myapp.com/webhooks/relurl\",\n    \"events\": [\"link.clicked\"],\n    \"secret\": \"my-optional-secret\"\n  }'",
                  javascript: 'await fetch("https://relurl.com/api/webhooks", {\n  method: "POST",\n  headers: { Authorization: "Bearer YOUR_API_KEY", "Content-Type": "application/json" },\n  body: JSON.stringify({\n    url: "https://myapp.com/webhooks/relurl",\n    events: ["link.clicked"],\n    secret: "my-optional-secret",\n  }),\n})',
                  python: 'import requests\n\nres = requests.post(\n    "https://relurl.com/api/webhooks",\n    headers={"Authorization": "Bearer YOUR_API_KEY"},\n    json={\n        "url": "https://myapp.com/webhooks/relurl",\n        "events": ["link.clicked"],\n        "secret": "my-optional-secret",\n    },\n)',
                }}
                params={[
                  { name: "url", type: "string", required: true, desc: "HTTPS endpoint to receive webhook payloads" },
                  { name: "events", type: "string[]", required: true, desc: "link.clicked, link.created, link.updated, link.deleted" },
                  { name: "secret", type: "string", required: false, desc: "Secret sent as X-Webhook-Secret header" },
                ]}
              />

              <Endpoint
                method="GET"
                path="/webhooks"
                desc="List all your webhooks"
                code={{
                  curl: 'curl -H "Authorization: Bearer YOUR_API_KEY" \\\n  https://relurl.com/api/webhooks',
                  javascript: 'await fetch("https://relurl.com/api/webhooks", {\n  headers: { Authorization: "Bearer YOUR_API_KEY" },\n})',
                  python: 'import requests\n\nres = requests.get(\n    "https://relurl.com/api/webhooks",\n    headers={"Authorization": "Bearer YOUR_API_KEY"},\n)',
                }}
              />

              <Endpoint
                method="PATCH"
                path="/webhooks/{id}"
                desc="Update a webhook"
                code={{
                  curl: 'curl -X PATCH https://relurl.com/api/webhooks/WEBHOOK_ID \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"isActive": false}\'',
                  javascript: 'await fetch(`https://relurl.com/api/webhooks/${hookId}`, {\n  method: "PATCH",\n  headers: { Authorization: "Bearer YOUR_API_KEY", "Content-Type": "application/json" },\n  body: JSON.stringify({ isActive: false }),\n})',
                  python: 'import requests\n\nres = requests.patch(\n    f"https://relurl.com/api/webhooks/{hook_id}",\n    headers={"Authorization": "Bearer YOUR_API_KEY"},\n    json={"isActive": False},\n)',
                }}
                params={[
                  { name: "id", type: "string", required: true, desc: "Webhook UUID" },
                  { name: "url", type: "string", required: false, desc: "New endpoint URL" },
                  { name: "events", type: "string[]", required: false, desc: "Update subscribed events" },
                  { name: "isActive", type: "boolean", required: false, desc: "Enable/disable" },
                ]}
              />

              <Endpoint
                method="DELETE"
                path="/webhooks/{id}"
                desc="Delete a webhook"
                code={{
                  curl: 'curl -X DELETE -H "Authorization: Bearer YOUR_API_KEY" \\\n  https://relurl.com/api/webhooks/WEBHOOK_ID',
                  javascript: 'await fetch(`https://relurl.com/api/webhooks/${hookId}`, {\n  method: "DELETE",\n  headers: { Authorization: "Bearer YOUR_API_KEY" },\n})',
                  python: 'import requests\n\nres = requests.delete(\n    f"https://relurl.com/api/webhooks/{hook_id}",\n    headers={"Authorization": "Bearer YOUR_API_KEY"},\n)',
                }}
                params={[
                  { name: "id", type: "string", required: true, desc: "Webhook UUID to delete" },
                ]}
              />

              <Endpoint
                method="GET"
                path="/webhooks/{id}/logs"
                desc="View webhook delivery logs"
                code={{
                  curl: 'curl -H "Authorization: Bearer YOUR_API_KEY" \\\n  "https://relurl.com/api/webhooks/WEBHOOK_ID/logs?page=1&limit=20"',
                  javascript: 'await fetch(\n  `https://relurl.com/api/webhooks/${hookId}/logs?page=1&limit=20`,\n  { headers: { Authorization: "Bearer YOUR_API_KEY" } },\n)',
                  python: 'import requests\n\nres = requests.get(\n    f"https://relurl.com/api/webhooks/{hook_id}/logs",\n    params={"page": 1, "limit": 20},\n    headers={"Authorization": "Bearer YOUR_API_KEY"},\n)',
                }}
              />
            </Section>

            <Section title="Domains" id="section-domains">
              <Endpoint
                method="GET"
                path="/domains"
                desc="List your custom domains"
                code={{
                  curl: 'curl -H "Authorization: Bearer YOUR_API_KEY" \\\n  https://relurl.com/api/domains',
                  javascript: 'await fetch("https://relurl.com/api/domains", {\n  headers: { Authorization: "Bearer YOUR_API_KEY" },\n})',
                  python: 'import requests\n\nres = requests.get(\n    "https://relurl.com/api/domains",\n    headers={"Authorization": "Bearer YOUR_API_KEY"},\n)',
                }}
              />

              <Endpoint
                method="POST"
                path="/domains"
                desc="Add a custom domain"
                code={{
                  curl: 'curl -X POST https://relurl.com/api/domains \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"domain": "go.mybrand.com"}\'',
                  javascript: 'await fetch("https://relurl.com/api/domains", {\n  method: "POST",\n  headers: { Authorization: "Bearer YOUR_API_KEY", "Content-Type": "application/json" },\n  body: JSON.stringify({ domain: "go.mybrand.com" }),\n})',
                  python: 'import requests\n\nres = requests.post(\n    "https://relurl.com/api/domains",\n    headers={"Authorization": "Bearer YOUR_API_KEY"},\n    json={"domain": "go.mybrand.com"},\n)',
                }}
                params={[
                  { name: "domain", type: "string", required: true, desc: "Domain name to add" },
                ]}
              />
            </Section>

            <Section title="Campaigns" id="section-campaigns">
              <Endpoint
                method="GET"
                path="/campaigns"
                desc="List your campaigns"
                code={{
                  curl: 'curl -H "Authorization: Bearer YOUR_API_KEY" \\\n  https://relurl.com/api/campaigns',
                  javascript: 'await fetch("https://relurl.com/api/campaigns", {\n  headers: { Authorization: "Bearer YOUR_API_KEY" },\n})',
                  python: 'import requests\n\nres = requests.get(\n    "https://relurl.com/api/campaigns",\n    headers={"Authorization": "Bearer YOUR_API_KEY"},\n)',
                }}
              />

              <Endpoint
                method="POST"
                path="/campaigns"
                desc="Create a new campaign"
                code={{
                  curl: 'curl -X POST https://relurl.com/api/campaigns \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"name": "Summer Sale", "description": "2024 summer campaign"}\'',
                  javascript: 'await fetch("https://relurl.com/api/campaigns", {\n  method: "POST",\n  headers: { Authorization: "Bearer YOUR_API_KEY", "Content-Type": "application/json" },\n  body: JSON.stringify({ name: "Summer Sale", description: "2024 summer campaign" }),\n})',
                  python: 'import requests\n\nres = requests.post(\n    "https://relurl.com/api/campaigns",\n    headers={"Authorization": "Bearer YOUR_API_KEY"},\n    json={"name": "Summer Sale", "description": "2024 summer campaign"},\n)',
                }}
                params={[
                  { name: "name", type: "string", required: true, desc: "Campaign name" },
                  { name: "description", type: "string", required: false, desc: "Campaign description" },
                ]}
              />
            </Section>

            <Section title="Teams" id="section-teams">
              <Endpoint
                method="GET"
                path="/teams"
                desc="List your teams"
                code={{
                  curl: 'curl -H "Authorization: Bearer YOUR_API_KEY" \\\n  https://relurl.com/api/teams',
                  javascript: 'await fetch("https://relurl.com/api/teams", {\n  headers: { Authorization: "Bearer YOUR_API_KEY" },\n})',
                  python: 'import requests\n\nres = requests.get(\n    "https://relurl.com/api/teams",\n    headers={"Authorization": "Bearer YOUR_API_KEY"},\n)',
                }}
              />

              <Endpoint
                method="POST"
                path="/teams"
                desc="Create a team"
                code={{
                  curl: 'curl -X POST https://relurl.com/api/teams \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"name": "My Team"}\'',
                  javascript: 'await fetch("https://relurl.com/api/teams", {\n  method: "POST",\n  headers: { Authorization: "Bearer YOUR_API_KEY", "Content-Type": "application/json" },\n  body: JSON.stringify({ name: "My Team" }),\n})',
                  python: 'import requests\n\nres = requests.post(\n    "https://relurl.com/api/teams",\n    headers={"Authorization": "Bearer YOUR_API_KEY"},\n    json={"name": "My Team"},\n)',
                }}
                params={[
                  { name: "name", type: "string", required: true, desc: "Team name" },
                ]}
              />
            </Section>

            <div className="glass-card p-6 mt-12">
              <h2 className="text-xl font-bold mb-4">Rate Limits</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/40">
                      <th className="text-left py-2 pr-4">Plan</th>
                      <th className="text-left py-2 pr-4">Rate Limit</th>
                      <th className="text-left py-2">Monthly Quota</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/20">
                      <td className="py-2 pr-4">Free</td>
                      <td className="py-2 pr-4">10 req/min</td>
                      <td className="py-2">1,000 requests</td>
                    </tr>
                    <tr className="border-b border-border/20">
                      <td className="py-2 pr-4">Pro</td>
                      <td className="py-2 pr-4">60 req/min</td>
                      <td className="py-2">10,000 requests</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">Enterprise</td>
                      <td className="py-2 pr-4">300 req/min</td>
                      <td className="py-2">Custom</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="glass-card p-6 mt-6">
              <h2 className="text-xl font-bold mb-4">Webhook Payload</h2>
              <p className="text-sm text-muted-foreground mb-3">
                When a webhook event fires, RelURL sends a POST request to your endpoint with the following payload:
              </p>
              <pre className="p-4 text-sm overflow-x-auto bg-black/20 rounded-lg"><code>{`{
  "event": "link.clicked",
  "linkId": "uuid-of-link",
  "country": "US",
  "device": "desktop",
  "browser": "Chrome",
  "os": "Windows",
  "isUnique": true,
  "timestamp": "2024-01-01T00:00:00.000Z"
}`}</code></pre>
            </div>

            <div className="glass-card p-6 mt-6 text-center">
              <h2 className="text-xl font-bold mb-2">Ready to build?</h2>
              <p className="text-muted-foreground mb-4">
                Get your API key and start integrating in minutes.
              </p>
              <a
                href={`/${locale}/dashboard/api-keys`}
                className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Get Your API Key
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
