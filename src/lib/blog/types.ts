export interface BlogPostMeta {
  slug: string
  title: string
  metaDescription: string
  keywords?: string[]
  category: string
  date: string
  readTime: string
  image?: string
  imageAlt?: string
}

export interface BlogPost extends BlogPostMeta {
  slug: string
  title: string
  metaDescription: string
  keywords: string[]
  landingPage: string
  category: string
  date: string
  readTime: string
  image?: string
  imageAlt?: string
  content: BlogSection[]
}

export interface BlogSection {
  type: "paragraph" | "heading" | "list" | "faq" | "cta" | "code"
  content?: string
  items?: string[]
  faqs?: { q: string; a: string }[]
  level?: number
}
