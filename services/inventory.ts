import type { InventoryMovement } from "@/types";

const PLACEHOLDER_MOVEMENTS: InventoryMovement[] = [
  { id: "1", productId: "1", productName: "iPhone 15 Pro", type: "stock_in", quantity: 10, date: "2026-07-10T09:00:00", notes: "Supplier delivery", performedBy: "John Manager" },
  { id: "2", productId: "4", productName: "Coca-Cola 1.5L", type: "stock_out", quantity: 5, date: "2026-07-10T10:30:00", notes: "Sale transaction", performedBy: "Jane Cashier" },
  { id: "3", productId: "3", productName: "Rice (Jasmine)", type: "stock_in", quantity: 50, date: "2026-07-09T14:00:00", notes: "Restocking", performedBy: "John Manager" },
  { id: "4", productId: "7", productName: "Pledge Multi-Surface", type: "adjustment", quantity: -2, date: "2026-07-09T11:00:00", notes: "Damaged items removed", performedBy: "John Manager" },
  { id: "5", productId: "6", productName: "Pantene Shampoo", type: "stock_in", quantity: 30, date: "2026-07-08T08:00:00", notes: "Supplier delivery", performedBy: "John Manager" },
  { id: "6", productId: "10", productName: "MacBook Air M3", type: "stock_out", quantity: 2, date: "2026-07-08T15:00:00", notes: "Sale transaction", performedBy: "Jane Cashier" },
  { id: "7", productId: "9", productName: "Hotdog Buns", type: "stock_out", quantity: 10, date: "2026-07-07T16:00:00", notes: "Expired items disposed", performedBy: "John Manager" },
  { id: "8", productId: "14", productName: "Nestle Coffee Mate", type: "stock_in", quantity: 25, date: "2026-07-07T09:00:00", notes: "Supplier delivery", performedBy: "John Manager" },
];

export async function getInventoryMovements(): Promise<InventoryMovement[]> {
  return PLACEHOLDER_MOVEMENTS;
}

export async function createInventoryMovement(data: Omit<InventoryMovement, "id">): Promise<InventoryMovement> {
  return { ...data, id: String(Date.now()) };
}
