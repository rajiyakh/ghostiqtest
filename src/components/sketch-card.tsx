import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SketchCard({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      className={cn(
        "bg-cream border-[3px] border-ink rounded-[20px] sketch-shadow p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
