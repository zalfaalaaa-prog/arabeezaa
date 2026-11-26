export default function CatMascot({ mood = "happy", size = 76, className = "" }: { mood?: "happy" | "thinking" | "celebrate" | "sad"; size?: number; className?: string }) {
  const mouth = mood === "sad" ? "M43 64 Q50 57 57 64" : mood === "thinking" ? "M44 62 Q50 59 56 62" : "M42 60 Q50 70 58 60";
  return (
    <svg className={`cat-mascot-svg ${className}`} width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="Maskot kucing Arabeeza yang ramah" focusable="false">
      <ellipse cx="50" cy="89" rx="29" ry="6" fill="#354d43" opacity=".10" />
      <path d="M21 43 C18 33 19 20 25 14 C33 16 40 23 44 31 C48 29 52 29 56 31 C60 23 67 16 75 14 C81 20 82 33 79 43 C87 52 88 64 83 74 C76 86 64 92 50 92 C36 92 24 86 17 74 C12 64 13 52 21 43Z" fill="#fffdf8" stroke="#4d1c2b" strokeWidth="3" strokeLinejoin="round" />
      <path d="M26 34 C25 27 26 22 28 19 C34 22 38 27 41 33Z M59 33 C62 27 66 22 72 19 C74 22 75 27 74 34Z" fill="#f1b7c3" />
      <ellipse cx="36" cy="51" rx="5.2" ry="6.8" fill="#263b35" />
      <ellipse cx="64" cy="51" rx="5.2" ry="6.8" fill="#263b35" />
      <circle cx="38" cy="48.5" r="2" fill="#fff" />
      <circle cx="66" cy="48.5" r="2" fill="#fff" />
      <ellipse cx="27" cy="62" rx="6" ry="3.2" fill="#f4a8b4" opacity=".62" />
      <ellipse cx="73" cy="62" rx="6" ry="3.2" fill="#f4a8b4" opacity=".62" />
      <path d="M46 59 Q50 55 54 59 Q50 64 46 59Z" fill="#ed91a3" />
      <path d={mouth} fill="none" stroke="#4d1c2b" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M17 58 L7 55 M17 65 L6 67 M83 58 L93 55 M83 65 L94 67" stroke="#8a9a90" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M75 80 Q94 72 90 59 Q88 52 82 56" fill="none" stroke="#4d1c2b" strokeWidth="7" strokeLinecap="round" />
      <g transform="translate(50 24)">
        <path d="M0 4 C-12 -7 -22 -3 -18 6 C-14 14 -5 11 0 7Z" fill="#762b40" stroke="#4d1c2b" strokeWidth="1.7" />
        <path d="M0 4 C12 -7 22 -3 18 6 C14 14 5 11 0 7Z" fill="#762b40" stroke="#4d1c2b" strokeWidth="1.7" />
        <circle cx="0" cy="6" r="4" fill="#d7b66f" stroke="#4d1c2b" strokeWidth="1.5" />
      </g>
      {mood === "celebrate" && <g fill="#f3c96e"><path d="m9 19 3-7 3 7 7 3-7 3-3 7-3-7-7-3Z"/><path d="m84 15 2-5 2 5 5 2-5 2-2 5-2-5-5-2Z"/></g>}
      {mood === "thinking" && <circle cx="82" cy="25" r="5" fill="#c7ddf6" stroke="#4d1c2b" strokeWidth="1.5"/>}
      {mood === "sad" && <path d="M78 38 Q86 48 79 55" fill="none" stroke="#8ec5df" strokeWidth="3" strokeLinecap="round"/>}
    </svg>
  );
}
