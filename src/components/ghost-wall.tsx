"use client";

import { GhostBasic, GhostWink, GhostStar, GhostPurple, GhostFlying, GhostJump } from "./ghosts";
import { DoodleStar, DoodleSparkle, DoodleHeart, DoodleScribble, DoodleZigzag } from "./doodles";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

const ghostVariants = [GhostBasic, GhostWink, GhostStar, GhostPurple, GhostFlying, GhostJump];
const colors = ["#FFFFFF", "#C6F432", "#4DEEEA", "#B6A6E8", "#F7F1E8", "#FFE3EC"];
const doodleVariants = [DoodleStar, DoodleSparkle, DoodleHeart, DoodleScribble, DoodleZigzag];

// Deterministic pseudo-random for stable SSR/CSR match
function seeded(i: number, salt = 1) {
  const x = Math.sin(i * 999 * salt) * 10000;
  return x - Math.floor(x);
}

export function GhostWall() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 20 });
  const sy = useSpring(my, { stiffness: 40, damping: 20 });

  const translateX = useTransform(sx, (v) => v * -1);
  const translateY = useTransform(sy, (v) => v * -1);

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      mx.set(x);
      my.set(y);
    }
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mx, my]);

  const cols = 10;
  const rows = 7;
  const items = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      const isDoodle = seeded(i, 7) > 0.78;
      const GhostComp = ghostVariants[Math.floor(seeded(i, 2) * ghostVariants.length)];
      const DoodleComp = doodleVariants[Math.floor(seeded(i, 3) * doodleVariants.length)];
      const color = colors[Math.floor(seeded(i, 4) * colors.length)];
      const size = 70 + seeded(i, 5) * 60;
      const rotate = (seeded(i, 6) - 0.5) * 24;
      const floatSpeed = i % 3 === 0 ? "animate-float-slow" : i % 3 === 1 ? "animate-float-med" : "animate-float-fast";
      const delay = seeded(i, 8) * 5;

      items.push(
        <motion.div
          key={i}
          className={`flex items-center justify-center ${floatSpeed}`}
          style={{
            animationDelay: `${delay}s`,
            opacity: 0.5 + seeded(i, 9) * 0.4,
          }}
          whileHover={{ scale: 1.25, rotate: rotate * 2, opacity: 1, zIndex: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 14 }}
        >
          <div style={{ transform: `rotate(${rotate}deg)`, width: size, height: isDoodle ? size * 0.6 : size * 1.1 }}>
            {isDoodle ? (
              <DoodleComp className="w-full h-full" />
            ) : (
              <GhostComp className="w-full h-full" color={color} />
            )}
          </div>
        </motion.div>
      );
    }
  }

  return (
    <motion.div
      className="absolute inset-0 -m-20 grid pointer-events-auto"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        x: translateX,
        y: translateY,
      }}
    >
      {items}
    </motion.div>
  );
}
