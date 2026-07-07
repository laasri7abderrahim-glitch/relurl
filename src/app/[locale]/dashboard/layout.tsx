export async function generateMetadata() {
  return {
    robots: { index: false, follow: false },
  }
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
