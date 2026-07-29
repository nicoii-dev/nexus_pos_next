import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Settings } from "@/types";
import api from "@/lib/axios";

const SETTINGS_KEY = ["settings"];

const getSettings = async (): Promise<Settings> => {
  const response = await api.get("/v1/settings");
  return response.data;
};

const updateSettings = async (data: Partial<Settings>): Promise<Settings> => {
  const response = await api.patch("/v1/settings", data);
  return response.data;
};

export const useGetSettings = () =>
  useQuery({
    queryKey: SETTINGS_KEY,
    queryFn: () => getSettings(),
  });

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSettings,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SETTINGS_KEY }),
  });
};

export { getSettings, updateSettings };
