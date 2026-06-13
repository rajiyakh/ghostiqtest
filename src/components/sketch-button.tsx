"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type SketchButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "dark" | "ghost";
  size?: "sm" | "md" | "lg";
};

const variants = {
  primary: "bg-neon-lime text-ink",
  secondary: "bg-electric-cyan text-ink",
  dark: "bg-ink text-cream",
  ghost: "bg-cream text-ink",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-10 py-5 text-xl",
};

export function SketchButton({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: SketchButtonProps) {
  return (
    <button
      className={cn(
        "font-doodle border-[3px] border-ink rounded-2xl sketch-shadow-sm transition-all duration-150",
        "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(26,26,26,0.85)]",
        "active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
