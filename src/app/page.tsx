"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GhostWall } from "@/components/ghost-wall";
import { GhostFlying, GhostWink } from "@/components/ghosts";
import { DoodleArrowCurvy, DoodleSparkle, DoodleStar, DoodleScribble } from "@/components/doodles";

export default function Home() {
  const router = useRouter();
  const [transitioning, setTransitioning] = useState(false);

  function handleEnter() {
    setTransitioning(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 700);
  }

  return (
    <main className="relative w-full h-screen overflow-hidden bg-cream">
      <div className="absolute inset-0 opacity-90">
        <GhostWall />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-cream/20 via-cream/50 to-cream/80 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="absolute top-6 left-6 sm:top-10 sm:left-10 flex items-center gap-3 z-10"
      >
        <GhostWink className="w-12 h-14 sm:w-14 sm:h-16" color="#C6F432" />
        <span className="font-hand text-2xl sm:text-3xl font-bold text-ink rotate-[-2deg]">
          GHOSTIQ WORLD
        </span>
      </motion.div>

      <motion.div
        className="absolute top-24 right-12 sm:right-24 z-10"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
      >
        <DoodleSparkle className="w-10 h-10 animate-wiggle" fill="#4DEEEA" />
      </motion.div>

      <div className="relative z-20 w-full h-full flex flex-col items-center justify-center px-6">
        <AnimatePresence>
          {!transitioning && (
            <motion.div
              className="flex flex-col items-center text-center"
              exit={{ opacity: 0, scale: 0.3, rotate: -10 }}
              transition={{ duration: 0.6, ease: "easeIn" }}
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative mb-3"
              >
                <span className="font-doodle text-base sm:text-lg text-ink/70 bg-cream/80 px-4 py-1 rounded-full border-2 border-ink/20">
                  a collectible ghost universe
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30, rotate: -2 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ delay: 0.35, type: "spring", stiffness: 120 }}
                className="font-hand text-6xl sm:text-8xl md:text-9xl font-bold text-ink mb-2 leading-none"
              >
                Welcome to
              </motion.h1>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, type: "spring", stiffness: 120 }}
                className="font-hand text-7xl sm:text-9xl md:text-[10rem] font-bold mb-10 leading-none text-ink"
              >
                GHOSTIQ <span className="text-electric-cyan">WORLD</span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.65, type: "spring", stiffness: 200, damping: 12 }}
                className="relative"
              >
                <DoodleArrowCurvy className="absolute -top-16 -left-24 w-24 h-16 -rotate-12 hidden sm:block animate-wiggle" />
                <span className="absolute -top-10 -right-20 font-hand text-xl rotate-6 hidden sm:block text-ink/70">
                  click me!
                </span>

                <motion.button
                  onClick={handleEnter}
                  whileHover={{ scale: 1.06, rotate: -1 }}
                  whileTap={{ scale: 0.96 }}
                  className="relative font-hand text-2xl sm:text-4xl md:text-5xl font-bold text-ink px-10 sm:px-16 py-6 sm:py-8 rounded-[40px] bg-cream border-[4px] border-ink sketch-shadow-lg animate-bounce-sm"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(135deg, rgba(26,26,26,0.04) 0px, rgba(26,26,26,0.04) 2px, transparent 2px, transparent 12px)",
                  }}
                >
                  <span className="relative">ENTER GHOSTIQ WORLD</span>
                  <span className="absolute inset-2 border-2 border-dashed border-ink/30 rounded-[32px] pointer-events-none" />
                </motion.button>

                <DoodleStar className="absolute -bottom-6 -right-6 w-8 h-8 animate-wiggle" />
                <GhostFlying className="absolute -top-20 right-1/2 translate-x-32 w-16 h-14 hidden md:block animate-float-med" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="mt-12 flex items-center gap-2 text-ink/60"
              >
                <DoodleScribble className="w-16 h-6" />
                <span className="font-doodle text-sm sm:text-base">complete quests &middot; earn rewards &middot; climb the leaderboard</span>
                <DoodleScribble className="w-16 h-6 scale-x-[-1]" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {transitioning && (
          <motion.div
            initial={{ scale: 0, borderRadius: "50%" }}
            animate={{ scale: 30, borderRadius: "50%" }}
            transition={{ duration: 0.7, ease: "easeIn" }}
            className="fixed z-50 bg-electric-cyan"
            style={{
              width: 100,
              height: 100,
              top: "50%",
              left: "50%",
              translateX: "-50%",
              translateY: "-50%",
            }}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
