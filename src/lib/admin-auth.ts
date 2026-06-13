import { createClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await createClient();
  const { data: userData, error: authErr } = await supabase.auth.getUser();

  if (authErr || !userData?.user) {
    return { ok: false as const, status: 401, error: "Not authenticated" };
  }

  const { data: admin } = await supabase
    .from("admins")
    .select("id")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (!admin) {
    return { ok: false as const, status: 403, error: "Not an admin" };
  }

  return { ok: true as const, userId: userData.user.id };
}
