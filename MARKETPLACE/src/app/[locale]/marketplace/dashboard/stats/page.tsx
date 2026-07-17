import { StatsClient } from "@/MARKETPLACE/src/components/dashboard/stats-client"

interface Props {
  params: Promise<{ locale: string }>
}

export default async function StatsPage({ params }: Props) {
  const { locale } = await params
  return <StatsClient locale={locale} />
}