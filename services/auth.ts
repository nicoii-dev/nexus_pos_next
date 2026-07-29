import { useMutation } from "@tanstack/react-query";
import type { User } from "@/types";
import api from "@/lib/axios";

const login = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  const response = await api.post("/v1/auth/login", { email, password });
  return response.data;
};

const logout = async (): Promise<void> => {
  await api.post("/v1/auth/logout");
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
