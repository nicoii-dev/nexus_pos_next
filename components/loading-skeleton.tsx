import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  rows?: number;
  type?: "card" | "table" | "chart" | "stat";
}

export function LoadingSkeleton({ className, rows = 3, type = "table" }: LoadingSkeletonProps) {
  if (type === "stat") {
    return (
      <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-4", className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-10 w-10 animate-pulse rounded-lg bg-muted" />
            </div>
            <div className="mt-4">
              <div className="h-8 w-32 animate-pulse rounded bg-muted" />
              <div className="mt-2 h-3 w-20 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "card") {
    return (
      <div className={cn("rounded-xl border bg-card p-6 shadow-sm", className)}>
        <div className="space-y-3">
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          <div className="h-3 w-full animate-pulse rounded bg-muted" />
          <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (type === "chart") {
    return (
      <div className={cn("rounded-xl border bg-card p-6 shadow-sm", className)}>
        <div className="mb-4 h-4 w-40 animate-pulse rounded bg-muted" />
        <div className="h-64 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl border bg-card shadow-sm", className)}>
      <div className="p-6">
        <div className="mb-4 h-4 w-32 animate-pulse rounded bg-muted" />
      </div>
      <div className="px-6 pb-6 space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-10 w-10 animate-pulse rounded bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
