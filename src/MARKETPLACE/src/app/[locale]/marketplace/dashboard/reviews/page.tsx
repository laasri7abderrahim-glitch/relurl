import { ReviewsClient } from "@/MARKETPLACE/src/components/dashboard/reviews-client"

interface Props {
  params: Promise<{ locale: string }>
}

export default async function ReviewsPage({ params }: Props) {
  const { locale } = await params
  return <ReviewsClient locale={locale} />
}