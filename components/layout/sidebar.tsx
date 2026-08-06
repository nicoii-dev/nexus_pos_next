"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { filterMenuItems } from "@/constants";
import { useGetCurrentUser } from "@/services/auth";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { data: user, isLoading } = useGetCurrentUser();
  const menuItems = useMemo(() => (isLoading ? [] : filterMenuItems(user?.role)), [user?.role, isLoading]);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-full flex-col border-r border-border/40 bg-card/70 glass transition-all duration-300 ease-out",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      <div className="absolute inset-0 mesh-gradient pointer-events-none opacity-50" />

      <div className={cn("relative flex h-16 items-center gap-3 border-b border-border/40 px-4", collapsed && "justify-center px-0")}>
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br from-primary via-primary/90 to-primary/70 text-primary-foreground text-sm font-bold shadow-glow">
          N
            <div className="absolute inset-0 rounded-[10px] bg-gradient-to-br from-white/20 to-transparent" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight">Nexus POS</span>
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">Management</span>
          </div>
        )}
      </div>

      <nav className="relative flex-1 space-y-1 p-2.5">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-primary/12 to-primary/5 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-accent/70 hover:text-foreground",
                collapsed && "justify-center px-0"
              )}
              title={collapsed ? item.title : undefined}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-gradient-to-b from-primary to-primary/60" />
              )}
              <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] transition-all duration-200",
                isActive
                  ? "bg-primary/12 text-primary"
                  : "text-muted-foreground group-hover:bg-accent group-hover:text-foreground group-hover:scale-105"
              )}>
                <item.icon className="h-[18px] w-[18px]" />
              </div>
              {!collapsed && <span className={cn("transition-all duration-200", isActive && "font-semibold")}>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="relative border-t border-border/40 p-2">
        <button
          onClick={onToggle}
          className="flex w-full items-center justify-center gap-2 rounded-[10px] px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent/70 hover:text-foreground transition-all duration-200"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-[10px] bg-muted/60 transition-transform duration-200 group-hover:scale-105">
            {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          </div>
          {!collapsed && <span className="text-xs font-medium">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
