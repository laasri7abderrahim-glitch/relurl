"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/toast"
import { Link2, Copy, CheckCheck, Loader2, FileText, Trash2, ExternalLink } from "lucide-react"

interface CreatedLink {
  id: string
  slug: string
  domain: string
  url: string
}

interface BulkError {
  url: string
  error: string
  index: number
}

interface BulkResult {
  created: CreatedLink[]
  errors: BulkError[]
}

export default function BatchShortener() {
  const { addToast } = useToast()
  const [urls, setUrls] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<BulkResult | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null)

  const urlList = urls
    .split("\n")
    .map((u) => u.trim())
    .filter(Boolean)

  const handleSubmit = async () => {
    if (!urlList.length) {
      addToast("Enter at least one URL", "error")
      return
    }
    if (urlList.length > 50) {
      addToast("Maximum 50 URLs at a time", "error")
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const res = await fetch("/api/links/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ links: urlList.map((url) => ({ url })) }),
      })
      const json = await res.json()
      if (json.data && !json.error) {
        setResult({ created: json.data.created || [], errors: json.data.errors || [] })
        addToast(`Created ${json.data.created.length} link${json.data.created.length !== 1 ? "s" : ""}`, "success")
      } else {
        addToast(json.error || "Failed to create links", "error")
      }
    } catch {
      addToast("An unexpected error occurred", "error")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedIndex(key)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const copyAllLinks = async () => {
    if (!result?.created.length) return
    const text = result.created.map((link) => `https://${link.domain}/${link.slug}`).join("\n")
    await navigator.clipboard.writeText(text)
    setCopiedIndex("all")
    addToast("All short links copied", "success")
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card className="border-dark-100">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-accent" />
              Enter URLs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              placeholder="Paste URLs here, one per line&#10;https://example.com&#10;https://example.org&#10;https://example.net"
              rows={10}
              className="w-full rounded-lg border border-dark-100 bg-dark-500 px-3 py-2 text-sm text-dark-50 placeholder:text-dark-100 resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-700"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-dark-100">{urlList.length} URL{urlList.length !== 1 ? "s" : ""} detected</span>
              <div className="flex gap-2">
                {urls && (
                  <Button variant="outline" size="sm" onClick={() => { setUrls(""); setResult(null) }}>
                    <Trash2 className="h-3 w-3 mr-1" /> Clear
                  </Button>
                )}
                <Button
                  size="sm"
                  className="bg-accent hover:bg-accent/90"
                  disabled={loading || urlList.length === 0}
                  onClick={handleSubmit}
                >
                  {loading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Link2 className="h-4 w-4 mr-1" />}
                  {loading ? "Creating..." : `Shorten All${urlList.length ? ` (${urlList.length})` : ""}`}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card className="border-dark-100">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCheck className="h-4 w-4 text-emerald-500" />
                Results ({result.created.length} created{result.errors.length ? `, ${result.errors.length} failed` : ""})
              </CardTitle>
              {result.created.length > 0 && (
                <Button variant="outline" size="sm" onClick={copyAllLinks}>
                  {copiedIndex === "all" ? <CheckCheck className="h-3 w-3 mr-1 text-emerald-500" /> : <Copy className="h-3 w-3 mr-1" />}
                  {copiedIndex === "all" ? "Copied!" : "Copy All"}
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {result.created.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Original URL</TableHead>
                      <TableHead>Short Link</TableHead>
                      <TableHead className="w-20 text-right">Copy</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.created.map((link) => {
                      const shortUrl = `https://${link.domain}/${link.slug}`
                      return (
                        <TableRow key={link.id}>
                          <TableCell className="max-w-[200px]">
                            <p className="truncate text-xs text-dark-100" title={link.url}>{link.url}</p>
                          </TableCell>
                          <TableCell>
                            <a
                              href={shortUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-sm text-accent hover:underline"
                            >
                              {link.slug}
                              <ExternalLink className="h-3 w-3 shrink-0" />
                            </a>
                          </TableCell>
                          <TableCell className="text-right">
                            <button
                              onClick={() => copyToClipboard(shortUrl, link.id)}
                              className="text-dark-100 hover:text-dark-50 transition-colors"
                              title="Copy short link"
                            >
                              {copiedIndex === link.id ? (
                                <CheckCheck className="h-4 w-4 text-emerald-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}

              {result.errors.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-medium text-red-400">Failed URLs:</p>
                  {result.errors.map((e, i) => (
                    <div key={i} className="rounded-lg border border-red-500/30 bg-red-500/5 p-3">
                      <p className="text-xs text-dark-100 break-all">{e.url}</p>
                      <p className="text-xs text-red-400">{e.error}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-4">
        <Card className="border-dark-100">
          <CardHeader>
            <CardTitle className="text-sm">Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-dark-100">
            <p>✓ One URL per line</p>
            <p>✓ URLs must include http:// or https://</p>
            <p>✓ Max 50 URLs per batch</p>
            <p>✓ All links use your default domain</p>
            <p>✓ Custom slugs not supported in batch mode</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
