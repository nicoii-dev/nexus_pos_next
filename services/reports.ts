import type { DashboardStats, ReportSummary, ChartData } from "@/types";

export async function getDashboardStats(): Promise<DashboardStats> {
  return {
    todaysSales: 3,
    todaysRevenue: 118549,
    todaysProfit: 24500,
    todaysTransactions: 3,
    weeklySales: 18,
    monthlySales: 72,
    totalProducts: 15,
    lowStockProducts: 3,
    outOfStockProducts: 2,
  };
}

export async function getSalesTrend(): Promise<ChartData[]> {
  return [
    { name: "Mon", value: 45000 },
    { name: "Tue", value: 52000 },
    { name: "Wed", value: 38000 },
    { name: "Thu", value: 65000 },
    { name: "Fri", value: 72000 },
    { name: "Sat", value: 95000 },
    { name: "Sun", value: 85000 },
  ];
}

export async function getRevenueTrend(): Promise<ChartData[]> {
  return [
    { name: "Mon", value: 38000, value2: 35000 },
    { name: "Tue", value: 45000, value2: 42000 },
    { name: "Wed", value: 32000, value2: 30000 },
    { name: "Thu", value: 55000, value2: 48000 },
    { name: "Fri", value: 62000, value2: 58000 },
    { name: "Sat", value: 82000, value2: 75000 },
    { name: "Sun", value: 74000, value2: 68000 },
  ];
}

export async function getMonthlyIncome(): Promise<ChartData[]> {
  return [
    { name: "Jan", value: 120000 },
    { name: "Feb", value: 135000 },
    { name: "Mar", value: 115000 },
    { name: "Apr", value: 142000 },
    { name: "May", value: 158000 },
    { name: "Jun", value: 165000 },
    { name: "Jul", value: 118000 },
  ];
}

export async function getTopSellingProducts(): Promise<ChartData[]> {
  return [
    { name: "iPhone 15 Pro", value: 8 },
    { name: "Samsung Galaxy S24", value: 5 },
    { name: "Rice (Jasmine)", value: 12 },
    { name: "MacBook Air M3", value: 3 },
    { name: "Pantene Shampoo", value: 15 },
  ];
}

export async function getBestCategories(): Promise<ChartData[]> {
  return [
    { name: "Electronics", value: 185000 },
    { name: "Groceries", value: 45000 },
    { name: "Beverages", value: 22000 },
    { name: "Personal Care", value: 18000 },
    { name: "Household", value: 12000 },
  ];
}

export async function getReportSummary(): Promise<ReportSummary> {
  return {
    totalSales: 320,
    revenue: 2450000,
    income: 520000,
    profit: 380000,
    transactions: 320,
    averageOrderValue: 7656,
  };
}

export async function getMonthlyRevenue(): Promise<ChartData[]> {
  return [
    { name: "Jan", value: 320000, value2: 280000 },
    { name: "Feb", value: 380000, value2: 340000 },
    { name: "Mar", value: 290000, value2: 260000 },
    { name: "Apr", value: 410000, value2: 370000 },
    { name: "May", value: 450000, value2: 420000 },
    { name: "Jun", value: 520000, value2: 480000 },
    { name: "Jul", value: 480000, value2: 450000 },
  ];
}

export async function getPaymentMethodDistribution(): Promise<ChartData[]> {
  return [
    { name: "Cash", value: 42 },
    { name: "Card", value: 35 },
    { name: "Digital", value: 23 },
  ];
}
