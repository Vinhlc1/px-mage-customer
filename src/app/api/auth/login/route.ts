import { apiFetch, cookieOptions, Res } from "@/app/api/orchestra";
import {
    ACCESS_TOKEN_COOKIE,
    getTokenMaxAgeSeconds,
    serializeUserCookieValue,
    TOKEN_COOKIE,
    USER_COOKIE,
} from "@/lib/auth-utils";
import { cookies } from "next/headers";
import { z } from "zod";

const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const loginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string().nullish(),
  expiresIn: z.number().nullish(),
  accountId: z.number(),
  email: z.string().email(),
  name: z.string().nullish(),
  role: z.string().nullish(),
  avatarUrl: z.string().nullish(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginRequestSchema.safeParse(body);
  if (!parsed.success) return Res.badRequest("Invalid credentials.");

  const { ok, status, data, error } = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(parsed.data),
  });

  if (!ok) return Res.upstream(error ?? "Login failed.", status);

  const parsedData = loginResponseSchema.safeParse(data);
  if (!parsedData.success) {
    console.error("Login parse failed", parsedData.error);
    return Res.upstream("Unexpected login response.", 502);
  }

  const account = parsedData.data;
  const token = account.accessToken;
  const maxAge = getTokenMaxAgeSeconds(token);
  const opts = cookieOptions(maxAge);
  const cookieStore = await cookies();

  // Secure, httpOnly token — used by server components for session reading
  cookieStore.set(TOKEN_COOKIE, token, opts);
  // Same token in a non-httpOnly cookie so the client-side fetch wrapper can read it
  cookieStore.set(ACCESS_TOKEN_COOKIE, token, { ...opts, httpOnly: false });
  // Serialised user payload for server-side initialUser hydration
  cookieStore.set(
    USER_COOKIE,
    serializeUserCookieValue({
      accountId: account.accountId,
      email: account.email,
      name: account.name || account.email,
      phoneNumber: null,
    }),
    opts
  );

  return Res.ok({
    ok: true,
    user: {
      accountId: account.accountId,
      email: account.email,
      name: account.name || account.email,
      phoneNumber: null,
    },
  });
}
