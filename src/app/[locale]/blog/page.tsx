"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const baseUrl = "https://relurl.com"

const posts = [
  {
    title: "The Ultimate Guide to URL Shorteners in 2026",
    excerpt: "Everything you need to know about choosing and using URL shorteners for your business, from branding to analytics.",
    date: "May 15, 2026",
    readTime: "8 min read",
    category: "Guides",
  },
  {
    title: "How Branded Short Links Boost Click-Through Rates",
    excerpt: "Discover how using your own domain for short links can increase trust and improve CTR by up to 39%.",
    date: "May 10, 2026",
    readTime: "5 min read",
    category: "Marketing",
  },
  {
    title: "Introducing Our New Analytics Dashboard",
    excerpt: "We've completely redesigned the analytics experience with real-time data, better visualizations, and export options.",
    date: "May 5, 2026",
    readTime: "4 min read",
    category: "Product",
  },
  {
    title: "Security Best Practices for Link Management",
    excerpt: "Learn about password protection, expiration dates, and other security features to keep your links safe.",
    date: "Apr 28, 2026",
    readTime: "6 min read",
    category: "Security",
  },
  {
    title: "Top 10 Ways to Use Short Links in Your Marketing",
    excerpt: "From social media to email campaigns, discover creative ways to leverage short links effectively.",
    date: "Apr 20, 2026",
    readTime: "7 min read",
    category: "Marketing",
  },
  {
    title: "A/B Testing with Short Links: A Complete Guide",
    excerpt: "Use our platform to run A/B tests on different URLs and optimize your conversion rates.",
    date: "Apr 12, 2026",
    readTime: "6 min read",
    category: "Guides",
  },
];

export default function BlogPage() {
  const locale = useLocale()
  const blogUrl = locale === "en" ? `${baseUrl}/blog` : `${baseUrl}/${locale}/blog`
  const schema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "RELURL Blog",
    description: "Tips, guides, and product updates to help you get the most out of your links.",
    url: blogUrl,
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      author: { "@type": "Organization", name: "RELURL" },
    })),
  }

  return (
    <div className="min-h-screen flex flex-col">
      <link rel="canonical" href={blogUrl} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Header />
      <main className="flex-1">
        <div className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">RELURL Blog</h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Tips, guides, and product updates to help you get the most out of your links.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <Card key={i} className="border-border/50 hover:border-primary/30 transition-all flex flex-col">
                  <CardContent className="p-6 flex-1">
                    <div className="text-xs font-medium text-primary mb-3 uppercase tracking-wider">{post.category}</div>
                    <h2 className="text-lg font-semibold mb-3 leading-tight">{post.title}</h2>
                    <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                  </CardContent>
                  <CardFooter className="px-6 pb-4 pt-0 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                    </div>
                    <Link href={`/blog#${post.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
                      <Button variant="ghost" size="sm" className="text-primary">Read <ArrowRight className="w-3 h-3 ml-1" /></Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" disabled>More Posts Coming Soon</Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
