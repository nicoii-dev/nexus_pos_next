import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Sale, CreateSalePayload } from "@/types";
import api from "@/lib/axios";

const SALES_KEY = ["sales"];

export interface PaymentSummary {
  cash: number;
  card: number;
  digital: number;
  credit: number;
}

export interface SalesResponse {
  sales: Sale[];
  paymentSummary: PaymentSummary;
}

const EMPTY_PAYMENT_SUMMARY: PaymentSummary = { cash: 0, card: 0, digital: 0, credit: 0 };

const getSalesResponse = async (): Promise<SalesResponse> => {
  const response = await api.get("/v1/sales");
  const data = response.data;

  if (Array.isArray(data)) {
    return { sales: data, paymentSummary: EMPTY_PAYMENT_SUMMARY };
  }

  return {
    sales: Array.isArray(data?.sales) ? data.sales : [],
    paymentSummary: data?.paymentSummary ?? EMPTY_PAYMENT_SUMMARY,
  };
};

const getSales = async (): Promise<Sale[]> =>
  (await getSalesResponse()).sales;

const getSaleById = async (id: string): Promise<Sale> => {
  const response = await api.get(`/v1/sales/${id}`);
  return response.data;
};

const createSale = async (data: CreateSalePayload): Promise<Sale> => {
  const response = await api.post("/v1/sales/checkout", data);
  return response.data;
};

export const useGetSales = () =>
  useQuery({
    queryKey: SALES_KEY,
    queryFn: getSalesResponse,
    select: (data) => data.sales,
  });

export const useGetSalesSummary = () =>
  useQuery({
    queryKey: SALES_KEY,
    queryFn: getSalesResponse,
    select: (data) => data.paymentSummary,
  });

export const useGetSaleById = (id: string) =>
  useQuery({
    queryKey: [...SALES_KEY, id],
    queryFn: () => getSaleById(id),
    enabled: !!id,
  });

export const useCreateSale = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SALES_KEY });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export { getSales, getSalesResponse, getSaleById, createSale };
