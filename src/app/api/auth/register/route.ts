import { z } from "zod";
import { apiFetch, Res } from "@/app/api/orchestra";

const registerRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  phoneNumber: z.string().optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = registerRequestSchema.safeParse(body);
  if (!parsed.success) return Res.badRequest("Invalid registration data.");

  const { ok, status, data, error } = await apiFetch("/accounts/registration", {
    method: "POST",
    body: JSON.stringify({
      email: parsed.data.email,
      password: parsed.data.password,
      name: parsed.data.name,
      phoneNumber: parsed.data.phoneNumber ?? null,
      roleId: 4,
    }),
  });

  if (!ok) return Res.upstream(error ?? "Registration failed.", status);

  return Res.ok({ ok: true, account: data });
}
