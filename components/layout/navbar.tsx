"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Bell, ChevronDown, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { BRANCHES } from "@/components/layout/data";

interface NavbarProps {
  onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("1");

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/40 bg-background/80 glass-strong px-4 lg:px-6">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />

      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex items-center gap-2">
        <Select value={selectedBranch} onValueChange={(v) => v !== null && setSelectedBranch(v)}>
          <SelectTrigger className="w-[200px] h-9 rounded-xl border-border/60 bg-card/40 hover:bg-card/70 transition-colors">
            <SelectValue placeholder="Select branch" />
          </SelectTrigger>
          <SelectContent>
            {BRANCHES.map((b) => (
              <SelectItem key={b.id} value={b.id}>
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-1.5">
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl">
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gradient-to-br from-destructive to-destructive/80 text-[10px] font-bold text-white shadow-sm">
            <span className="relative flex h-full w-full items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive/40 opacity-75" />
              3
            </span>
          </span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-xl"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {mounted ? (
            theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />
          ) : (
            <div className="h-[18px] w-[18px]" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 outline-none hover:bg-accent/70 transition-all duration-200 group">
            <div className="relative">
              <Avatar className="h-8 w-8 ring-2 ring-border/40 transition-all duration-200 group-hover:ring-primary/30">
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-xs font-semibold">JA</AvatarFallback>
              </Avatar>
            </div>
            <div className="hidden text-left md:block">
              <p className="text-sm font-semibold leading-none">John Admin</p>
              <p className="text-xs text-muted-foreground mt-0.5">Administrator</p>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-muted-foreground md:block transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl glass-card">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
