import { ACCESS_TOKEN_COOKIE } from "./auth-utils";
import { getCookie, removeCookie } from "./cookies";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8386";

export interface ApiResponse<T = unknown> {
  status: number;
  message: string;
  data: T;
}

/**
 * Reads the JWT from the non-httpOnly pm_access cookie set by /api/auth/login.
 * Returns null on the server (SSR) — server-side calls use the orchestra helpers instead.
 */
export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return getCookie(ACCESS_TOKEN_COOKIE) ?? null;
}

/** @deprecated — The login API route sets cookies automatically. No manual token storage needed. */
export function setStoredToken(_token: string): void {
  // No-op: token cookies are set server-side by /api/auth/login
}

/**
 * Clears the client-accessible access token cookie.
 * The httpOnly session cookie is cleared server-side via /api/auth/logout.
 */
export function clearStoredAuth(): void {
  removeCookie(ACCESS_TOKEN_COOKIE);
  // Legacy cleanup
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_account");
  }
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getStoredToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) ?? {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  let json: ApiResponse<T>;
  try {
    json = await res.json();
  } catch {
    throw new Error(`Request failed with status ${res.status}`);
  }

  if (!res.ok) {
    throw new Error(json.message ?? `Request failed: ${res.status}`);
  }

  return json;
}

export async function apiGet<T = unknown>(path: string): Promise<T> {
  const res = await apiFetch<T>(path);
  return res.data;
}

export async function apiPost<T = unknown>(
  path: string,
  body: unknown
): Promise<T> {
  const res = await apiFetch<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return res.data;
}

export async function apiPut<T = unknown>(
  path: string,
  body: unknown
): Promise<T> {
  const res = await apiFetch<T>(path, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  return res.data;
}

export async function apiDelete<T = unknown>(path: string): Promise<T> {
  const res = await apiFetch<T>(path, { method: "DELETE" });
  return res.data;
}
