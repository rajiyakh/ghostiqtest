import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

function isValidWallet(addr: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(addr);
}

function isValidUsername(name: string) {
  // X usernames: 1-15 chars, letters/numbers/underscore
  const clean = name.replace(/^@/, "");
  return /^[A-Za-z0-9_]{1,15}$/.test(clean);
}

function isValidCommentLink(link: string) {
  return /^https?:\/\/(www\.)?(x\.com|twitter\.com)\/.+\/status\/\d+/.test(link);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, walletAddress, commentLink, referredBy } = body;

    if (!username || !isValidUsername(username)) {
      return NextResponse.json({ error: "Invalid X username" }, { status: 400 });
    }
    if (!walletAddress || !isValidWallet(walletAddress)) {
      return NextResponse.json({ error: "Invalid wallet address. Must be 0x followed by 40 hex characters." }, { status: 400 });
    }
    if (!commentLink || !isValidCommentLink(commentLink)) {
      return NextResponse.json({ error: "Invalid comment link. Must be a valid X/Twitter status URL." }, { status: 400 });
    }

    const cleanUsername = username.replace(/^@/, "").toLowerCase();
    const referralCode = cleanUsername;

    const supabase = createAdminClient();

    // Check for existing username
    const { data: existing } = await supabase
      .from("users")
      .select("id, username, referral_code, reward_points, status, created_at")
      .eq("username", cleanUsername)
      .maybeSingle();

    if (existing) {
      // Update existing user's submission
      const { data: updated, error: updateError } = await supabase
        .from("users")
        .update({
          wallet_address: walletAddress,
          comment_link: commentLink,
          task_follow: true,
          task_like_repost: true,
          task_comment_tag: true,
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (updateError) throw updateError;

      return NextResponse.json({
        success: true,
        user: {
          username: updated.username,
          walletAddress: updated.wallet_address,
          referralCode: updated.referral_code,
          rewardPoints: updated.reward_points,
          status: updated.status,
          createdAt: updated.created_at,
        },
      });
    }

    // Validate referredBy exists if provided
    let validReferredBy: string | null = null;
    if (referredBy) {
      const refCode = referredBy.toLowerCase();
      if (refCode !== cleanUsername) {
        const { data: referrer } = await supabase
          .from("users")
          .select("referral_code")
          .eq("referral_code", refCode)
          .maybeSingle();
        if (referrer) {
          validReferredBy = referrer.referral_code;
        }
      }
    }

    const { data: created, error: insertError } = await supabase
      .from("users")
      .insert({
        username: cleanUsername,
        wallet_address: walletAddress,
        comment_link: commentLink,
        referral_code: referralCode,
        referred_by: validReferredBy,
        task_follow: true,
        task_like_repost: true,
        task_comment_tag: true,
        status: "pending",
      })
      .select()
      .single();

    if (insertError) {
      if (insertError.code === "23505") {
        return NextResponse.json({ error: "This username or referral code is already taken." }, { status: 409 });
      }
      throw insertError;
    }

    return NextResponse.json({
      success: true,
      user: {
        username: created.username,
        walletAddress: created.wallet_address,
        referralCode: created.referral_code,
        rewardPoints: created.reward_points,
        status: created.status,
        createdAt: created.created_at,
      },
    });
  } catch (err) {
    console.error("Submission error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
