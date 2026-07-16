import type { Sale } from "@/types";

const PLACEHOLDER_SALES: Sale[] = [
  { id: "1", transactionNumber: "TXN-20260710-001", cashier: "Jane Cashier", items: [{ productId: "1", productName: "iPhone 15 Pro", quantity: 1, price: 62990, total: 62990 }, { productId: "4", productName: "Coca-Cola 1.5L", quantity: 2, price: 55, total: 110 }], subtotal: 63100, discount: 0, total: 63100, paymentMethod: "card", status: "completed", date: "2026-07-10T10:30:00" },
  { id: "2", transactionNumber: "TXN-20260710-002", cashier: "Jane Cashier", items: [{ productId: "3", productName: "Rice (Jasmine)", quantity: 5, price: 285, total: 1425 }, { productId: "11", productName: "Oishi Prawn Crackers", quantity: 3, price: 28, total: 84 }], subtotal: 1509, discount: 50, total: 1459, paymentMethod: "cash", status: "completed", date: "2026-07-10T11:15:00" },
  { id: "3", transactionNumber: "TXN-20260710-003", cashier: "Mark Cashier", items: [{ productId: "2", productName: "Samsung Galaxy S24", quantity: 1, price: 54990, total: 54990 }], subtotal: 54990, discount: 0, total: 54990, paymentMethod: "digital", status: "completed", date: "2026-07-10T13:00:00" },
  { id: "4", transactionNumber: "TXN-20260709-001", cashier: "Jane Cashier", items: [{ productId: "6", productName: "Pantene Shampoo", quantity: 2, price: 189, total: 378 }, { productId: "15", productName: "Tissue Paper 3-ply", quantity: 3, price: 89, total: 267 }], subtotal: 645, discount: 0, total: 645, paymentMethod: "cash", status: "completed", date: "2026-07-09T14:30:00" },
  { id: "5", transactionNumber: "TXN-20260709-002", cashier: "Mark Cashier", items: [{ productId: "10", productName: "MacBook Air M3", quantity: 1, price: 69990, total: 69990 }], subtotal: 69990, discount: 2000, total: 67990, paymentMethod: "card", status: "completed", date: "2026-07-09T15:45:00" },
  { id: "6", transactionNumber: "TXN-20260708-001", cashier: "Jane Cashier", items: [{ productId: "8", productName: "Pilot Pen Set", quantity: 5, price: 120, total: 600 }, { productId: "12", productName: "Bear Brand Milk", quantity: 2, price: 235, total: 470 }], subtotal: 1070, discount: 70, total: 1000, paymentMethod: "cash", status: "completed", date: "2026-07-08T09:20:00" },
  { id: "7", transactionNumber: "TXN-20260708-002", cashier: "Mark Cashier", items: [{ productId: "14", productName: "Nestle Coffee Mate", quantity: 1, price: 115, total: 115 }], subtotal: 115, discount: 0, total: 115, paymentMethod: "digital", status: "refunded", date: "2026-07-08T10:00:00" },
  { id: "8", transactionNumber: "TXN-20260707-001", cashier: "Jane Cashier", items: [{ productId: "1", productName: "iPhone 15 Pro", quantity: 1, price: 62990, total: 62990 }, { productId: "15", productName: "Tissue Paper 3-ply", quantity: 2, price: 89, total: 178 }], subtotal: 63168, discount: 0, total: 63168, paymentMethod: "card", status: "completed", date: "2026-07-07T16:00:00" },
];

export async function getSales(): Promise<Sale[]> {
  return PLACEHOLDER_SALES;
}

export async function getSaleById(id: string): Promise<Sale | undefined> {
  return PLACEHOLDER_SALES.find((s) => s.id === id);
}
