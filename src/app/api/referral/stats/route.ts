import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username")?.toLowerCase();

    if (!username) {
      return NextResponse.json({ error: "Missing username" }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, username, referral_code, reward_points, status, created_at, wallet_address, comment_link, task_follow, task_like_repost, task_comment_tag")
      .eq("username", username)
      .maybeSingle();

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // visits = sum of visit_count from referral rows with referred_user_id null
    const { data: visitRows } = await supabase
      .from("referrals")
      .select("visit_count")
      .eq("referrer_id", user.id)
      .is("referred_user_id", null);

    const referralVisits = (visitRows || []).reduce((sum, r) => sum + (r.visit_count || 0), 0);

    // successful referrals = count of converted referrals
    const { count: successfulReferrals } = await supabase
      .from("referrals")
      .select("id", { count: "exact", head: true })
      .eq("referrer_id", user.id)
      .eq("conversion_status", "converted");

    const totalReferrals = successfulReferrals || 0;
    const conversionRate = referralVisits > 0 ? Math.round((totalReferrals / referralVisits) * 100) : 0;

    // Leaderboard position: count of users with higher reward_points
    const { count: higherCount } = await supabase
      .from("users")
      .select("id", { count: "exact", head: true })
      .gt("reward_points", user.reward_points || 0);

    const leaderboardPosition = (higherCount || 0) + 1;

    return NextResponse.json({
      user: {
        username: user.username,
        referralCode: user.referral_code,
        rewardPoints: user.reward_points,
        status: user.status,
        createdAt: user.created_at,
        walletAddress: user.wallet_address,
        commentLink: user.comment_link,
        taskFollow: user.task_follow,
        taskLikeRepost: user.task_like_repost,
        taskCommentTag: user.task_comment_tag,
      },
      stats: {
        totalReferrals,
        successfulReferrals: totalReferrals,
        referralVisits,
        conversionRate,
        leaderboardPosition,
        rewardPoints: user.reward_points,
      },
    });
  } catch (err) {
    console.error("Referral stats error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
