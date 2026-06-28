"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QRCode } from "@/components/ui/qr-code";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ArrowRight, BarChart3, Globe, Link2, QrCode, Shield, Sliders, Users, Copy, Check, Download } from "lucide-react";

export default function HomePage() {
  const [tab, setTab] = useState<"shorten" | "qr">("shorten");
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [qrValue, setQrValue] = useState("");

  const handleShorten = async () => {
    if (!url) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (res.ok) {
        setShortUrl(data.data?.shortUrl || data.short_url || window.location.origin + "/" + (data.data?.slug || data.slug));
      } else if (res.status === 401) {
        setError("Please sign in to shorten URLs");
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQR = () => {
    if (!url) return;
    setQrValue(url);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <link rel="canonical" href="https://relurl.com" />
      <Header />
      <main className="flex-1">
      <section className="relative overflow-hidden px-4 pt-24 pb-32 text-center">
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute -top-20 -right-40 w-[510px] h-[227px] opacity-30" viewBox="0 0 510 227" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M-87.152 -39.8215C-88.9236 -97.5924 -78.1971 -154.94 -48.4234 -204.479C-20.7542 -250.517 24.1466 -281.369 72.3104 -305.144C118.507 -327.949 168.356 -332.792 219.715 -336.844C285.535 -342.038 369.083 -381.424 412.88 -332.018C457.935 -281.194 406.048 -201.31 399.82 -133.678C395.679 -88.7194 394.135 -46.317 382.55 -2.68C368.135 51.6174 373.1 123.327 324.232 151.04C275.433 178.714 218.732 122.276 162.632 122.037C93.5849 121.742 20.3777 187.044 -37.5683 149.496C-93.687 113.131 -85.1022 27.0177 -87.152 -39.8215Z" fill="url(#h0)" fillOpacity="0.4"/>
            <defs><linearGradient id="h0" x1="403.713" y1="80.0373" x2="-60.6291" y2="-29.7743"><stop stopColor="#14b8a6" stopOpacity="0"/><stop offset="1" stopColor="#14b8a6" stopOpacity="0.3"/></linearGradient></defs>
          </svg>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-6 px-4 py-2 text-sm">Free URL Shortener</Badge>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-gradient leading-tight">
            URL Shortener, Branded Short Links & Analytics
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Shorten, track, and manage your links with powerful analytics and custom branded domains — all in one place.
          </p>
          <Card className="max-w-2xl mx-auto border-border/50 shadow-2xl shadow-primary/5">
            <CardContent className="p-6">
              <div className="flex gap-2 mb-6">
                <Button
                  variant={tab === "shorten" ? "secondary" : "ghost"}
                  size="sm"
                  className="flex-1"
                  onClick={() => { setTab("shorten"); setShortUrl(""); setQrValue(""); setUrl(""); }}
                >
                  <Link2 className="w-4 h-4 mr-2" />
                  Shorten a Link
                </Button>
                <Button
                  variant={tab === "qr" ? "secondary" : "ghost"}
                  size="sm"
                  className="flex-1"
                  onClick={() => { setTab("qr"); setShortUrl(""); setQrValue(""); setUrl(""); }}
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  QR Code
                </Button>
              </div>

              {tab === "shorten" ? (
                <>
                  <div className="flex gap-3">
                    <Input
                      placeholder="https://example.com/my-long-url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleShorten()}
                      className="flex-1 h-12"
                    />
                    <Button onClick={handleShorten} disabled={loading} size="lg" className="h-12 px-8">
                      {loading ? "Shortening..." : "Shorten"}
                    </Button>
                  </div>
                  {error && (
                    <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-500">
                      {error}{" "}
                      {error.includes("sign in") && (
                        <Link href="/login" className="underline font-medium">Sign in</Link>
                      )}
                    </div>
                  )}
                  {shortUrl && (
                    <div className="mt-4 flex items-center justify-between p-3 bg-primary/10 border border-primary/20 rounded-lg">
                      <a href={shortUrl} target="_blank" className="text-primary font-medium truncate mr-4">
                        {shortUrl}
                      </a>
                      <Button variant="outline" size="sm" onClick={copyLink} className="shrink-0">
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-4">
                    By clicking Shorten, you agree with our Terms of Service, Privacy Policy, and Use of Cookies.
                  </p>
                </>
              ) : (
                <>
                  <div className="flex gap-3">
                    <Input
                      placeholder="https://example.com/my-long-url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleGenerateQR()}
                      className="flex-1 h-12"
                    />
                    <Button onClick={handleGenerateQR} size="lg" className="h-12 px-8">
                      <QrCode className="w-4 h-4 mr-2" />
                      Generate
                    </Button>
                  </div>
                  {qrValue && (
                    <div className="mt-6 flex flex-col items-center gap-4">
                      <QRCode value={qrValue} size={200} />
                      <p className="text-sm text-muted-foreground">Scan this QR code to open the URL</p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const canvas = document.querySelector("canvas");
                            if (canvas) {
                              const link = document.createElement("a");
                              link.download = "qrcode.png";
                              link.href = canvas.toDataURL("image/png");
                              link.click();
                            }
                          }}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download PNG
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(qrValue);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                        >
                          {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                          Copy URL
                        </Button>
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-4">
                    Paste any URL and generate a QR code. Download or share it anywhere.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gradient">RELURL Plans Include:</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BarChart3, title: "Detailed Link Analytics", desc: "Stay on top of your links' performance and get insights into the clicks you earn and people you reach." },
              { icon: Globe, title: "Fully Branded Domains", desc: "Customize every part of your links with branded domains — say goodbye to default link shortening!" },
              { icon: Link2, title: "Bulk Short URLs", desc: "Scale your communications with our API, and create thousands of unique short links in the blink of an eye." },
              { icon: Sliders, title: "Link Management", desc: "Take full control of your links: search, edit, and manage thousands at a time from a convenient dashboard." },
            ].map((f, i) => (
              <Card key={i} className="border-border/50 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <f.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 text-center bg-grid">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">Link Shortening Done Quick and Easy</h2>
          <p className="text-lg text-muted-foreground mb-4 max-w-2xl mx-auto">
            Our URL shortener makes link management simple, fast, and effective &mdash; whether for personal use or enterprise campaigns.
          </p>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Wave goodbye to long, clunky links and give your audiences the experiences they deserve!
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/pricing">
              <Button size="lg" className="px-8">View Plans</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="px-8">Contact Sales</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gradient">
            Your One-Stop Solution for Branding and Managing Links
          </h2>
          <p className="text-lg text-muted-foreground text-center mb-16 max-w-3xl mx-auto">
            We offer a comprehensive suite of premium features to allow users to brand and manage links conveniently and confidently.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: BarChart3, title: "Unlimited Tracked Clicks", desc: "Track as many clicks as you earn with our Pro plans!" },
              { icon: BarChart3, title: "Detailed Link Analytics", desc: "Get actionable, detailed insights into your social media, emails, ads, and more." },
              { icon: Globe, title: "Branded Domains", desc: "Links shortened using your own custom domain are more professional and more clickable." },
              { icon: Link2, title: "Fully Custom Links", desc: "Create short links that put your brand front-and-center!" },
              { icon: Users, title: "Bulk Short URLs", desc: "Shorten several links in a single go using our platform or API." },
              { icon: Sliders, title: "Link Management", desc: "Worried about finding links in a tide of thousands? We solve that." },
            ].map((f, i) => (
              <Card key={i} className="border-border/50 hover:border-primary/30 transition-all">
                <CardContent className="p-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <f.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/pricing">
              <Button size="lg" className="px-8">View Plans</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">Modern Link Management for Everyone</h2>
          <p className="text-lg text-muted-foreground">
            Built for marketers, creators, and businesses who need reliable link shortening with real-time analytics and full control.
          </p>
        </div>
      </section>
      </main>
      <Footer />
    </div>
  );
}
