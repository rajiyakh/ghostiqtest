import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin-auth";

function escapeCSV(value: unknown): string {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const supabase = createAdminClient();
  let query = supabase.from("users").select("*").order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const headers = [
    "id",
    "username",
    "wallet_address",
    "comment_link",
    "referral_code",
    "referred_by",
    "reward_points",
    "status",
    "task_follow",
    "task_like_repost",
    "task_comment_tag",
    "created_at",
  ];

  const rows = (data || []).map((u) => headers.map((h) => escapeCSV(u[h])).join(","));
  const csv = [headers.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="ghostiq-participants-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
