import { Res, apiFetchAuthed } from "@/app/api/orchestra";
import { ACCESS_TOKEN_COOKIE, TOKEN_COOKIE, USER_COOKIE } from "@/lib/auth-utils";
import { cookies } from "next/headers";

export async function POST() {
  await apiFetchAuthed("/auth/logout", { method: "POST" });

  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_COOKIE);
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(USER_COOKIE);
  return Res.ok({ ok: true });
}
