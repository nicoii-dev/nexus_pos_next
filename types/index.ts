export type UserRole = "admin" | "manager" | "cashier";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  branchId: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  manager: string;
  contactNumber: string;
  status: "active" | "inactive";
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  description: string;
  categoryId: string;
  buyingPrice: number;
  sellingPrice: number;
  currentStock: number;
  minimumStock: number;
  unit: string;
  status: "in_stock" | "low_stock" | "out_of_stock";
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Inventory {
  id: string;
  productId: string;
  productName: string;
  type: "stock_in" | "stock_out" | "adjustment";
  quantity: number;
  date: string;
  notes: string;
  performedBy: string;
}

export interface Sale {
  id: string;
  transactionNumber: string;
  cashier: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  total: number;
  totalCost: number;
  paymentMethod: "cash" | "card" | "digital";
  status: "completed" | "pending" | "refunded";
  date: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface CreateSalePayload {
  items: SaleItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: "cash" | "card" | "digital";
}

export interface DashboardStats {
  todaysSales: number;
  todaysRevenue: number;
  todaysProfit: number;
  todaysTransactions: number;
  weeklySales: number;
  monthlySales: number;
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
}

export interface ReportSummary {
  totalSales: number;
  revenue: number;
  income: number;
  profit: number;
  transactions: number;
  averageOrderValue: number;
}

export interface ChartData {
  name: string;
  value: number;
  value2?: number;
}

export interface Settings {
  businessName: string;
  logo?: string;
  currency: string;
  timezone: string;
  taxRate: number;
  receiptHeader: string;
  receiptFooter: string;
}

export type DateRange = "today" | "yesterday" | "week" | "month" | "quarter" | "year" | "custom";

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: Record<string, string>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
