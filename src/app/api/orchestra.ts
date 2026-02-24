/**
 * app/api/orchestra.ts
 *
 * Central server-side API layer — base fetch wrapper, cookie helpers, and
 * response utilities. Every API route imports from here instead of duplicating boilerplate.
 */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { TOKEN_COOKIE } from "@/lib/auth-utils";

// ── Config ────────────────────────────────────────────────────────────────────

export const API_BASE_URL =
  process.env.API_BASE_URL ?? "http://localhost:8386/api";

/** Base cookie attributes for every auth cookie. */
const COOKIE_BASE = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

/** Returns a full cookie options object with the given maxAge. */
export function cookieOptions(maxAge: number) {
  return { ...COOKIE_BASE, maxAge };
}

// ── Fetch wrapper ─────────────────────────────────────────────────────────────

export type ApiFetchResult<T> = {
  ok: boolean;
  status: number;
  data: T | null;
  error: string | null;
};

/**
 * Thin fetch wrapper for server-side BE calls.
 * - Prepends API_BASE_URL automatically.
 * - Defaults to cache: "no-store" and Content-Type: application/json.
 * - Normalises the BE's ResponseBase wrapper {status, message, data}.
 * - Never throws — network errors are returned as { ok: false }.
 */
export async function apiFetch<T = unknown>(
  path: string,
  options?: RequestInit
): Promise<ApiFetchResult<T>> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      cache: "no-store",
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers ?? {}),
      },
    });

    const payload = await res.json().catch(() => null);
    // BE wraps responses in { status, message, data } — unwrap
    const raw: T = payload?.data ?? payload?.result ?? payload;

    if (!res.ok) {
      const error = payload?.message ?? payload?.error ?? "Request failed.";
      return { ok: false, status: res.status, data: null, error };
    }

    return { ok: true, status: res.status, data: raw, error: null };
  } catch {
    return { ok: false, status: 500, data: null, error: "Network error." };
  }
}

/**
 * Like apiFetch but reads the JWT from the httpOnly cookie and
 * forwards it as a Bearer token to the backend.
 */
export async function apiFetchAuthed<T = unknown>(
  path: string,
  options?: RequestInit
): Promise<ApiFetchResult<T>> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;
  return apiFetch<T>(path, {
    ...options,
    headers: {
      ...(options?.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

// ── Response helpers ─────────────────────────────────────────────────────────

export const Res = {
  ok: (data: unknown, status = 200) =>
    NextResponse.json(data, { status }),
  badRequest: (error: string) =>
    NextResponse.json({ error }, { status: 400 }),
  unauthorized: (error = "Unauthorized.") =>
    NextResponse.json({ error }, { status: 401 }),
  upstream: (error: string, status = 502) =>
    NextResponse.json({ error }, { status }),
};
