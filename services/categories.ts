import { useQuery } from "@tanstack/react-query";
import type { Category } from "@/types";
import api from "@/lib/axios";

const CATEGORIES_KEY = ["categories"];

const getCategories = async (): Promise<Category[]> => {
  const response = await api.get("/v1/categories");
  return response.data.data;
};

export const useGetCategories = () =>
  useQuery({
    queryKey: CATEGORIES_KEY,
    queryFn: () => getCategories(),
  });

export { getCategories };
