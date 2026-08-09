import { z } from "zod";

export const customerSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  phone: z.string().trim().optional(),
  address: z.string().trim().optional(),
  remarks: z.string().trim().optional(),
});

export type CustomerFormData = z.infer<typeof customerSchema>;
