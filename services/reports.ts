import { useQuery } from "@tanstack/react-query";
import type { DashboardStats, ReportSummary, ChartData } from "@/types";
import api from "@/lib/axios";

const REPORTS_KEY = ["reports"];

const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get("/v1/reports/dashboard-stats");
  return response.data;
};

const getSalesTrend = async (): Promise<ChartData[]> => {
  const response = await api.get("/v1/reports/sales-trend");
  return response.data;
};

const getRevenueTrend = async (): Promise<ChartData[]> => {
  const response = await api.get("/v1/reports/revenue-trend");
  return response.data;
};

const getMonthlyIncome = async (): Promise<ChartData[]> => {
  const response = await api.get("/v1/reports/monthly-income");
  return response.data;
};

const getTopSellingProducts = async (): Promise<ChartData[]> => {
  const response = await api.get("/v1/reports/top-products");
  return response.data;
};

const getBestCategories = async (): Promise<ChartData[]> => {
  const response = await api.get("/v1/reports/best-categories");
  return response.data;
};

const getReportSummary = async (): Promise<ReportSummary> => {
  const response = await api.get("/v1/reports/summary");
  return response.data;
};

const getMonthlyRevenue = async (): Promise<ChartData[]> => {
  const response = await api.get("/v1/reports/monthly-revenue");
  return response.data;
};

const getPaymentMethodDistribution = async (): Promise<ChartData[]> => {
  const response = await api.get("/v1/reports/payment-methods");
  return response.data;
};

export const useGetDashboardStats = () =>
  useQuery({
    queryKey: [...REPORTS_KEY, "dashboard-stats"],
    queryFn: () => getDashboardStats(),
  });

export const useGetSalesTrend = () =>
  useQuery({
    queryKey: [...REPORTS_KEY, "sales-trend"],
    queryFn: () => getSalesTrend(),
  });

export const useGetRevenueTrend = () =>
  useQuery({
    queryKey: [...REPORTS_KEY, "revenue-trend"],
    queryFn: () => getRevenueTrend(),
  });

export const useGetMonthlyIncome = () =>
  useQuery({
    queryKey: [...REPORTS_KEY, "monthly-income"],
    queryFn: () => getMonthlyIncome(),
  });

export const useGetTopSellingProducts = () =>
  useQuery({
    queryKey: [...REPORTS_KEY, "top-products"],
    queryFn: () => getTopSellingProducts(),
  });

export const useGetBestCategories = () =>
  useQuery({
    queryKey: [...REPORTS_KEY, "best-categories"],
    queryFn: () => getBestCategories(),
  });

export const useGetReportSummary = () =>
  useQuery({
    queryKey: [...REPORTS_KEY, "summary"],
    queryFn: () => getReportSummary(),
  });

export const useGetMonthlyRevenue = () =>
  useQuery({
    queryKey: [...REPORTS_KEY, "monthly-revenue"],
    queryFn: () => getMonthlyRevenue(),
  });

export const useGetPaymentMethodDistribution = () =>
  useQuery({
    queryKey: [...REPORTS_KEY, "payment-methods"],
    queryFn: () => getPaymentMethodDistribution(),
  });

export {
  getDashboardStats,
  getSalesTrend,
  getRevenueTrend,
  getMonthlyIncome,
  getTopSellingProducts,
  getBestCategories,
  getReportSummary,
  getMonthlyRevenue,
  getPaymentMethodDistribution,
};
