import { useId, type ReactNode } from "react";

type Kind = "streak" | "diamond" | "heart" | "xp" | "star";

export default function GamificationIcon({ kind, size = 32, className = "" }: { kind: Kind; size?: number; className?: string }) {
  const uniqueId = useId().replace(/:/g, "");
  const id = `arabeeza-${kind}-${uniqueId}`;
  let artwork: ReactNode;

  if (kind === "streak") {
    artwork = (
      <>
        <path d="M24 3C20 11 10 16 10 28a14 14 0 0 0 28 0c0-7-4-12-9-17-1 5-3 7-5 8 0-7-1-11 0-16Z" fill={`url(#${id}-outer)`} stroke="#fff" strokeWidth="2.6" strokeLinejoin="round" />
        <path d="M24 20c-4 5-8 8-8 13a8 8 0 0 0 16 0c0-4-3-7-6-10 0 3-1 5-2 6-1-3-1-6 0-9Z" fill={`url(#${id}-inner)`} />
        <path d="M15 24c1-5 4-8 7-11" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" opacity=".8" />
      </>
    );
  } else if (kind === "diamond") {
    artwork = (
      <>
        <path d="M14 4h20l10 12-20 28L4 16 14 4Z" fill={`url(#${id}-outer)`} stroke="#fff" strokeWidth="2.7" strokeLinejoin="round" />
        <path d="M14 4 9 16h30L34 4H14Z" fill="#dff7ff" opacity=".8" />
        <path d="m9 16 15 28 5-28H9Z" fill="#159bd5" opacity=".38" />
        <path d="m29 16 15 0-20 28 5-28Z" fill="#075fa8" opacity=".34" />
        <path d="M15 9h8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" opacity=".85" />
      </>
    );
  } else if (kind === "heart") {
    artwork = (
      <>
        <path d="M24 42 7 26C-2 14 13 3 24 14 35 3 50 14 41 26L24 42Z" fill={`url(#${id}-outer)`} stroke="#fff" strokeWidth="2.7" strokeLinejoin="round" />
        <path d="M10 17c2-5 8-6 12-2" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".75" />
        <ellipse cx="14" cy="23" rx="3.2" ry="5" fill="#fff" opacity=".3" transform="rotate(-35 14 23)" />
      </>
    );
  } else if (kind === "xp") {
    artwork = (
      <>
        <path d="m24 3 6 13 14 2-10 10 2 15-12-7-12 7 2-15L4 18l14-2 6-13Z" fill={`url(#${id}-outer)`} stroke="#fff" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="m24 11 3.5 8 8.5 1.2-6.2 6.1 1.5 8.5-7.3-4.2-7.3 4.2 1.5-8.5-6.2-6.1 8.5-1.2L24 11Z" fill="#fff4c9" opacity=".55" />
      </>
    );
  } else {
    artwork = (
      <>
        <path d="m24 3 6.5 13.2L45 18.3l-10.5 10.2L37 43 24 36.1 11 43l2.5-14.5L3 18.3l14.5-2.1L24 3Z" fill={`url(#${id}-outer)`} stroke="#fff" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="m24 11 4 8.2 9 1.3-6.5 6.3 1.5 9-8-4.2-8 4.2 1.5-9-6.5-6.3 9-1.3L24 11Z" fill="#fff4c9" opacity=".5" />
      </>
    );
  }

  return (
    <svg className={className} width={size} height={size} viewBox="0 0 48 48" fill="none" role="img" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-outer`} x1="8" y1="5" x2="39" y2="44" gradientUnits="userSpaceOnUse">
          {kind === "streak" ? <><stop stopColor="#FFE36B"/><stop offset=".48" stopColor="#FF9B22"/><stop offset="1" stopColor="#F05A24"/></> : null}
          {kind === "diamond" ? <><stop stopColor="#74E2FF"/><stop offset=".5" stopColor="#1CA9E8"/><stop offset="1" stopColor="#1464B5"/></> : null}
          {kind === "heart" ? <><stop stopColor="#FF8790"/><stop offset=".52" stopColor="#F44759"/><stop offset="1" stopColor="#C51F42"/></> : null}
          {kind === "xp" || kind === "star" ? <><stop stopColor="#FFE88A"/><stop offset=".5" stopColor="#E8B94D"/><stop offset="1" stopColor="#B98226"/></> : null}
        </linearGradient>
        <linearGradient id={`${id}-inner`} x1="16" y1="20" x2="33" y2="39" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFF6A7"/><stop offset="1" stopColor="#FFC02E"/>
        </linearGradient>
      </defs>
      {artwork}
    </svg>
  );
}
