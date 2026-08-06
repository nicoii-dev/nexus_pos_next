import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Sale, CreateSalePayload } from "@/types";
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

const createSale = async (data: CreateSalePayload): Promise<Sale> => {
  const response = await api.post("/v1/sales/checkout", data);
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

export { getSales, getSaleById, createSale };
