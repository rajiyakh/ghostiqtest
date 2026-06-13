type DoodleProps = {
  className?: string;
};

export function DoodleArrowCurvy({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 100 60" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5 10C25 5 60 5 80 25C90 35 75 45 60 38"
        stroke="#1A1A1A"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M62 30L60 38L70 40" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function DoodleStar({ className, fill = "#C6F432" }: DoodleProps & { fill?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 2L24 16L38 20L24 24L20 38L16 24L2 20L16 16Z"
        fill={fill}
        stroke="#1A1A1A"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DoodleScribble({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 80 30" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2 15C8 5 14 25 20 15C26 5 32 25 38 15C44 5 50 25 56 15C62 5 68 25 78 15"
        stroke="#1A1A1A"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function DoodleSpiral({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 50 50" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M25 25C25 15 35 15 35 25C35 35 15 35 15 25C15 10 40 10 40 25C40 40 10 40 10 22"
        stroke="#1A1A1A"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function DoodleSparkle({ className, fill = "#4DEEEA" }: DoodleProps & { fill?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 0L23 17L40 20L23 23L20 40L17 23L0 20L17 17Z" fill={fill} stroke="#1A1A1A" strokeWidth="1.5" />
    </svg>
  );
}

export function DoodleHeart({ className, fill = "#FF8FB1" }: DoodleProps & { fill?: string }) {
  return (
    <svg viewBox="0 0 40 36" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 34C20 34 2 22 2 11C2 4 8 1 13 1C17 1 20 4 20 8C20 4 23 1 27 1C32 1 38 4 38 11C38 22 20 34 20 34Z"
        fill={fill}
        stroke="#1A1A1A"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DoodleCheck({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 60 60" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="30" r="26" fill="#C6F432" stroke="#1A1A1A" strokeWidth="3" />
      <path d="M18 31L26 40L43 20" stroke="#1A1A1A" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function DoodleTape({ className, color = "#B6A6E8" }: DoodleProps & { color?: string }) {
  return (
    <svg viewBox="0 0 100 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="96" height="36" rx="2" fill={color} stroke="#1A1A1A" strokeWidth="2" opacity="0.85" transform="rotate(-3 50 20)" />
    </svg>
  );
}

export function DoodleZigzag({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 100 20" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 18L18 2L34 18L50 2L66 18L82 2L98 18" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
