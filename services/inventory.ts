import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Inventory } from "@/types";
import api from "@/lib/axios";

const INVENTORY_KEY = ["inventory"];

const getInventory = async (): Promise<Inventory[]> => {
  const response = await api.get("/v1/inventory");
  return response.data;
};

const createInventory = async (data: Omit<Inventory, "id">): Promise<Inventory> => {
  const response = await api.post("/v1/inventory/movements", data);
  return response.data;
};

export const useGetInventory = () =>
  useQuery({
    queryKey: INVENTORY_KEY,
    queryFn: () => getInventory(),
  });

export const useCreateInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createInventory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: INVENTORY_KEY }),
  });
};

export { getInventory, createInventory };
