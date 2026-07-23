export { default } from "./page.client"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return {
    title: "Password Protected Link - RELURL",
    description: "Enter the password to access this protected link",
    robots: { index: false, follow: false },
    alternates: {
      canonical: `https://relurl.com/${locale}/p`,
    },
  }
}
