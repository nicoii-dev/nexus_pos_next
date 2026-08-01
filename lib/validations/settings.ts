import { z } from "zod";

export const settingsSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  currency: z.string().min(1, "Currency is required"),
  timezone: z.string().min(1, "Timezone is required"),
  taxRate: z.coerce.number().min(0, "Tax rate must be 0 or more").max(100, "Tax rate must be 100 or less"),
  receiptHeader: z.string().optional().default(""),
  receiptFooter: z.string().optional().default(""),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;
