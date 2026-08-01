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
    <div className={cn("group relative overflow-hidden rounded-[10px] border bg-card p-6 shadow-float transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-elevated card-hover animate-in-up", className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="rounded-[10px] bg-gradient-to-br from-primary/10 to-primary/5 p-2.5 transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
      </div>
      <div className="relative mt-4">
        <p className="text-3xl font-bold tracking-tight">{value}</p>
        {change !== undefined && (
          <div className="mt-2 flex items-center gap-1.5">
            {change >= 0 ? (
              <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                <span className="text-xs font-semibold text-emerald-500">+{change}%</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5">
                <TrendingDown className="h-3 w-3 text-red-500" />
                <span className="text-xs font-semibold text-red-500">{change}%</span>
              </div>
            )}
            <span className="text-xs text-muted-foreground">{changeLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}
