import { useId, type ReactNode } from "react";

type Kind = "streak" | "diamond" | "heart" | "xp" | "star";

export default function GamificationIcon({ kind, size = 32, className = "" }: { kind: Kind; size?: number; className?: string }) {
  const uniqueId = useId().replace(/:/g, "");
  const id = `arabeeza-${kind}-${uniqueId}`;
  if (kind === "streak" || kind === "diamond" || kind === "heart") {
    const emoji = kind === "streak" ? "🔥" : kind === "diamond" ? "💎" : "❤️";
    return (
      <span
        className={`gamification-emoji ${className}`}
        style={{ display: "inline-flex", width: size, height: size, flex: `0 0 ${size}px`, alignItems: "center", justifyContent: "center", fontSize: size * 0.88, lineHeight: 1 }}
        role="img"
        aria-label={kind === "streak" ? "Streak" : kind === "diamond" ? "Berlian" : "Nyawa"}
      >
        {emoji}
      </span>
    );
  }

  const artwork: ReactNode = (
    <>
      <path d="m24 3 6.5 13.2L45 18.3l-10.5 10.2L37 43 24 36.1 11 43l2.5-14.5L3 18.3l14.5-2.1L24 3Z" fill={`url(#${id}-outer)`} stroke="#fff" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="m24 11 4 8.2 9 1.3-6.5 6.3 1.5 9-8-4.2-8 4.2 1.5-9-6.5-6.3 9-1.3L24 11Z" fill="#fff4c9" opacity=".5" />
    </>
  );

  return (
    <svg className={className} width={size} height={size} viewBox="0 0 48 48" fill="none" role="img" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-outer`} x1="8" y1="5" x2="39" y2="44" gradientUnits="userSpaceOnUse">
          <><stop stopColor="#FFE88A"/><stop offset=".5" stopColor="#E8B94D"/><stop offset="1" stopColor="#B98226"/></>
        </linearGradient>
      </defs>
      {artwork}
    </svg>
  );
}
