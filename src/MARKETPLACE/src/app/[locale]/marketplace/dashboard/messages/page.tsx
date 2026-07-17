import { MessagesClient } from "@/MARKETPLACE/src/components/messages/messages-client"

interface Props {
  params: Promise<{ locale: string }>
}

export default async function MessagesPage({ params }: Props) {
  const { locale } = await params
  return <MessagesClient locale={locale} />
}