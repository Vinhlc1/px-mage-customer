import { cookies } from "next/headers";
import {
  isTokenExpired,
  parseUserCookieValue,
  TOKEN_COOKIE,
  USER_COOKIE,
} from "./auth-utils";

/**
 * Server-side auth helper — reads httpOnly cookies set by the /api/auth/login route.
 * Call this from async Server Components (e.g. layout.tsx) to get the current user.
 */
export async function getServerAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;
  const user = parseUserCookieValue(cookieStore.get(USER_COOKIE)?.value);
  const isAuthenticated = Boolean(token) && !isTokenExpired(token);

  return { token: token ?? null, user, isAuthenticated };
}
