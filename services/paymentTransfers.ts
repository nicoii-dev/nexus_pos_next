import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { PaymentTransfer, CreatePaymentTransferPayload } from "@/types";
import api from "@/lib/axios";

const TRANSFERS_KEY = ["payment-transfers"];

const getPaymentTransfers = async (): Promise<PaymentTransfer[]> => {
  const response = await api.get("/v1/payment-transfers");
  return response.data;
};

const transferPayment = async (
  data: CreatePaymentTransferPayload
): Promise<PaymentTransfer> => {
  const response = await api.post("/v1/payment-transfers/transfer", data);
  return response.data;
};

export const useGetPaymentTransfers = () =>
  useQuery({
    queryKey: TRANSFERS_KEY,
    queryFn: () => getPaymentTransfers(),
  });

export const useTransferPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: transferPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSFERS_KEY });
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });
};

export { getPaymentTransfers, transferPayment };
