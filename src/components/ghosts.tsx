"use client";

import { motion } from "framer-motion";

type GhostProps = {
  className?: string;
  color?: string;
  style?: React.CSSProperties;
};

// A collection of cute hand-drawn ghost characters with sketchy outlines.
// Each is a self-contained SVG using currentColor-friendly fills via props.

export function GhostBasic({ className, color = "#FFFFFF" }: GhostProps) {
  return (
    <svg viewBox="0 0 120 140" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M60 8C32 8 12 30 12 60V118C12 124 18 128 22 122L32 110L44 124C48 128 54 128 58 124L66 114L78 126C82 130 88 128 90 122L100 108L106 120C110 126 118 122 118 116V60C118 30 98 8 60 8Z"
        fill={color}
        stroke="#1A1A1A"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <circle cx="42" cy="58" r="6" fill="#1A1A1A" />
      <circle cx="78" cy="58" r="6" fill="#1A1A1A" />
      <path d="M48 78C52 84 68 84 72 78" stroke="#1A1A1A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M30 36C34 28 44 24 50 28" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.4" />
    </svg>
  );
}

export function GhostWink({ className, color = "#C6F432" }: GhostProps) {
  return (
    <svg viewBox="0 0 120 140" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M60 6C30 6 10 28 10 58V120C10 126 17 130 21 124L33 110L46 124C50 128 56 128 60 124L68 114L82 126C86 130 93 127 95 121L104 108L108 118C112 125 120 121 120 114V58C120 28 90 6 60 6Z"
        fill={color}
        stroke="#1A1A1A"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path d="M36 56L50 56" stroke="#1A1A1A" strokeWidth="4" strokeLinecap="round" />
      <circle cx="78" cy="58" r="6" fill="#1A1A1A" />
      <path d="M44 80C50 90 70 90 76 80" stroke="#1A1A1A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function GhostStar({ className, color = "#4DEEEA" }: GhostProps) {
  return (
    <svg viewBox="0 0 120 140" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M60 6C30 6 10 28 10 58V120C10 126 17 130 21 124L33 110L46 124C50 128 56 128 60 124L68 114L82 126C86 130 93 127 95 121L104 108L108 118C112 125 120 121 120 114V58C120 28 90 6 60 6Z"
        fill={color}
        stroke="#1A1A1A"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path d="M42 52L46 60L54 60L48 65L50 73L42 68L34 73L36 65L30 60L38 60Z" fill="#1A1A1A" />
      <path d="M82 52L86 60L94 60L88 65L90 73L82 68L74 73L76 65L70 60L78 60Z" fill="#1A1A1A" />
      <ellipse cx="61" cy="85" rx="10" ry="6" fill="#1A1A1A" />
    </svg>
  );
}

export function GhostPurple({ className, color = "#B6A6E8" }: GhostProps) {
  return (
    <svg viewBox="0 0 120 140" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M60 4C28 4 8 26 8 58V122C8 128 16 132 20 125L32 110L46 124C50 128 56 128 60 124L68 114L82 126C86 130 94 127 96 120L106 106L110 117C114 124 122 119 122 112V58C122 26 92 4 60 4Z"
        fill={color}
        stroke="#1A1A1A"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <ellipse cx="44" cy="58" rx="8" ry="10" fill="#1A1A1A" />
      <ellipse cx="78" cy="58" rx="8" ry="10" fill="#1A1A1A" />
      <circle cx="47" cy="55" r="2.5" fill="#FFFFFF" />
      <circle cx="81" cy="55" r="2.5" fill="#FFFFFF" />
      <ellipse cx="61" cy="84" rx="14" ry="9" fill="#1A1A1A" />
      <ellipse cx="56" cy="84" rx="3" ry="4" fill="#FF8FB1" />
      <ellipse cx="66" cy="84" rx="3" ry="4" fill="#FF8FB1" />
    </svg>
  );
}

export function GhostFlying({ className, color = "#FFFFFF" }: GhostProps) {
  return (
    <svg viewBox="0 0 140 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M30 60C20 40 35 18 60 18C85 18 105 32 115 50C122 62 118 75 108 72L100 68L96 80C94 86 86 86 84 80L80 70L72 82C69 87 61 86 60 80L57 70L48 80C45 85 37 83 38 76L40 64L28 70C20 73 18 64 30 60Z"
        fill={color}
        stroke="#1A1A1A"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <circle cx="62" cy="46" r="5" fill="#1A1A1A" />
      <circle cx="86" cy="46" r="5" fill="#1A1A1A" />
      <path d="M66 60C70 65 80 65 84 60" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function GhostJump({ className, color = "#F7F1E8" }: GhostProps) {
  return (
    <svg viewBox="0 0 120 140" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M60 10C34 10 14 30 14 56C14 70 20 80 14 92C8 102 20 106 28 98L40 110C44 114 50 114 54 110L62 102L74 112C78 116 86 114 88 108L98 96L104 106C108 113 116 109 114 100L106 84C112 70 110 30 86 16C78 11 69 10 60 10Z"
        fill={color}
        stroke="#1A1A1A"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path d="M40 50C44 42 54 38 60 42" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="46" cy="60" r="5.5" fill="#1A1A1A" />
      <circle cx="76" cy="60" r="5.5" fill="#1A1A1A" />
      <path d="M50 80C56 90 76 90 82 80" stroke="#1A1A1A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <circle cx="40" cy="76" r="6" fill="#FFB6C1" opacity="0.7" />
      <circle cx="88" cy="76" r="6" fill="#FFB6C1" opacity="0.7" />
    </svg>
  );
}

// Floating wrapper with parallax-ish hover
export function FloatingGhost({
  children,
  className,
  delay = 0,
  speed = "slow",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  speed?: "slow" | "med" | "fast";
}) {
  const animClass =
    speed === "slow" ? "animate-float-slow" : speed === "med" ? "animate-float-med" : "animate-float-fast";
  return (
    <motion.div
      className={`${animClass} ${className ?? ""}`}
      style={{ animationDelay: `${delay}s` }}
      whileHover={{ scale: 1.15, rotate: 6 }}
      transition={{ type: "spring", stiffness: 300, damping: 12 }}
    >
      {children}
    </motion.div>
  );
}
