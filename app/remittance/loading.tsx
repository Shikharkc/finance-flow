export default function RemittanceLoading() {
  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="h-20 w-full animate-pulse rounded-lg bg-muted" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
      <div className="h-96 w-full animate-pulse rounded-lg bg-muted" />
    </div>
  )
}
