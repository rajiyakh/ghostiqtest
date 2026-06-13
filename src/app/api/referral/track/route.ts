import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const { referralCode } = await req.json();
    if (!referralCode) {
      return NextResponse.json({ error: "Missing referral code" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const code = referralCode.toLowerCase();

    const { data: referrer } = await supabase
      .from("users")
      .select("id")
      .eq("referral_code", code)
      .maybeSingle();

    if (!referrer) {
      return NextResponse.json({ success: false });
    }

    // Find or create a "visit" referral row (referred_user_id null = anonymous visit tracking)
    const { data: existingVisit } = await supabase
      .from("referrals")
      .select("id, visit_count")
      .eq("referrer_id", referrer.id)
      .is("referred_user_id", null)
      .maybeSingle();

    if (existingVisit) {
      await supabase
        .from("referrals")
        .update({ visit_count: (existingVisit.visit_count || 0) + 1 })
        .eq("id", existingVisit.id);
    } else {
      await supabase.from("referrals").insert({
        referrer_id: referrer.id,
        referred_user_id: null,
        visit_count: 1,
        conversion_status: "visited",
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Referral track error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
