"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { GhostBasic, GhostWink, GhostStar, GhostPurple, GhostJump } from "./ghosts";
import { DoodleSparkle, DoodleStar, DoodleHeart, DoodleZigzag } from "./doodles";
import { SketchCard } from "./sketch-card";
import { fireBigConfetti } from "@/lib/confetti";

export function SuccessScreen({
  username,
  walletAddress,
  createdAt,
}: {
  username: string;
  walletAddress: string;
  createdAt: string;
}) {
  useEffect(() => {
    fireBigConfetti();
  }, []);

  const formattedDate = new Date(createdAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="relative flex flex-col items-center text-center py-8">
      <div className="relative w-full flex justify-center mb-4">
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, type: "spring" }} className="absolute -left-4 sm:left-8 -top-4">
          <GhostWink className="w-16 h-20 animate-bounce-sm" color="#C6F432" />
        </motion.div>
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, type: "spring" }} className="absolute -right-4 sm:right-8 -top-2">
          <GhostStar className="w-16 h-20 animate-bounce-sm" />
        </motion.div>
        <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, type: "spring" }}>
          <GhostPurple className="w-24 h-28 animate-bounce-sm" />
        </motion.div>
        <DoodleSparkle className="absolute top-0 left-1/4 w-8 h-8 animate-wiggle" />
        <DoodleStar className="absolute top-4 right-1/4 w-6 h-6 animate-wiggle" />
        <DoodleHeart className="absolute -bottom-2 left-1/3 w-7 h-7 animate-wiggle" />
      </div>

      <motion.h1
        initial={{ scale: 0, rotate: -8 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.4 }}
        className="font-hand text-5xl sm:text-6xl font-bold text-ink mb-2"
      >
        QUEST COMPLETED!
      </motion.h1>

      <p className="font-doodle text-base text-ink/70 mb-6 max-w-sm">
        Your submission has been received successfully. Our ghosts are reviewing it now.
      </p>

      <SketchCard className="w-full max-w-sm text-left bg-ghost-white">
        <div className="flex items-center gap-2 mb-3">
          <DoodleZigzag className="w-12 h-4" />
          <span className="font-hand text-xl font-bold">Submission Details</span>
        </div>
        <div className="space-y-3 font-doodle text-sm">
          <div className="flex justify-between border-b border-dashed border-ink/30 pb-2">
            <span className="text-ink/60">X Username</span>
            <span className="font-bold">@{username}</span>
          </div>
          <div className="flex justify-between border-b border-dashed border-ink/30 pb-2">
            <span className="text-ink/60">Wallet Address</span>
            <span className="font-bold text-xs">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
          </div>
          <div className="flex justify-between border-b border-dashed border-ink/30 pb-2">
            <span className="text-ink/60">Submission Date</span>
            <span className="font-bold text-xs">{formattedDate}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-ink/60">Status</span>
            <span className="font-doodle text-xs px-3 py-1 rounded-full border-2 border-ink bg-soft-purple/40">
              Pending Review
            </span>
          </div>
        </div>
      </SketchCard>

      <div className="mt-6 flex items-center gap-2">
        <GhostBasic className="w-10 h-12" color="#4DEEEA" />
        <GhostJump className="w-10 h-12" />
        <GhostWink className="w-10 h-12" color="#B6A6E8" />
      </div>
    </div>
  );
}
