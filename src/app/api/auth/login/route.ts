import { cookies } from "next/headers";
import { z } from "zod";
import {
  ACCESS_TOKEN_COOKIE,
  TOKEN_COOKIE,
  USER_COOKIE,
  getTokenMaxAgeSeconds,
  serializeUserCookieValue,
} from "@/lib/auth-utils";
import { apiFetch, cookieOptions, Res } from "@/app/api/orchestra";

const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const loginResponseSchema = z.object({
  token: z.string(),
  account: z.object({
    customerId: z.number(),
    email: z.string().email(),
    name: z.string(),
    phoneNumber: z.string().nullable().optional(),
  }),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginRequestSchema.safeParse(body);
  if (!parsed.success) return Res.badRequest("Invalid credentials.");

  const { ok, status, data, error } = await apiFetch("/accounts/login", {
    method: "POST",
    body: JSON.stringify(parsed.data),
  });

  if (!ok) return Res.upstream(error ?? "Login failed.", status);

  const parsedData = loginResponseSchema.safeParse(data);
  if (!parsedData.success) return Res.upstream("Unexpected login response.", 502);

  const { token, account } = parsedData.data;
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
      customerId: account.customerId,
      email: account.email,
      name: account.name,
      phoneNumber: account.phoneNumber ?? null,
    }),
    opts
  );

  return Res.ok({
    ok: true,
    user: {
      customerId: account.customerId,
      email: account.email,
      name: account.name,
      phoneNumber: account.phoneNumber ?? null,
    },
  });
}
