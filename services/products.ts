import type { Product } from "@/types";

const PLACEHOLDER_PRODUCTS: Product[] = [
  { id: "1", name: "iPhone 15 Pro", sku: "IPH-15P-001", barcode: "1234567890", description: "Apple iPhone 15 Pro 256GB", categoryId: "1", buyingPrice: 55000, sellingPrice: 62990, currentStock: 25, minimumStock: 5, unit: "pcs", status: "in_stock", image: "" },
  { id: "2", name: "Samsung Galaxy S24", sku: "SAM-S24-001", barcode: "1234567891", description: "Samsung Galaxy S24 Ultra", categoryId: "1", buyingPrice: 48000, sellingPrice: 54990, currentStock: 18, minimumStock: 5, unit: "pcs", status: "in_stock", image: "" },
  { id: "3", name: "Rice (Jasmine)", sku: "RCE-JMS-001", barcode: "1234567892", description: "Premium Jasmine Rice 5kg", categoryId: "2", buyingPrice: 220, sellingPrice: 285, currentStock: 150, minimumStock: 20, unit: "kg", status: "in_stock", image: "" },
  { id: "4", name: "Coca-Cola 1.5L", sku: "CC-15L-001", barcode: "1234567893", description: "Coca-Cola 1.5L Bottle", categoryId: "3", buyingPrice: 38, sellingPrice: 55, currentStock: 8, minimumStock: 20, unit: "pcs", status: "low_stock", image: "" },
  { id: "5", name: "Lays Classic", sku: "LYS-CLS-001", barcode: "1234567894", description: "Lays Classic Salted Chips", categoryId: "4", buyingPrice: 32, sellingPrice: 45, currentStock: 0, minimumStock: 10, unit: "pcs", status: "out_of_stock", image: "" },
  { id: "6", name: "Pantene Shampoo", sku: "PNT-SHM-001", barcode: "1234567895", description: "Pantene Total Damage Care 400ml", categoryId: "5", buyingPrice: 145, sellingPrice: 189, currentStock: 42, minimumStock: 10, unit: "pcs", status: "in_stock", image: "" },
  { id: "7", name: "Pledge Multi-Surface", sku: "PLD-MS-001", barcode: "1234567896", description: "Pledge Multi-Surface Cleaner 500ml", categoryId: "6", buyingPrice: 120, sellingPrice: 165, currentStock: 3, minimumStock: 8, unit: "pcs", status: "low_stock", image: "" },
  { id: "8", name: "Pilot Pen Set", sku: "PLT-PEN-001", barcode: "1234567897", description: "Pilot G-2 Gel Pen Set of 3", categoryId: "7", buyingPrice: 85, sellingPrice: 120, currentStock: 65, minimumStock: 15, unit: "pack", status: "in_stock", image: "" },
  { id: "9", name: "Hotdog Buns", sku: "HDG-BNS-001", barcode: "1234567898", description: "Gardenia Hotdog Buns 6pcs", categoryId: "8", buyingPrice: 35, sellingPrice: 52, currentStock: 12, minimumStock: 15, unit: "pack", status: "low_stock", image: "" },
  { id: "10", name: "MacBook Air M3", sku: "MBA-M3-001", barcode: "1234567899", description: "Apple MacBook Air M3 13-inch 256GB", categoryId: "1", buyingPrice: 62000, sellingPrice: 69990, currentStock: 10, minimumStock: 3, unit: "pcs", status: "in_stock", image: "" },
  { id: "11", name: "Oishi Prawn Crackers", sku: "OIS-PRC-001", barcode: "1234567900", description: "Oishi Prawn Crackers 100g", categoryId: "4", buyingPrice: 18, sellingPrice: 28, currentStock: 200, minimumStock: 30, unit: "pcs", status: "in_stock", image: "" },
  { id: "12", name: "Bear Brand Milk", sku: "BBR-MLK-001", barcode: "1234567901", description: "Bear Brand Powdered Milk 900g", categoryId: "2", buyingPrice: 185, sellingPrice: 235, currentStock: 35, minimumStock: 10, unit: "pcs", status: "in_stock", image: "" },
  { id: "13", name: "Joy Dishwashing Liquid", sku: "JOY-DWL-001", barcode: "1234567902", description: "Joy antibacterial 500ml", categoryId: "6", buyingPrice: 42, sellingPrice: 58, currentStock: 0, minimumStock: 12, unit: "pcs", status: "out_of_stock", image: "" },
  { id: "14", name: "Nestle Coffee Mate", sku: "NCF-CM-001", barcode: "1234567903", description: "Nestle Coffee Mate 200g", categoryId: "3", buyingPrice: 88, sellingPrice: 115, currentStock: 50, minimumStock: 10, unit: "pcs", status: "in_stock", image: "" },
  { id: "15", name: "Tissue Paper 3-ply", sku: "TSP-3PL-001", barcode: "1234567904", description: "Solo 3-ply Tissue Box 150 sheets", categoryId: "6", buyingPrice: 65, sellingPrice: 89, currentStock: 75, minimumStock: 20, unit: "box", status: "in_stock", image: "" },
];

export async function getProducts(): Promise<Product[]> {
  return PLACEHOLDER_PRODUCTS;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  return PLACEHOLDER_PRODUCTS.find((p) => p.id === id);
}

export async function createProduct(data: Omit<Product, "id" | "status">): Promise<Product> {
  const stock = data.currentStock;
  const status = stock === 0 ? "out_of_stock" : stock <= data.minimumStock ? "low_stock" : "in_stock";
  return { ...data, id: String(Date.now()), status };
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product> {
  const existing = PLACEHOLDER_PRODUCTS.find((p) => p.id === id);
  if (!existing) throw new Error("Product not found");
  return { ...existing, ...data };
}

export async function deleteProduct(id: string): Promise<void> {
  void id;
}
