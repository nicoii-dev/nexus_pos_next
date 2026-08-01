import { useMutation } from "@tanstack/react-query";
import type { User } from "@/types";
import api, { supabase } from "@/lib/axios";

const login = async (
  email: string,
  password: string
): Promise<{ user: { id: string; email?: string }; session: unknown }> => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return { user: data.user, session: data.session };
};

const logout = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

const getMe = async (): Promise<User> => {
  const response = await api.get("/v1/auth/me");
  return response.data;
};

export const useLogin = () =>
  useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => login(email, password),
  });

export const useLogout = () =>
  useMutation({
    mutationFn: () => logout(),
  });

export { login, logout, getMe };
