import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/25",
  inactive: "bg-zinc-500/10 text-zinc-600 border-zinc-500/20 dark:bg-zinc-500/15 dark:text-zinc-400 dark:border-zinc-500/25",
  in_stock: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/25",
  low_stock: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/25",
  out_of_stock: "bg-red-500/10 text-red-600 border-red-500/20 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/25",
  completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/25",
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/25",
  refunded: "bg-red-500/10 text-red-600 border-red-500/20 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/25",
};

const STATUS_DOT: Record<string, string> = {
  active: "bg-emerald-500",
  inactive: "bg-zinc-500",
  in_stock: "bg-emerald-500",
  low_stock: "bg-amber-500",
  out_of_stock: "bg-red-500",
  completed: "bg-emerald-500",
  pending: "bg-amber-500",
  refunded: "bg-red-500",
};

const STATUS_LABELS: Record<string, string> = {
  in_stock: "In Stock",
  low_stock: "Low Stock",
  out_of_stock: "Out of Stock",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium capitalize transition-colors",
        STATUS_STYLES[status] || "bg-muted text-muted-foreground",
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT[status] || "bg-muted-foreground")} />
      {STATUS_LABELS[status] || status}
    </span>
  );
}
