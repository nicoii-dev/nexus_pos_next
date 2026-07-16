import { format, parseISO } from "date-fns";

export function formatCurrency(amount: number, currency = "PHP"): string {
  const symbols: Record<string, string> = {
    PHP: "₱",
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
  };
  const symbol = symbols[currency] || "₱";
  return `${symbol}${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDate(dateString: string, fmt = "MMM dd, yyyy"): string {
  try {
    return format(parseISO(dateString), fmt);
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  return formatDate(dateString, "MMM dd, yyyy HH:mm");
}

export function formatNumber(num: number): string {
  return num.toLocaleString("en-US");
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}
