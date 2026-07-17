import { FavoritesClient } from "@/MARKETPLACE/src/components/dashboard/favorites-client"

interface Props {
  params: Promise<{ locale: string }>
}

export default async function FavoritesPage({ params }: Props) {
  const { locale } = await params
  return <FavoritesClient locale={locale} />
}