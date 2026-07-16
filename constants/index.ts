import {
  LayoutDashboard,
  Package,
  BoxesIcon,
  ShoppingCart,
  BarChart3,
  Building2,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface MenuItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const MENU_ITEMS: MenuItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Products", href: "/products", icon: Package },
  { title: "Inventory", href: "/inventory", icon: BoxesIcon },
  { title: "Sales", href: "/sales", icon: ShoppingCart },
  { title: "Reports", href: "/reports", icon: BarChart3 },
  { title: "Branches", href: "/branches", icon: Building2 },
  { title: "Settings", href: "/settings", icon: Settings },
];

export const CATEGORIES = [
  { id: "1", name: "Electronics" },
  { id: "2", name: "Groceries" },
  { id: "3", name: "Beverages" },
  { id: "4", name: "Snacks" },
  { id: "5", name: "Personal Care" },
  { id: "6", name: "Household" },
  { id: "7", name: "Stationery" },
  { id: "8", name: "Frozen Foods" },
];

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
