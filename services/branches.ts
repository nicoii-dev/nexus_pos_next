import type { Branch } from "@/types";

const PLACEHOLDER_BRANCHES: Branch[] = [
  { id: "1", name: "Main Branch - Makati", address: "123 Ayala Ave, Makati City", manager: "John Manager", contactNumber: "+63 917 123 4567", status: "active" },
  { id: "2", name: "Branch 2 - BGC", address: "456 Bonifacio Global City, Taguig", manager: "Sarah Admin", contactNumber: "+63 917 234 5678", status: "active" },
  { id: "3", name: "Branch 3 - Quezon City", address: "789 Tomas Morato Ave, QC", manager: "Mike Supervisor", contactNumber: "+63 917 345 6789", status: "active" },
  { id: "4", name: "Branch 4 - Alabang", address: "321 Alabang-Zapote Rd, Muntinlupa", manager: "Lisa Manager", contactNumber: "+63 917 456 7890", status: "inactive" },
];

export async function getBranches(): Promise<Branch[]> {
  return PLACEHOLDER_BRANCHES;
}

export async function getBranchById(id: string): Promise<Branch | undefined> {
  return PLACEHOLDER_BRANCHES.find((b) => b.id === id);
}

export async function createBranch(data: Omit<Branch, "id">): Promise<Branch> {
  return { ...data, id: String(Date.now()) };
}

export async function updateBranch(id: string, data: Partial<Branch>): Promise<Branch> {
  const existing = PLACEHOLDER_BRANCHES.find((b) => b.id === id);
  if (!existing) throw new Error("Branch not found");
  return { ...existing, ...data };
}

export async function deleteBranch(id: string): Promise<void> {
  void id;
}
