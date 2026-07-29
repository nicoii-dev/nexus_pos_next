import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Branch } from "@/types";
import api from "@/lib/axios";

const BRANCHES_KEY = ["branches"];

const getBranches = async (): Promise<Branch[]> => {
  const response = await api.get("/v1/branches");
  return response.data;
};

const getBranchById = async (id: string): Promise<Branch> => {
  const response = await api.get(`/v1/branches/${id}`);
  return response.data;
};

const createBranch = async (data: Omit<Branch, "id">): Promise<Branch> => {
  const response = await api.post("/v1/branches", data);
  return response.data;
};

const updateBranch = async ({ id, data }: { id: string; data: Partial<Branch> }): Promise<Branch> => {
  const response = await api.patch(`/v1/branches/${id}`, data);
  return response.data;
};

const deleteBranch = async (id: string): Promise<void> => {
  await api.delete(`/v1/branches/${id}`);
};

export const useGetBranches = () =>
  useQuery({
    queryKey: BRANCHES_KEY,
    queryFn: () => getBranches(),
  });

export const useGetBranchById = (id: string) =>
  useQuery({
    queryKey: [...BRANCHES_KEY, id],
    queryFn: () => getBranchById(id),
    enabled: !!id,
  });

export const useCreateBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBranch,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BRANCHES_KEY }),
  });
};

export const useUpdateBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBranch,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BRANCHES_KEY }),
  });
};

export const useDeleteBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBranch,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BRANCHES_KEY }),
  });
};

export { getBranches, getBranchById, createBranch, updateBranch, deleteBranch };
