"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  changeLabel?: string;
  className?: string;
}

export function StatCard({ title, value, icon, change, changeLabel = "vs yesterday", className }: StatCardProps) {
  return (
    <div className={cn("rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md", className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="rounded-lg bg-muted p-2">{icon}</div>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        {change !== undefined && (
          <div className="mt-1 flex items-center gap-1">
            {change >= 0 ? (
              <TrendingUp className="h-3 w-3 text-emerald-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <span className={cn("text-xs font-medium", change >= 0 ? "text-emerald-500" : "text-red-500")}>
              {change >= 0 ? "+" : ""}{change}%
            </span>
            <span className="text-xs text-muted-foreground">{changeLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}
