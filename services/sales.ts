import { useQuery } from "@tanstack/react-query";
import type { Sale } from "@/types";
import api from "@/lib/axios";

const SALES_KEY = ["sales"];

const getSales = async (): Promise<Sale[]> => {
  const response = await api.get("/v1/sales");
  return response.data;
};

const getSaleById = async (id: string): Promise<Sale> => {
  const response = await api.get(`/v1/sales/${id}`);
  return response.data;
};

export const useGetSales = () =>
  useQuery({
    queryKey: SALES_KEY,
    queryFn: () => getSales(),
  });

export const useGetSaleById = (id: string) =>
  useQuery({
    queryKey: [...SALES_KEY, id],
    queryFn: () => getSaleById(id),
    enabled: !!id,
  });

export { getSales, getSaleById };
