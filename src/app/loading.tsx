export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-dark-700">
      <div className="text-center">
        <div className="mb-6">
          <span className="text-4xl font-bold text-primary-500">RELURL</span>
        </div>
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-dark-100 border-t-primary-500" />
        </div>
      </div>
    </div>
  )
}
