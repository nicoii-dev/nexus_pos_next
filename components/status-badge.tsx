import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800",
  inactive: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-400 dark:border-gray-800",
  in_stock: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800",
  low_stock: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800",
  out_of_stock: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800",
  pending: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800",
  refunded: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800",
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
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        STATUS_STYLES[status] || "bg-muted text-muted-foreground",
        className
      )}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
}
