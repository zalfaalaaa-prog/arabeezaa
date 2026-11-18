import React from "react";

export type CatAvatarPreset =
  | "moka"
  | "luna"
  | "cici"
  | "nala"
  | "mimi"
  | "oyen";

type CatAvatarProps = {
  preset?: CatAvatarPreset;
  size?: number;
  className?: string;
  expression?: "senyum" | "ceria" | "serius";
};

const presets: Record<CatAvatarPreset, {
  fur: string;
  ear: string;
  outfit: string;
  accent: string;
  accessory: "bow" | "glasses" | "cap" | "flower" | "scarf" | "bell";
}> = {
  moka: { fur: "#F4E2CC", ear: "#E6B7A0", outfit: "#7E9A78", accent: "#F5C85B", accessory: "bow" },
  luna: { fur: "#DCCBF0", ear: "#C7A9E3", outfit: "#9A7BC3", accent: "#F39CB9", accessory: "glasses" },
  cici: { fur: "#F2B47F", ear: "#E8946D", outfit: "#6FA6C8", accent: "#F7D36B", accessory: "cap" },
  nala: { fur: "#BFC7C4", ear: "#9FAAA6", outfit: "#D58D75", accent: "#FFF3C7", accessory: "flower" },
  mimi: { fur: "#F6D8D4", ear: "#ECAEB2", outfit: "#78A99A", accent: "#F6C4D7", accessory: "scarf" },
  oyen: { fur: "#E69A55", ear: "#D67B40", outfit: "#E4B34E", accent: "#FFF1C7", accessory: "bell" }
};

export function getCatPresetFromAvatar(skin?: string, outfit?: string, expression?: string): CatAvatarPreset {
  if (skin === "cerah" && outfit === "ungu") return "luna";
  if (skin === "kuning-langsat" && outfit === "oranye") return "cici";
  if (skin === "cokelat" && outfit === "biru") return "nala";
  if (skin === "cerah" && outfit === "hijau" && expression === "ceria") return "mimi";
  if (skin === "cokelat" && outfit === "oranye") return "oyen";
  return "moka";
}

export function getCatPresetValues(preset: CatAvatarPreset) {
  const values: Record<CatAvatarPreset, { skin: string; outfit: string; expression: "senyum" | "ceria" | "serius" }> = {
    moka: { skin: "sawo-matang", outfit: "hijau", expression: "senyum" },
    luna: { skin: "cerah", outfit: "ungu", expression: "ceria" },
    cici: { skin: "kuning-langsat", outfit: "oranye", expression: "ceria" },
    nala: { skin: "cokelat", outfit: "biru", expression: "serius" },
    mimi: { skin: "cerah", outfit: "hijau", expression: "ceria" },
    oyen: { skin: "cokelat", outfit: "oranye", expression: "senyum" }
  };
  return values[preset];
}

export default function CatAvatar({
  preset = "moka",
  size = 150,
  className = "",
  expression
}: CatAvatarProps) {
  const v = presets[preset];
  const face = expression || (preset === "nala" ? "serius" : preset === "cici" || preset === "mimi" ? "ceria" : "senyum");

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 180 180"
      role="img"
      aria-label={`Karakter kucing ${preset}`}
    >
      <ellipse cx="90" cy="163" rx="54" ry="10" fill="#2E4D42" opacity=".10" />
      <path d="M49 107 Q42 137 54 151 Q68 164 90 164 Q112 164 126 151 Q138 137 131 107Z" fill={v.outfit} stroke="#34423D" strokeWidth="4" />
      <path d="M57 112 Q42 126 49 143" fill="none" stroke={v.accent} strokeWidth="10" strokeLinecap="round" opacity=".9" />
      <path d="M123 112 Q138 126 131 143" fill="none" stroke={v.accent} strokeWidth="10" strokeLinecap="round" opacity=".9" />

      <path d="M42 65 L48 22 L77 45 Q90 40 103 45 L132 22 L138 65 Q151 82 143 112 Q132 143 90 143 Q48 143 37 112 Q29 82 42 65Z" fill={v.fur} stroke="#34423D" strokeWidth="4" strokeLinejoin="round" />
      <path d="M49 52 L52 33 L70 47Z M110 47 L128 33 L131 52Z" fill={v.ear} />

      <ellipse cx="67" cy="83" rx="10" ry="13" fill="#263B35" />
      <ellipse cx="113" cy="83" rx="10" ry="13" fill="#263B35" />
      <circle cx="70" cy="79" r="3.5" fill="white" />
      <circle cx="116" cy="79" r="3.5" fill="white" />

      {face === "serius" ? (
        <>
          <path d="M57 67 L73 63" stroke="#34423D" strokeWidth="4" strokeLinecap="round" />
          <path d="M107 63 L123 67" stroke="#34423D" strokeWidth="4" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M57 65 Q66 60 74 64" stroke="#34423D" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M106 64 Q114 60 123 65" stroke="#34423D" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      )}

      <path d="M84 98 Q90 92 96 98 Q90 106 84 98Z" fill="#EF8E9E" />
      {face === "serius"
        ? <path d="M81 113 Q90 108 99 113" fill="none" stroke="#34423D" strokeWidth="3" strokeLinecap="round" />
        : <path d="M77 106 Q90 121 103 106" fill="none" stroke="#34423D" strokeWidth="3.5" strokeLinecap="round" />
      }

      <path d="M39 94 L16 89 M40 103 L15 105 M141 94 L164 89 M140 103 L165 105" stroke="#68756F" strokeWidth="2.5" strokeLinecap="round" />

      {v.accessory === "bow" && (
        <g transform="translate(90 31)">
          <path d="M0 4 C-18 -12 -31 -5 -26 7 C-21 18 -8 14 0 7Z" fill="#F29AB5" stroke="#34423D" strokeWidth="3" />
          <path d="M0 4 C18 -12 31 -5 26 7 C21 18 8 14 0 7Z" fill="#F29AB5" stroke="#34423D" strokeWidth="3" />
          <circle cx="0" cy="6" r="7" fill="#F6C95E" stroke="#34423D" strokeWidth="3" />
        </g>
      )}

      {v.accessory === "glasses" && (
        <g fill="none" stroke="#4777A7" strokeWidth="5">
          <rect x="51" y="72" width="32" height="24" rx="8" />
          <rect x="97" y="72" width="32" height="24" rx="8" />
          <path d="M83 80 Q90 76 97 80" />
        </g>
      )}

      {v.accessory === "cap" && (
        <g>
          <path d="M48 47 Q90 18 132 47 L126 59 Q90 43 54 59Z" fill="#4D83B5" stroke="#34423D" strokeWidth="3" />
          <path d="M124 50 Q146 51 153 60 Q134 65 120 60Z" fill="#356A98" stroke="#34423D" strokeWidth="3" />
        </g>
      )}

      {v.accessory === "flower" && (
        <g transform="translate(126 45)">
          <circle cx="0" cy="-8" r="7" fill="#F29AB5" />
          <circle cx="8" cy="0" r="7" fill="#F29AB5" />
          <circle cx="0" cy="8" r="7" fill="#F29AB5" />
          <circle cx="-8" cy="0" r="7" fill="#F29AB5" />
          <circle cx="0" cy="0" r="5" fill="#F6C95E" />
        </g>
      )}

      {v.accessory === "scarf" && (
        <g>
          <path d="M53 116 Q90 130 127 116 L125 132 Q90 145 55 132Z" fill="#E7A5C2" stroke="#34423D" strokeWidth="3" />
          <path d="M111 128 L127 151 L113 151 L103 132Z" fill="#D989AE" stroke="#34423D" strokeWidth="3" />
        </g>
      )}

      {v.accessory === "bell" && (
        <g>
          <path d="M75 124 Q90 116 105 124 L102 139 Q90 146 78 139Z" fill="#F6C95E" stroke="#34423D" strokeWidth="3" />
          <circle cx="90" cy="141" r="4" fill="#B7831E" />
        </g>
      )}
    </svg>
  );
}
