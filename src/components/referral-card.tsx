"use client";

import { useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";
import { SketchCard } from "./sketch-card";
import { SketchButton } from "./sketch-button";
import { GhostFlying } from "./ghosts";
import { DoodleZigzag, DoodleStar } from "./doodles";

export function ReferralCard({
  referralCode,
  stats,
}: {
  referralCode: string;
  stats: {
    totalReferrals: number;
    referralVisits: number;
    rewardPoints: number;
    conversionRate: number;
    leaderboardPosition: number;
  };
}) {
  const [copied, setCopied] = useState(false);

  const referralLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/ref/${referralCode}`
      : `https://ghostiq.world/ref/${referralCode}`;

  function handleCopy() {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleShare() {
    const text = `I just entered GHOSTIQ WORLD 👻 join the quest and earn rewards: ${referralLink}`;
    if (navigator.share) {
      navigator.share({ text, url: referralLink });
    } else {
      window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
    }
  }

  return (
    <SketchCard className="relative overflow-hidden bg-soft-purple/15">
      <GhostFlying className="absolute -top-2 -right-4 w-20 h-16 animate-float-med opacity-80" />
      <DoodleStar className="absolute top-2 left-2 w-6 h-6 animate-wiggle" />

      <div className="flex items-center gap-2 mb-3">
        <DoodleZigzag className="w-12 h-4" />
        <h3 className="font-hand text-2xl font-bold text-ink">Your Referral Link</h3>
      </div>

      <div className="bg-ghost-white border-2 border-ink rounded-xl px-4 py-3 mb-4 font-doodle text-sm break-all">
        {referralLink}
      </div>

      <div className="flex gap-3 mb-5">
        <SketchButton variant="primary" size="sm" onClick={handleCopy} className="flex-1 flex items-center justify-center gap-2">
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "Copied!" : "Copy"}
        </SketchButton>
        <SketchButton variant="secondary" size="sm" onClick={handleShare} className="flex-1 flex items-center justify-center gap-2">
          <Share2 size={16} />
          Share
        </SketchButton>
      </div>

      <div className="grid grid-cols-2 gap-3 font-doodle text-sm">
        <div className="bg-ghost-white border-2 border-ink rounded-xl p-3 text-center">
          <div className="text-2xl font-bold font-hand">{stats.totalReferrals}</div>
          <div className="text-ink/60 text-xs mt-1">Successful Referrals</div>
        </div>
        <div className="bg-ghost-white border-2 border-ink rounded-xl p-3 text-center">
          <div className="text-2xl font-bold font-hand">{stats.referralVisits}</div>
          <div className="text-ink/60 text-xs mt-1">Referral Visits</div>
        </div>
        <div className="bg-ghost-white border-2 border-ink rounded-xl p-3 text-center">
          <div className="text-2xl font-bold font-hand">{stats.rewardPoints}</div>
          <div className="text-ink/60 text-xs mt-1">Reward Points</div>
        </div>
        <div className="bg-ghost-white border-2 border-ink rounded-xl p-3 text-center">
          <div className="text-2xl font-bold font-hand">#{stats.leaderboardPosition}</div>
          <div className="text-ink/60 text-xs mt-1">Leaderboard Rank</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between font-doodle text-xs text-ink/60 mb-1">
          <span>Conversion Rate</span>
          <span>{stats.conversionRate}%</span>
        </div>
        <div className="w-full h-3 bg-ghost-white border-2 border-ink rounded-full overflow-hidden">
          <div
            className="h-full bg-neon-lime transition-all duration-700"
            style={{ width: `${Math.min(stats.conversionRate, 100)}%` }}
          />
        </div>
      </div>
    </SketchCard>
  );
}
