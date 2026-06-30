import { readFileSync, writeFileSync, readdirSync } from "fs"
import { join } from "path"

const articlesDir = join("src", "lib", "blog", "articles")
const files = readdirSync(articlesDir).filter(f => f.endsWith(".ts")).sort()

const metas = []

for (const f of files) {
  const content = readFileSync(join(articlesDir, f), "utf-8")
  const startIdx = content.indexOf("export const article")
  if (startIdx === -1) continue
  const block = content.slice(startIdx)
  const braceIdx = block.indexOf("{")
  if (braceIdx === -1) continue
  const inner = block.slice(braceIdx + 1)

  // Find matching closing brace by counting braces
  let depth = 1
  let closeIdx = 0
  for (let i = 0; i < inner.length; i++) {
    if (inner[i] === "{") depth++
    if (inner[i] === "}") depth--
    if (depth === 0) { closeIdx = i; break }
  }

  const objStr = inner.slice(0, closeIdx)

  // Extract fields with simple parsing
  const slug = objStr.match(/slug:\s*"([^"]+)"/)?.[1] || ""
  const title = objStr.match(/title:\s*"([^"]+)"/)?.[1] || ""
  const metaDescription = objStr.match(/metaDescription:\s*"([^"]+)"/)?.[1] || ""
  const keywordsMatch = objStr.match(/keywords:\s*\[([^\]]+)\]/)?.[1] || ""
  const keywords = keywordsMatch ? keywordsMatch.split(",").map(k => k.trim().replace(/"/g, "")) : []
  const landingPage = objStr.match(/landingPage:\s*"([^"]+)"/)?.[1] || ""
  const category = objStr.match(/category:\s*"([^"]+)"/)?.[1] || ""
  const date = objStr.match(/date:\s*"([^"]+)"/)?.[1] || ""
  const readTime = objStr.match(/readTime:\s*"([^"]+)"/)?.[1] || ""
  const image = objStr.match(/image:\s*"([^"]+)"/)?.[1] || ""
  const imageAlt = objStr.match(/imageAlt:\s*"([^"]+)"/)?.[1] || ""

  metas.push({ slug, title, metaDescription, keywords, landingPage, category, date, readTime, image, imageAlt })
}

// Generate the TypeScript file
const lines = []
lines.push('import { BlogPostMeta } from "./types"')
lines.push("")
lines.push("const allPostMetas: BlogPostMeta[] = [")

for (const m of metas) {
  const kw = m.keywords.length > 0
    ? `["${m.keywords.join('", "')}"]`
    : '[]'

  lines.push("  {")
  lines.push(`    slug: "${m.slug}",`)
  lines.push(`    title: "${m.title.replace(/"/g, '\\"')}",`)
  lines.push(`    metaDescription: "${m.metaDescription.replace(/"/g, '\\"')}",`)
  lines.push(`    category: "${m.category}",`)
  lines.push(`    date: "${m.date}",`)
  lines.push(`    readTime: "${m.readTime}",`)
  if (m.image) lines.push(`    image: "${m.image}",`)
  if (m.imageAlt) lines.push(`    imageAlt: "${m.imageAlt.replace(/"/g, '\\"')}",`)
  lines.push("  },")
}

lines.push("]")
lines.push("")
lines.push("const PER_PAGE = 24")
lines.push("")
lines.push("export function getPaginatedPostMetas(page: number, perPage = PER_PAGE): BlogPostMeta[] {")
lines.push("  const start = (page - 1) * perPage")
lines.push("  return allPostMetas.slice(start, start + perPage)")
lines.push("}")
lines.push("")
lines.push("export function getTotalPages(perPage = PER_PAGE): number {")
lines.push("  return Math.ceil(allPostMetas.length / perPage)")
lines.push("}")
lines.push("")
lines.push("export function getAllPostMetas(): BlogPostMeta[] {")
lines.push("  return allPostMetas")
lines.push("}")

writeFileSync(join("src", "lib", "blog", "post-metas.ts"), lines.join("\n"), "utf-8")
console.log(`Generated post-metas.ts with ${metas.length} entries`)
