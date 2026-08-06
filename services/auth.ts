import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "@/types";
import api, { supabase } from "@/lib/axios";
import { clearBrowserData } from "@/lib/browser-cache";

const login = async (
  email: string,
  password: string
): Promise<{ user: { id: string; email?: string }; session: unknown }> => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return { user: data.user, session: data.session };
};

const logout = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } finally {
    await clearBrowserData();
  }
};

const getMe = async (): Promise<User> => {
  const response = await api.get("/v1/auth/me");
  return response.data;
};

export const useLogin = () =>
  useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => login(email, password),
  });

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => queryClient.clear(),
  });
};

export const useGetCurrentUser = () =>
  useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => getMe(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

export { login, logout, getMe };
