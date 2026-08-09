import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Customer, CreateCustomerPayload } from "@/types";
import api from "@/lib/axios";

const CUSTOMERS_KEY = ["customers"];

const getCustomers = async (): Promise<Customer[]> => {
  const response = await api.get("/v1/customers");
  return response.data;
};

const createCustomer = async (data: CreateCustomerPayload): Promise<Customer> => {
  const response = await api.post("/v1/customers", data);
  return response.data;
};

export const useGetCustomers = () =>
  useQuery({
    queryKey: CUSTOMERS_KEY,
    queryFn: () => getCustomers(),
  });

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCustomer,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CUSTOMERS_KEY }),
  });
};

export { getCustomers, createCustomer };
