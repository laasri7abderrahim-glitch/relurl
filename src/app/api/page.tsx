"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import {
  Play, Copy, Check, ChevronDown, ChevronRight,
  Key, Zap, BarChart3, Globe, QrCode, Users, Shield
} from "lucide-react"

const endpoints = [
  { method: "POST", path: "/api/links", description: "Create a new short link", body: '{\n  "url": "https://example.com",\n  "slug": "my-link"\n}' },
  { method: "GET", path: "/api/links", description: "List all your links", body: "" },
  { method: "GET", path: "/api/links/:id", description: "Get a specific link", body: "" },
  { method: "PATCH", path: "/api/links/:id", description: "Update a link", body: '{\n  "title": "Updated Title"\n}' },
  { method: "DELETE", path: "/api/links/:id", description: "Delete a link", body: "" },
  { method: "POST", path: "/api/links/bulk", description: "Create multiple links", body: '{\n  "urls": ["https://example.com", "https://example.org"]\n}' },
  { method: "GET", path: "/api/analytics", description: "Get analytics data", body: "" },
  { method: "POST", path: "/api/qrcodes", description: "Generate a QR code", body: '{\n  "url": "https://relurl.com"\n}' },
  { method: "POST", path: "/api/retargeting", description: "Set retargeting pixels", body: '{\n  "linkId": "uuid",\n  "facebookPixel": "123456"\n}' },
  { method: "POST", path: "/api/ab-tests", description: "Create A/B test", body: '{\n  "linkId": "uuid",\n  "name": "Test",\n  "urls": ["https://a.com", "https://b.com"]\n}' },
  { method: "POST", path: "/api/smart-routes", description: "Create smart route", body: '{\n  "linkId": "uuid",\n  "name": "US Users",\n  "destination": "https://us.example.com",\n  "conditions": { "countries": ["US"] }\n}' },
  { method: "POST", path: "/api/bio-pages", description: "Create bio page", body: '{\n  "slug": "myname",\n  "title": "My Links",\n  "links": []\n}' },
  { method: "GET", path: "/api/domains", description: "List custom domains", body: "" },
  { method: "POST", path: "/api/domains", description: "Add custom domain", body: '{\n  "domain": "link.mybrand.com"\n}' },
  { method: "POST", path: "/api/integrations/zapier", description: "Zapier webhook", body: '{\n  "url": "https://example.com"\n}' },
  { method: "POST", path: "/api/integrations/make", description: "Make webhook", body: '{\n  "url": "https://example.com"\n}' },
]

const methodColors: Record<string, string> = {
  GET: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  POST: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  PATCH: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  DELETE: "bg-red-500/10 text-red-500 border-red-500/20",
}

const methodBg: Record<string, string> = {
  GET: "bg-emerald-500",
  POST: "bg-blue-500",
  PATCH: "bg-amber-500",
  DELETE: "bg-red-500",
}

export default function ApiDocsPage() {
  const [apiKey, setApiKey] = useState("")
  const [selectedEndpoint, setSelectedEndpoint] = useState(0)
  const [requestBody, setRequestBody] = useState(endpoints[0].body)
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [responseStatus, setResponseStatus] = useState<number | null>(null)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const ep = endpoints[selectedEndpoint]

  const selectEndpoint = (index: number) => {
    setSelectedEndpoint(index)
    setRequestBody(endpoints[index].body)
    setResponse("")
    setResponseStatus(null)
  }

  const sendRequest = async () => {
    if (!apiKey) {
      setResponse(JSON.stringify({ error: "Please enter your API key" }, null, 2))
      setResponseStatus(401)
      return
    }

    setLoading(true)
    setResponse("")
    setResponseStatus(null)

    try {
      const url = `https://relurl.com${ep.path}`
      const options: RequestInit = {
        method: ep.method,
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }

      if (ep.body && ["POST", "PATCH", "PUT"].includes(ep.method)) {
        options.body = requestBody
      }

      const res = await fetch(url, options)
      const text = await res.text()
      setResponseStatus(res.status)

      try {
        setResponse(JSON.stringify(JSON.parse(text), null, 2))
      } catch {
        setResponse(text)
      }
    } catch (err) {
      setResponse(JSON.stringify({ error: err instanceof Error ? err.message : "Request failed" }, null, 2))
      setResponseStatus(0)
    } finally {
      setLoading(false)
    }
  }

  const copyResponse = () => {
    navigator.clipboard.writeText(response)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const faqs = [
    { q: "How do I get an API key?", a: "Sign up at relurl.com, go to Dashboard → API Keys, and create a new key." },
    { q: "What are the rate limits?", a: "Free: 100 req/hr. Pro: 10,000 req/hr. Enterprise: Unlimited." },
    { q: "How do webhooks work?", a: "POST to /api/integrations/zapier or /api/integrations/make with your API key. See Zapier/Make integration docs." },
    { q: "Can I use the API without an account?", a: "No, you need a free account and API key to use the API." },
    { q: "Is there a sandbox environment?", a: "Yes, use the playground on this page to test endpoints with your API key." },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Key className="w-4 h-4" />
              REST API
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">API Documentation</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Build custom integrations with the RELURL REST API. Create short links, track analytics, manage domains, and more.
            </p>
          </div>
        </section>

        {/* Interactive Playground */}
        <section className="px-4 pb-16">
          <div className="max-w-6xl mx-auto">
            <Card className="border-dark-100 overflow-hidden">
              <div className="grid md:grid-cols-[280px_1fr] min-h-[500px]">
                {/* Endpoint Sidebar */}
                <div className="border-r border-dark-100 bg-dark-300/30 overflow-y-auto">
                  <div className="p-3 border-b border-dark-100">
                    <label className="text-xs font-medium text-dark-100 mb-1 block">API Key</label>
                    <Input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="rl_xxxxxxxxxxxx"
                      className="h-8 text-xs font-mono"
                    />
                    <p className="text-[10px] text-dark-100 mt-1">
                      <Link href="/dashboard/api-keys" className="text-primary hover:underline">Get key →</Link>
                    </p>
                  </div>
                  <div className="p-2 space-y-0.5">
                    {endpoints.map((e, i) => (
                      <button
                        key={i}
                        onClick={() => selectEndpoint(i)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                          selectedEndpoint === i
                            ? "bg-primary/10 text-primary"
                            : "text-dark-50 hover:bg-dark-300/50"
                        }`}
                      >
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${methodColors[e.method]}`}>
                          {e.method}
                        </span>
                        <span className="truncate font-mono text-xs">{e.path}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Request/Response Panel */}
                <div className="flex flex-col">
                  <div className="p-4 border-b border-dark-100 flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold text-white ${methodBg[ep.method]}`}>
                      {ep.method}
                    </span>
                    <code className="text-sm font-mono text-primary flex-1">{ep.path}</code>
                    <Button size="sm" onClick={sendRequest} disabled={loading}>
                      <Play className="w-3 h-3 mr-1" />
                      {loading ? "Sending..." : "Send"}
                    </Button>
                  </div>

                  <div className="flex-1 grid md:grid-cols-2 divide-x divide-dark-100">
                    {/* Request */}
                    <div className="p-4">
                      <label className="text-xs font-medium text-dark-100 mb-2 block">Request Body</label>
                      {ep.body ? (
                        <Textarea
                          value={requestBody}
                          onChange={(e) => setRequestBody(e.target.value)}
                          className="font-mono text-xs h-[300px] resize-none bg-dark-300/30 border-dark-100"
                          placeholder="{}"
                        />
                      ) : (
                        <div className="h-[300px] rounded-lg bg-dark-300/30 border border-dark-100 flex items-center justify-center text-sm text-dark-100">
                          No request body needed
                        </div>
                      )}
                    </div>

                    {/* Response */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-medium text-dark-100">Response</label>
                        {response && (
                          <div className="flex items-center gap-2">
                            {responseStatus && (
                              <Badge variant={responseStatus < 400 ? "success" : responseStatus < 500 ? "secondary" : "destructive"}>
                                {responseStatus}
                              </Badge>
                            )}
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyResponse}>
                              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="h-[300px] rounded-lg bg-dark-300/30 border border-dark-100 overflow-auto">
                        {response ? (
                          <pre className="p-3 text-xs font-mono text-dark-50 whitespace-pre-wrap">{response}</pre>
                        ) : (
                          <div className="h-full flex items-center justify-center text-sm text-dark-100">
                            Send a request to see the response
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Quick Start + Reference */}
        <section className="px-4 pb-16">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
            <Card className="border-dark-100">
              <CardHeader>
                <CardTitle className="text-lg">Quick Start</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">1. Get your API key</h4>
                  <p className="text-sm text-muted-foreground">Sign up and go to Dashboard → API Keys</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">2. Make your first request</h4>
                  <pre className="bg-dark-300/50 rounded-lg p-3 text-xs font-mono overflow-x-auto">
{`curl -X POST https://relurl.com/api/links \\
  -H "Authorization: Bearer YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com"}'`}
                  </pre>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">3. Use the short URL</h4>
                  <pre className="bg-dark-300/50 rounded-lg p-3 text-xs font-mono overflow-x-auto">
{`{
  "data": {
    "slug": "abc123",
    "shortUrl": "https://relurl.com/abc123",
    "url": "https://example.com"
  }
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card className="border-dark-100">
              <CardHeader>
                <CardTitle className="text-lg">Integrations</CardTitle>
                <CardDescription>Connect RELURL to your workflow</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { icon: Zap, name: "Zapier", desc: "Create short links from 5,000+ apps", path: "/integrations" },
                  { icon: Globe, name: "Make (Integromat)", desc: "Visual workflow automation", path: "/integrations" },
                  { icon: Shield, name: "WordPress Plugin", desc: "Shorten links from WordPress", path: "/wordpress" },
                  { icon: BarChart3, name: "Webhooks", desc: "Get notified on click events", path: "/api" },
                ].map((item, i) => (
                  <Link key={i} href={item.path} className="flex items-center gap-3 p-3 rounded-lg border border-dark-100 hover:border-primary/30 transition-all">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-4 pb-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8 text-gradient">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <Card key={i} className="border-dark-100">
                  <CardContent className="p-0">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                      className="w-full text-left p-4 flex items-center justify-between"
                    >
                      <span className="text-sm font-medium">{faq.q}</span>
                      {expandedFaq === i ? <ChevronDown className="w-4 h-4 text-dark-100" /> : <ChevronRight className="w-4 h-4 text-dark-100" />}
                    </button>
                    {expandedFaq === i && (
                      <div className="px-4 pb-4 text-sm text-muted-foreground">{faq.a}</div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
