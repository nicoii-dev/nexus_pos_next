import {
  LayoutDashboard,
  Package,
  BoxesIcon,
  ShoppingCart,
  BarChart3,
  Building2,
  Settings,
  HandCoins,
  type LucideIcon,
} from "lucide-react";
import type { UserRole } from "@/types";

export interface MenuItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles?: UserRole[];
}

export const MENU_ITEMS: MenuItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["admin", "manager"] },
  { title: "Cashiering", href: "/cashiering", icon: HandCoins, roles: ["admin", "manager", "cashier"] },
  { title: "Products", href: "/products", icon: Package, roles: ["admin", "manager"] },
  { title: "Inventory", href: "/inventory", icon: BoxesIcon, roles: ["admin", "manager"] },
  { title: "Sales", href: "/sales", icon: ShoppingCart, roles: ["admin", "manager"] },
  { title: "Reports", href: "/reports", icon: BarChart3, roles: ["admin", "manager"] },
  { title: "Branches", href: "/branches", icon: Building2, roles: ["admin", "manager"] },
  { title: "Settings", href: "/settings", icon: Settings, roles: ["admin", "manager"] },
];

const CASHIER_DEFAULT_ROUTE = "/cashiering";
const STAFF_DEFAULT_ROUTE = "/dashboard";

export function filterMenuItems(role?: UserRole): MenuItem[] {
  if (!role) return MENU_ITEMS;
  return MENU_ITEMS.filter((item) => !item.roles || item.roles.includes(role));
}

export function canAccessRoute(role: UserRole, pathname: string): boolean {
  if (role === "cashier") return pathname === CASHIER_DEFAULT_ROUTE || pathname.startsWith(CASHIER_DEFAULT_ROUTE + "/");
  return true;
}

export function getDefaultRoute(role: UserRole): string {
  return role === "cashier" ? CASHIER_DEFAULT_ROUTE : STAFF_DEFAULT_ROUTE;
}

export const UNITS = ["pcs", "kg", "g", "ml", "L", "box", "pack", "dozen"];

export const PAYMENT_METHODS = ["cash", "card", "digital"] as const;

export const CURRENCIES = [
  { code: "PHP", symbol: "₱", name: "Philippine Peso" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
];

export const TIMEZONES = [
  "Asia/Manila",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Australia/Sydney",
];
