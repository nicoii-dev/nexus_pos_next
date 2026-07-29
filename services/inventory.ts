import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { InventoryMovement } from "@/types";
import api from "@/lib/axios";

const MOVEMENTS_KEY = ["inventory_movements"];

const getInventoryMovements = async (): Promise<InventoryMovement[]> => {
  const response = await api.get("/v1/inventory/movements");
  return response.data;
};

const createInventoryMovement = async (data: Omit<InventoryMovement, "id">): Promise<InventoryMovement> => {
  const response = await api.post("/v1/inventory/movements", data);
  return response.data;
};

export const useGetInventoryMovements = () =>
  useQuery({
    queryKey: MOVEMENTS_KEY,
    queryFn: () => getInventoryMovements(),
  });

export const useCreateInventoryMovement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createInventoryMovement,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MOVEMENTS_KEY }),
  });
};

export { getInventoryMovements, createInventoryMovement };
