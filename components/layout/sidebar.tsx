"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MENU_ITEMS } from "@/constants";
import { Building2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-full flex-col border-r bg-card transition-all duration-300",
        collapsed ? "w-[68px]" : "w-64"
      )}
    >
      <div className={cn("flex h-16 items-center gap-2 border-b px-4", collapsed && "justify-center")}>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
          N
        </div>
        {!collapsed && (
          <span className="text-lg font-bold tracking-tight">Nexus POS</span>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                collapsed && "justify-center"
              )}
              title={collapsed ? item.title : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-2">
        <button
          onClick={onToggle}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
