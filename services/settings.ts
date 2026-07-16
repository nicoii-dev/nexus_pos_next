import type { Settings } from "@/types";

const PLACEHOLDER_SETTINGS: Settings = {
  businessName: "Nexus POS Store",
  currency: "PHP",
  timezone: "Asia/Manila",
  taxRate: 12,
  receiptHeader: "Thank you for shopping!",
  receiptFooter: "Please come again.",
};

export async function getSettings(): Promise<Settings> {
  return PLACEHOLDER_SETTINGS;
}

export async function updateSettings(data: Partial<Settings>): Promise<Settings> {
  return { ...PLACEHOLDER_SETTINGS, ...data };
}
