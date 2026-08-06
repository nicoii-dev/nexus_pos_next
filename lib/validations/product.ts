import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  sku: z.string().min(1, "SKU is required"),
  barcode: z.string().optional().default(""),
  description: z.string().optional().default(""),
  categoryId: z.string().min(1, "Category is required"),
  buyingPrice: z.coerce.number().min(0, "Buying price must be 0 or more"),
  sellingPrice: z.coerce.number().min(0, "Selling price must be 0 or more"),
  currentStock: z.coerce.number().int().min(0, "Stock must be 0 or more"),
  minimumStock: z.coerce.number().int().min(0, "Minimum stock must be 0 or more"),
  unit: z.string().min(1, "Unit is required"),
  image: z.string().optional().default(""),
});

export type ProductFormData = z.infer<typeof productSchema>;
