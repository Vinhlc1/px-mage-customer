import { apiPut } from "../api-client";
import type { BeAccount } from "./auth";

export async function updateAccount(
  id: number,
  data: Partial<{ name: string; phoneNumber: string; email: string; password: string }>
): Promise<BeAccount> {
  return apiPut<BeAccount>(`/api/accounts/${id}`, data);
}
