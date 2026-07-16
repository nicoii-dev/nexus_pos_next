import type { User } from "@/types";

export async function login(email: string, _password: string): Promise<User> {
  void _password;
  return {
    id: "1",
    name: "John Admin",
    email,
    role: "admin",
    avatar: "",
    branchId: "1",
  };
}

export async function logout(): Promise<void> {}
