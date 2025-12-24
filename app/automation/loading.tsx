export default function AutomationLoading() {
  return (
    <div className="container mx-auto space-y-6 p-8">
      <div className="h-20 w-full animate-pulse rounded-lg bg-muted" />
      <div className="grid gap-6 lg:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-96 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    </div>
  )
}
