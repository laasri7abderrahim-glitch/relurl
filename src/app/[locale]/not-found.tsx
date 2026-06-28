import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-dark-700 p-4">
      <div className="text-center">
        <div className="mb-8">
          <span className="text-4xl font-bold text-primary-500">RELURL</span>
        </div>
        <h1 className="mb-4 text-6xl font-bold text-dark-50">
          404 - Page Not Found
        </h1>
        <p className="mb-8 text-dark-100">
          The page you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-primary-500 px-6 text-sm font-medium text-white hover:bg-primary-600"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
