"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { QuestCard } from "@/components/quest-card";
import { SketchCard } from "@/components/sketch-card";
import { SketchButton } from "@/components/sketch-button";
import { SuccessScreen } from "@/components/success-screen";
import { ReferralCard } from "@/components/referral-card";
import { GhostWink, GhostBasic, GhostStar, FloatingGhost } from "@/components/ghosts";
import { DoodleSparkle, DoodleStar, DoodleHeart, DoodleArrowCurvy, DoodleZigzag } from "@/components/doodles";
import { fireConfetti } from "@/lib/confetti";

type Tasks = {
  follow: boolean;
  likeRepost: boolean;
  commentTag: boolean;
};

type SubmissionResult = {
  username: string;
  walletAddress: string;
  referralCode: string;
  rewardPoints: number;
  status: string;
  createdAt: string;
};

const STORAGE_KEY = "ghostiq_quest_state_v1";

function DashboardInner() {
  const searchParams = useSearchParams();
  const refParam = searchParams.get("ref");

  const [tasks, setTasks] = useState<Tasks>({ follow: false, likeRepost: false, commentTag: false });
  const [commentLink, setCommentLink] = useState("");
  const [commentVerified, setCommentVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameSubmitted, setUsernameSubmitted] = useState(false);
  const [wallet, setWallet] = useState("");
  const [submission, setSubmission] = useState<SubmissionResult | null>(null);
  const [stats, setStats] = useState<{
    totalReferrals: number;
    referralVisits: number;
    rewardPoints: number;
    conversionRate: number;
    leaderboardPosition: number;
  } | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.tasks) setTasks(parsed.tasks);
        if (parsed.commentLink) setCommentLink(parsed.commentLink);
        if (parsed.commentVerified) setCommentVerified(parsed.commentVerified);
        if (parsed.username) {
          setUsername(parsed.username);
          setUsernameSubmitted(true);
        }
        if (parsed.wallet) setWallet(parsed.wallet);
        if (parsed.submission) setSubmission(parsed.submission);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (refParam) {
      fetch("/api/referral/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referralCode: refParam }),
      }).catch(() => {});
      try {
        sessionStorage.setItem("ghostiq_ref", refParam);
      } catch {}
    }
  }, [refParam]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ tasks, commentLink, commentVerified, username: usernameSubmitted ? username : "", wallet, submission })
    );
  }, [tasks, commentLink, commentVerified, username, usernameSubmitted, wallet, submission]);

  useEffect(() => {
    if (submission?.username) {
      fetch(`/api/referral/stats?username=${submission.username}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.stats) setStats(data.stats);
        })
        .catch(() => {});
    }
  }, [submission]);

  const allTasksDone = tasks.follow && tasks.likeRepost && tasks.commentTag;
  const completedCount = Object.values(tasks).filter(Boolean).length;
  const progressPercent = submission ? 100 : Math.round((completedCount / 3) * (allTasksDone && commentVerified && usernameSubmitted ? 95 : 80));

  function handleVerifyComment() {
    setError("");
    if (!/^https?:\/\/(www\.)?(x\.com|twitter\.com)\/.+\/status\/\d+/.test(commentLink.trim())) {
      setError("Please paste a valid X (Twitter) status link.");
      return;
    }
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setCommentVerified(true);
      fireConfetti();
    }, 1200);
  }

  function handleSubmitUsername() {
    setError("");
    const clean = username.replace(/^@/, "").trim();
    if (!/^[A-Za-z0-9_]{1,15}$/.test(clean)) {
      setError("Please enter a valid X username (letters, numbers, underscore, max 15 chars).");
      return;
    }
    setUsername(clean);
    setUsernameSubmitted(true);
  }

  async function handleSubmitWallet() {
    setError("");
    if (!/^0x[a-fA-F0-9]{40}$/.test(wallet.trim())) {
      setError("Invalid wallet address. Must start with 0x followed by 40 hex characters.");
      return;
    }
    setSubmitting(true);
    try {
      let referredBy: string | null = null;
      try {
        referredBy = sessionStorage.getItem("ghostiq_ref");
      } catch {}

      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          walletAddress: wallet.trim(),
          commentLink: commentLink.trim(),
          referredBy,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setSubmitting(false);
        return;
      }
      setSubmission(data.user);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen notebook-bg relative pb-24">
      <div className="fixed top-20 left-4 sm:left-10 z-0 pointer-events-none">
        <FloatingGhost speed="slow"><GhostBasic className="w-16 h-20 opacity-50" color="#4DEEEA" /></FloatingGhost>
      </div>
      <div className="fixed top-40 right-4 sm:right-10 z-0 pointer-events-none">
        <FloatingGhost speed="med" delay={1}><GhostStar className="w-14 h-16 opacity-50" /></FloatingGhost>
      </div>
      <div className="fixed bottom-20 left-6 z-0 pointer-events-none hidden sm:block">
        <FloatingGhost speed="fast" delay={2}><DoodleHeart className="w-10 h-10 opacity-60" /></FloatingGhost>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <GhostWink className="w-10 h-12" color="#C6F432" />
          <h1 className="font-hand text-4xl sm:text-5xl font-bold text-ink">Quest Dashboard</h1>
          <DoodleSparkle className="w-8 h-8 animate-wiggle" />
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <SketchCard className="mb-6 bg-electric-cyan/20">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <div className="font-hand text-3xl font-bold">{progressPercent}%</div>
                <div className="font-doodle text-xs text-ink/60 mt-1">Quest Progress</div>
              </div>
              <div>
                <div className="font-hand text-3xl font-bold">{completedCount}/3</div>
                <div className="font-doodle text-xs text-ink/60 mt-1">Tasks Done</div>
              </div>
              <div>
                <div className="font-hand text-3xl font-bold">{stats?.totalReferrals ?? 0}</div>
                <div className="font-doodle text-xs text-ink/60 mt-1">Referrals</div>
              </div>
              <div>
                <div className="font-hand text-3xl font-bold">{stats?.rewardPoints ?? 0}</div>
                <div className="font-doodle text-xs text-ink/60 mt-1">Reward Points</div>
              </div>
            </div>
            <div className="mt-4 w-full h-3 bg-ghost-white border-2 border-ink rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-neon-lime"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </SketchCard>
        </motion.div>

        {!submission && (
          <>
            <div className="flex flex-col gap-4 mb-6">
              <QuestCard
                number={1}
                title="Follow on X"
                description="Follow the official GHOSTIQ account to stay updated."
                taskLink="https://x.com/GhostIQonEth"
                taskInstructions="Head over to our official X (Twitter) account and hit that Follow button. Don't worry, our ghosts won't bite!"
                done={tasks.follow}
                onComplete={() => {
                  setTasks((t) => ({ ...t, follow: true }));
                  fireConfetti();
                }}
              />
              <QuestCard
                number={2}
                title="Like + Repost"
                description="Like and repost the campaign tweet."
                taskLink="https://x.com/GhostIQonEth"
                taskInstructions="Find the pinned campaign tweet, give it a like, and repost it to spread the ghostly word."
                done={tasks.likeRepost}
                onComplete={() => {
                  setTasks((t) => ({ ...t, likeRepost: true }));
                  fireConfetti();
                }}
              />
              <QuestCard
                number={3}
                title="Comment + Tag 2 Friends"
                description="Comment on the campaign tweet and tag 2 friends."
                taskLink="https://x.com/GhostIQonEth"
                taskInstructions="Drop a comment on the campaign tweet and tag 2 friends who'd love to join GHOSTIQ WORLD too."
                done={tasks.commentTag}
                onComplete={() => {
                  setTasks((t) => ({ ...t, commentTag: true }));
                  fireConfetti();
                }}
              />
            </div>

            <AnimatePresence>
              {allTasksDone && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mb-6 overflow-hidden"
                >
                  <SketchCard className="bg-ghost-white">
                    <div className="flex items-center gap-2 mb-3">
                      <DoodleZigzag className="w-12 h-4" />
                      <h3 className="font-hand text-2xl font-bold">Paste Your Comment Link</h3>
                    </div>
                    {!commentVerified ? (
                      <>
                        <textarea
                          value={commentLink}
                          onChange={(e) => setCommentLink(e.target.value)}
                          placeholder="https://x.com/..."
                          className="w-full border-2 border-ink rounded-xl p-3 font-doodle text-sm bg-cream resize-none focus:outline-none focus:ring-2 focus:ring-electric-cyan"
                          rows={2}
                        />
                        <SketchButton variant="primary" className="mt-3 w-full" onClick={handleVerifyComment} disabled={verifying}>
                          {verifying ? "Verifying..." : "Verify Comment"}
                        </SketchButton>
                      </>
                    ) : (
                      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-3 text-ink">
                        <DoodleStar className="w-8 h-8" />
                        <span className="font-doodle">Comment verified successfully!</span>
                      </motion.div>
                    )}
                  </SketchCard>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {commentVerified && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mb-6 overflow-hidden"
                >
                  <SketchCard className="bg-ghost-white">
                    <div className="flex items-center gap-2 mb-3">
                      <DoodleZigzag className="w-12 h-4" />
                      <h3 className="font-hand text-2xl font-bold">X Username</h3>
                    </div>
                    {!usernameSubmitted ? (
                      <>
                        <input
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="@username"
                          className="w-full border-2 border-ink rounded-xl p-3 font-doodle text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-electric-cyan"
                        />
                        <SketchButton variant="primary" className="mt-3 w-full" onClick={handleSubmitUsername}>
                          Submit Username
                        </SketchButton>
                      </>
                    ) : (
                      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-3 text-ink">
                        <DoodleStar className="w-8 h-8" />
                        <span className="font-doodle">Username @{username} saved!</span>
                      </motion.div>
                    )}
                  </SketchCard>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {usernameSubmitted && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mb-6 overflow-hidden"
                >
                  <SketchCard className="bg-ghost-white">
                    <div className="flex items-center gap-2 mb-3">
                      <DoodleZigzag className="w-12 h-4" />
                      <h3 className="font-hand text-2xl font-bold">Wallet Address</h3>
                    </div>
                    <input
                      value={wallet}
                      onChange={(e) => setWallet(e.target.value)}
                      placeholder="0x..."
                      className="w-full border-2 border-ink rounded-xl p-3 font-doodle text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-electric-cyan"
                    />
                    <SketchButton variant="primary" className="mt-3 w-full" onClick={handleSubmitWallet} disabled={submitting}>
                      {submitting ? "Submitting..." : "Submit Wallet"}
                    </SketchButton>
                  </SketchCard>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
                <SketchCard className="bg-red-100 border-red-400">
                  <p className="font-doodle text-sm text-red-700">{error}</p>
                </SketchCard>
              </motion.div>
            )}

            {!allTasksDone && (
              <div className="flex items-center justify-center gap-2 text-ink/50 mt-8">
                <DoodleArrowCurvy className="w-12 h-8" />
                <span className="font-doodle text-sm">complete all 3 tasks above to unlock the next steps</span>
              </div>
            )}
          </>
        )}

        {submission && (
          <div className="flex flex-col gap-6">
            <SketchCard className="bg-cream">
              <SuccessScreen username={submission.username} walletAddress={submission.walletAddress} createdAt={submission.createdAt} />
            </SketchCard>

            {stats && <ReferralCard referralCode={submission.referralCode} stats={stats} />}
          </div>
        )}
      </div>
    </main>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={null}>
      <DashboardInner />
    </Suspense>
  );
}
