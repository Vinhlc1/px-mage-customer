import { apiGet, apiPut } from "../api-client";
import type { BeAccount } from "./auth";

export async function getAccount(): Promise<BeAccount> {
  return apiGet<BeAccount>(`/api/profile`);
}

export async function updateAccount(
  data: Partial<{ name: string; phoneNumber: string; email: string; password: string }>
): Promise<BeAccount> {
  return apiPut<BeAccount>(`/api/profile`, data);
}
