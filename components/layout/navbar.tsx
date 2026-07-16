"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Bell, Search, ChevronDown, Menu } from "lucide-react";
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
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card px-4 lg:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex items-center gap-2">
        <Select value={selectedBranch} onValueChange={(v) => v !== null && setSelectedBranch(v)}>
          <SelectTrigger className="w-[200px] h-9">
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

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
            3
          </span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {mounted ? (
            theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />
          ) : (
            <div className="h-5 w-5" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-2 py-1.5 outline-none hover:bg-accent">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">JA</AvatarFallback>
            </Avatar>
            <div className="hidden text-left md:block">
              <p className="text-sm font-medium">John Admin</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-muted-foreground md:block" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
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
