import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const supabase = createAdminClient();

  const { count: total } = await supabase.from("users").select("id", { count: "exact", head: true });
  const { count: pending } = await supabase.from("users").select("id", { count: "exact", head: true }).eq("status", "pending");
  const { count: approved } = await supabase.from("users").select("id", { count: "exact", head: true }).eq("status", "approved");
  const { count: rejected } = await supabase.from("users").select("id", { count: "exact", head: true }).eq("status", "rejected");

  const { data: topReferrers } = await supabase
    .from("users")
    .select("username, referral_code, reward_points")
    .order("reward_points", { ascending: false })
    .limit(10);

  return NextResponse.json({
    totals: {
      total: total || 0,
      pending: pending || 0,
      approved: approved || 0,
      rejected: rejected || 0,
    },
    topReferrers: topReferrers || [],
  });
}
