import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("users")
      .select("username, reward_points, referral_code")
      .order("reward_points", { ascending: false })
      .limit(10);

    if (error) throw error;

    return NextResponse.json({ leaderboard: data || [] });
  } catch (err) {
    console.error("Leaderboard error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
