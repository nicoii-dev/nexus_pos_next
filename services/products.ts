import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Product } from "@/types";
import api from "@/lib/axios";

const PRODUCTS_KEY = ["products"];

const getProducts = async (): Promise<Product[]> => {
  const response = await api.get("/v1/products");
  return response.data;
};

const getProductById = async (id: string): Promise<Product> => {
  const response = await api.get(`/v1/products/${id}`);
  return response.data;
};

const createProduct = async (data: Omit<Product, "id" | "status">): Promise<Product> => {
  const response = await api.post("/v1/products", data);
  return response.data;
};

const updateProduct = async ({ id, data }: { id: string; data: Partial<Product> }): Promise<Product> => {
  const response = await api.patch(`/v1/products/${id}`, data);
  return response.data;
};

const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/v1/products/${id}`);
};

export const useGetProducts = () =>
  useQuery({
    queryKey: PRODUCTS_KEY,
    queryFn: () => getProducts(),
  });

export const useGetProductById = (id: string) =>
  useQuery({
    queryKey: [...PRODUCTS_KEY, id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY }),
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY }),
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY }),
  });
};

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
