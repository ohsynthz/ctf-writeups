export function WriteupCardSkeleton() {
  return (
    <div className="border border-border bg-card p-4">
      <div className="mb-2 flex gap-2">
        <div className="h-4 w-16 bg-secondary animate-pulse" />
        <div className="h-4 w-16 bg-secondary animate-pulse" />
      </div>
      <div className="mb-2 h-5 w-3/4 bg-secondary animate-pulse" />
      <div className="mb-2 h-4 w-1/2 bg-secondary animate-pulse" />
      <div className="flex justify-between">
        <div className="h-4 w-24 bg-secondary animate-pulse" />
        <div className="h-4 w-16 bg-secondary animate-pulse" />
      </div>
    </div>
  );
}

export function WriteupListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <WriteupCardSkeleton key={i} />
      ))}
    </div>
  );
}
