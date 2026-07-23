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
  return {
    title: t("title"),
    subtitle: t("subtitle"),
    description: t("description"),
    metaDescription: t("metaDescription"),
    keywords: t.raw("keywords") as string[],
    features: t.raw("features") as string[],
    howItWorks: t.raw("howItWorks") as { step: string; desc: string }[],
    useCases: t.raw("useCases") as string[],
    faqs,
  }
}
