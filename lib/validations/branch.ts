import { z } from "zod";

export const branchSchema = z.object({
  name: z.string().min(2, "Branch name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  manager: z.string().min(2, "Manager name must be at least 2 characters"),
  contactNumber: z.string().min(7, "Contact number must be at least 7 characters"),
  status: z.enum(["active", "inactive"]),
});

export type BranchFormData = z.infer<typeof branchSchema>;
