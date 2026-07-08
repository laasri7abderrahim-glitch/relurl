import { auth } from "@/lib/auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export async function generateMetadata() {
  return {
    robots: { index: false, follow: false },
  }
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  return (
    <DashboardLayout
      userName={session?.user?.name ?? undefined}
      userEmail={session?.user?.email ?? undefined}
      userAvatar={session?.user?.image ?? undefined}
    >
      {children}
    </DashboardLayout>
  )
}
