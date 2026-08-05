import { getTranslations } from "next-intl/server"

export interface PageContent {
  title: string
  subtitle: string
  description: string
  metaDescription: string
  keywords: string[]
  features: string[]
  howItWorks: { step: string; desc: string }[]
  useCases: string[]
  faqs?: { q: string; a: string }[]
  moreContent?: PageMoreContent
}

export interface PageMoreContent {
  longDescription?: string
  whyChoose?: string
  comparisonPoints?: string[]
  benefits?: { title: string; text: string }[]
  tips?: { title: string; text: string }[]
}

export interface PageOverrides {
  placeholder?: string
  inputLabel?: string
  generateLabel?: string
  defaultValue?: string
}

export async function getPageContent(
  locale: string,
  pageKey: string
): Promise<PageContent & { faqs: { q: string; a: string }[] | undefined }> {
  const t = await getTranslations({ locale, namespace: `pages.${pageKey}` })
  let faqs: { q: string; a: string }[] | undefined
  try {
    const raw = t.raw("faqs")
    if (Array.isArray(raw) && raw.length > 0) {
      faqs = raw as { q: string; a: string }[]
    }
  } catch {
    faqs = undefined
  }
  let keywords: string[] = []
  let features: string[] = []
  let howItWorks: { step: string; desc: string }[] = []
  let useCases: string[] = []
  try { keywords = t.raw("keywords") as string[] } catch {}
  try { features = t.raw("features") as string[] } catch {}
  try { howItWorks = t.raw("howItWorks") as { step: string; desc: string }[] } catch {}
  try { useCases = t.raw("useCases") as string[] } catch {}

  return {
    title: t("title"),
    subtitle: t("subtitle"),
    description: t("description"),
    metaDescription: t("metaDescription"),
    keywords,
    features,
    howItWorks,
    useCases,
    faqs,
    moreContent: readMoreContent(t),
  }
}

type Translations = Awaited<ReturnType<typeof getTranslations>>

function readMoreContent(t: Translations): PageMoreContent {
  const out: PageMoreContent = {}
  const tryKey = (key: string): unknown => {
    try { return t.raw(key) } catch { return undefined }
  }
  const v = tryKey("longDescription")
  if (typeof v === "string") out.longDescription = v
  const w = tryKey("whyChoose")
  if (typeof w === "string") out.whyChoose = w
  const cp = tryKey("comparisonPoints")
  if (Array.isArray(cp)) out.comparisonPoints = cp as string[]
  const b = tryKey("benefits")
  if (Array.isArray(b)) out.benefits = b as { title: string; text: string }[]
  const ti = tryKey("tips")
  if (Array.isArray(ti)) out.tips = ti as { title: string; text: string }[]
  return out
}
