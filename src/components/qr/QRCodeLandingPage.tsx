"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QRCode } from "@/components/ui/qr-code"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Copy, Check, Download, ArrowRight, QrCode, ChevronRight, Zap, Shield, Smartphone, Globe } from "lucide-react"

interface QRPageProps {
  title: string
  subtitle: string
  description: string
  placeholder: string
  defaultValue?: string
  inputLabel?: string
  generateLabel?: string
  presetType?: string
  features: string[]
  howItWorks: { step: string; desc: string }[]
  useCases: string[]
  relatedPages: { title: string; href: string }[]
  allQRCodes: { title: string; href: string }[]
  children?: React.ReactNode
}

export default function QRCodeLandingPage({
  title,
  subtitle,
  description,
  placeholder,
  defaultValue = "",
  inputLabel = "Enter your URL or data",
  generateLabel = "Generate QR Code",
  features,
  howItWorks,
  useCases,
  relatedPages,
  allQRCodes,
  children,
}: QRPageProps) {
  const [inputValue, setInputValue] = useState(defaultValue)
  const [qrValue, setQrValue] = useState("")
  const [copied, setCopied] = useState(false)

  const handleGenerate = () => {
    if (!inputValue) return
    setQrValue(inputValue)
  }

  const handleDownload = () => {
    const canvas = document.querySelector("canvas")
    if (canvas) {
      const link = document.createElement("a")
      link.download = "qrcode.png"
      link.href = canvas.toDataURL("image/png")
      link.click()
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(inputValue)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: title,
          applicationCategory: "WebApplication",
          operatingSystem: "Web",
          url: "https://relurl.com" + title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          description,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        })}}
      />
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-4 pt-24 pb-16 text-center">
          <div className="absolute inset-0 pointer-events-none">
            <svg className="absolute -top-20 -right-40 w-[510px] h-[227px] opacity-20" viewBox="0 0 510 227" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M-87.152 -39.8215C-88.9236 -97.5924 -78.1971 -154.94 -48.4234 -204.479C-20.7542 -250.517 24.1466 -281.369 72.3104 -305.144C118.507 -327.949 168.356 -332.792 219.715 -336.844C285.535 -342.038 369.083 -381.424 412.88 -332.018C457.935 -281.194 406.048 -201.31 399.82 -133.678C395.679 -88.7194 394.135 -46.317 382.55 -2.68C368.135 51.6174 373.1 123.327 324.232 151.04C275.433 178.714 218.732 122.276 162.632 122.037C93.5849 121.742 20.3777 187.044 -37.5683 149.496C-93.687 113.131 -85.1022 27.0177 -87.152 -39.8215Z" fill="url(#qr0)" fillOpacity="0.4"/>
              <defs><linearGradient id="qr0" x1="403.713" y1="80.0373" x2="-60.6291" y2="-29.7743"><stop stopColor="#14b8a6" stopOpacity="0"/><stop offset="1" stopColor="#14b8a6" stopOpacity="0.3"/></linearGradient></defs>
            </svg>
          </div>
          <div className="relative z-10 max-w-4xl mx-auto">
            <p className="text-primary font-medium mb-4">{subtitle}</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gradient leading-tight">{title}</h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">{description}</p>
          </div>
        </section>

        {/* QR Generator Section */}
        <section className="px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            <Card className="border-border/50 shadow-2xl shadow-primary/5">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  <div>
                    <label className="block text-sm font-medium mb-2">{inputLabel}</label>
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={placeholder}
                      className="w-full h-32 px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    {children}
                    <div className="flex gap-3 mt-4">
                      <Button onClick={handleGenerate} disabled={!inputValue} className="flex-1">
                        <QrCode className="w-4 h-4 mr-2" />
                        {generateLabel}
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    {qrValue ? (
                      <>
                        <QRCode value={qrValue} size={220} />
                        <p className="text-sm text-muted-foreground mt-3 mb-4">Scan to open</p>
                        <div className="flex gap-2 w-full">
                          <Button variant="outline" size="sm" className="flex-1" onClick={handleDownload}>
                            <Download className="w-4 h-4 mr-2" />
                            Download PNG
                          </Button>
                          <Button variant="outline" size="sm" onClick={handleCopy}>
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="w-[220px] h-[220px] rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground">
                        <QrCode className="w-12 h-12 mb-3 opacity-30" />
                        <p className="text-sm">Enter data to generate</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 py-16 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gradient">Why Use Our {title}?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <Card key={i} className="border-border/50 hover:border-primary/30 transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm font-medium">{feature}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gradient">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {howItWorks.map((item, i) => (
                <div key={i} className="text-center">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                    {i + 1}
                  </div>
                  <h3 className="font-semibold mb-2">{item.step}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="px-4 py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-gradient">Popular Use Cases</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {useCases.map((useCase, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-lg bg-background border border-border/50">
                  <ChevronRight className="w-5 h-5 text-primary shrink-0" />
                  <p className="text-sm">{useCase}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related QR Codes */}
        <section className="px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-gradient">Related QR Code Generators</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedPages.map((page, i) => (
                <Link key={i} href={page.href}>
                  <Card className="border-border/50 hover:border-primary/30 transition-all hover:-translate-y-1 cursor-pointer h-full">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2">{page.title}</h3>
                      <p className="text-sm text-muted-foreground flex items-center">
                        Try it now <ArrowRight className="w-4 h-4 ml-1" />
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* All QR Codes Directory */}
        <section className="px-4 py-16 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-gradient">All QR Code Generators</h2>
            <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-3">
              {allQRCodes.map((qr, i) => (
                <Link key={i} href={qr.href}>
                  <div className="p-3 rounded-lg bg-background border border-border/50 hover:border-primary/30 transition-all text-center text-sm font-medium cursor-pointer">
                    {qr.title}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ / SEO Content */}
        <section className="px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-gradient">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">What is a {title}?</h3>
                  <p className="text-sm text-muted-foreground">
                    A {title.toLowerCase()} allows you to create a scannable QR code for {title.toLowerCase().replace("qr code generator", "").replace("qr code for", "").trim()} purposes. Users can scan the code with their smartphone camera to instantly access your content.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Is this QR code generator free?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes! Our {title.toLowerCase()} is completely free to use. You can generate unlimited QR codes without any cost. Sign up for a free account to access advanced features like analytics and custom styling.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Can I customize my QR code?</h3>
                  <p className="text-sm text-muted-foreground">
                    Absolutely. After generating your QR code, you can download it as a high-resolution PNG file. For advanced customization like colors, logos, and frames, sign up for a free account.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Are the QR codes scannable?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes, all QR codes generated with our tool are fully scannable with any standard QR code reader or smartphone camera. We use the latest QR code generation technology to ensure maximum compatibility.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
