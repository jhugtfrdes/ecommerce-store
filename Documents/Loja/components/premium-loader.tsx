export function PremiumLoader() {
  return (
    <div className="min-h-[82svh] bg-ink px-4 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="h-5 w-40 animate-pulse rounded-full bg-white/10" />
        <div className="mt-6 h-16 max-w-3xl animate-pulse rounded-lg bg-white/10" />
        <div className="mt-4 h-6 max-w-xl animate-pulse rounded-lg bg-white/10" />
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="premium-border overflow-hidden rounded-lg bg-white/[0.03]">
              <div className="aspect-[1.25/1] animate-pulse bg-white/10" />
              <div className="space-y-3 p-3">
                <div className="h-4 animate-pulse rounded bg-white/10" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-white/10" />
                <div className="h-10 animate-pulse rounded-full bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
