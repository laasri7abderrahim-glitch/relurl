import { EditListingForm } from "@/MARKETPLACE/src/components/listings/edit-listing-form"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ locale: string; id: string }>
}

async function getListing(id: string) {
  return null
}

export default async function EditListingPage({ params }: Props) {
  const { locale, id } = await params
  const listing = await getListing(id)

  if (!listing) {
    notFound()
  }

  return <EditListingForm locale={locale} listing={listing as any} />
}