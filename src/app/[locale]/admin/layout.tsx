export async function generateMetadata() {
  return {
    robots: { index: false, follow: false },
  }
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
