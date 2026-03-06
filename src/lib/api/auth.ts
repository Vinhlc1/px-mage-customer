import { apiFetch, apiPost, setStoredToken } from "../api-client";

export interface BeAccount {
  accountId: number;
  email: string;
  name: string;
  phoneNumber: string | null;
  authProvider: "LOCAL" | "GOOGLE";
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  token: string;
  account: BeAccount;
}

export async function loginApi(
  email: string,
  password: string
): Promise<LoginResponse> {
  const res = await apiPost<LoginResponse>("/auth/login", {
    email,
    password,
  });
  if (res.token) {
    setStoredToken(res.token);
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_account", JSON.stringify(res.account));
    }
  }
  return res;
}

export async function registerApi(
  email: string,
  password: string,
  name: string,
  phoneNumber?: string
): Promise<BeAccount> {
  return apiPost<BeAccount>("/auth/register", {
    email,
    password,
    name,
    phoneNumber: phoneNumber ?? null,
    roleId: 4,
  });
}

export async function logoutApi(): Promise<void> {
  try {
    await apiFetch("/auth/logout", { method: "POST" });
  } catch {
    // Best-effort logout; clear local state regardless
  }
}

export function getStoredAccount(): BeAccount | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("auth_account");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as BeAccount;
  } catch {
    return null;
  }
}
