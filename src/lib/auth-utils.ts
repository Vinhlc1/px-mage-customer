import { z } from "zod";

export const TOKEN_COOKIE = "pm_token";
export const ACCESS_TOKEN_COOKIE = "pm_access"; // non-httpOnly, readable by client JS
export const USER_COOKIE = "pm_user";
export const TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24; // 24h fallback

const authUserSchema = z.object({
  customerId: z.number(),
  email: z.string().email(),
  name: z.string(),
  phoneNumber: z.string().nullable(),
});

export type AuthUser = z.infer<typeof authUserSchema>;

export function parseUserCookieValue(value?: string): AuthUser | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(value));
    const result = authUserSchema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export function serializeUserCookieValue(user: AuthUser): string {
  return encodeURIComponent(JSON.stringify(user));
}

/** Decode the JWT payload without verifying the signature. */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    // Works in both Node (via atob global in Next.js) and the browser
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function decodeTokenExp(token?: string): number | null {
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  return typeof payload?.exp === "number" ? payload.exp : null;
}

export function getTokenMaxAgeSeconds(token?: string): number {
  const exp = decodeTokenExp(token);
  if (!exp) return TOKEN_MAX_AGE_SECONDS;
  const now = Math.floor(Date.now() / 1000);
  return Math.max(exp - now, 0);
}

export function isTokenExpired(token?: string): boolean {
  if (!token) return true;
  const exp = decodeTokenExp(token);
  if (!exp) return false; // no exp claim → treat as valid
  const now = Math.floor(Date.now() / 1000);
  return exp <= now;
}
