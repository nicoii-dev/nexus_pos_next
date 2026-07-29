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
          <div key={i} className="rounded-2xl border bg-card p-6 shadow-float">
            <div className="flex items-center justify-between">
              <div className="h-4 w-28 rounded-full shimmer" />
              <div className="h-11 w-11 rounded-xl shimmer" />
            </div>
            <div className="mt-5">
              <div className="h-9 w-36 rounded-full shimmer" />
              <div className="mt-3 h-3 w-24 rounded-full shimmer" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "card") {
    return (
      <div className={cn("rounded-2xl border bg-card p-6 shadow-float", className)}>
        <div className="space-y-4">
          <div className="h-5 w-36 rounded-full shimmer" />
          <div className="h-3.5 w-full rounded-full shimmer" />
          <div className="h-3.5 w-3/4 rounded-full shimmer" />
        </div>
      </div>
    );
  }

  if (type === "chart") {
    return (
      <div className={cn("rounded-2xl border bg-card p-6 shadow-float", className)}>
        <div className="mb-5 h-5 w-44 rounded-full shimmer" />
        <div className="h-64 rounded-xl shimmer" />
      </div>
    );
  }

  return (
    <div className={cn("rounded-2xl border bg-card shadow-float", className)}>
      <div className="p-6">
        <div className="mb-4 h-5 w-36 rounded-full shimmer" />
      </div>
      <div className="px-6 pb-6 space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl shimmer" />
            <div className="flex-1 space-y-2.5">
              <div className="h-3.5 w-full rounded-full shimmer" />
              <div className="h-3 w-2/3 rounded-full shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
