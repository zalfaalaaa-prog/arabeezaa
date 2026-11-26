import React from "react";

export type CatAvatarPreset =
  | "moka"
  | "luna"
  | "cici"
  | "nala"
  | "mimi"
  | "oyen"
  | "bimo"
  | "leo"
  | "kiko"
  | "raka";

type CatAvatarProps = {
  preset?: CatAvatarPreset;
  size?: number;
  className?: string;
  expression?: "senyum" | "ceria" | "serius";
};

type CatStyle = {
  fur: string;
  ear: string;
  outfit: string;
  accent: string;
  accessory: "bow" | "glasses" | "cap" | "flower" | "scarf" | "bell" | "headphones" | "bandana" | "bowtie" | "badge";
  pattern: "none" | "tabby" | "tuxedo" | "patch" | "mask";
};

const presets: Record<CatAvatarPreset, CatStyle> = {
  moka: { fur: "#F4E2CC", ear: "#E6B7A0", outfit: "#762B40", accent: "#D7B66F", accessory: "bow", pattern: "none" },
  luna: { fur: "#DCCBF0", ear: "#C7A9E3", outfit: "#4D1C2B", accent: "#B77C8C", accessory: "glasses", pattern: "patch" },
  cici: { fur: "#F2B47F", ear: "#E8946D", outfit: "#8F465B", accent: "#D7B66F", accessory: "cap", pattern: "tabby" },
  nala: { fur: "#BFC7D8", ear: "#9FAAC2", outfit: "#762B40", accent: "#F1E1E4", accessory: "flower", pattern: "patch" },
  mimi: { fur: "#F6D8D4", ear: "#ECAEB2", outfit: "#93475D", accent: "#F1C9D2", accessory: "scarf", pattern: "none" },
  oyen: { fur: "#E69A55", ear: "#D67B40", outfit: "#762B40", accent: "#D7B66F", accessory: "bell", pattern: "tabby" },
  bimo: { fur: "#7D8796", ear: "#5D6675", outfit: "#4D1C2B", accent: "#D7B66F", accessory: "headphones", pattern: "tuxedo" },
  leo: { fur: "#E9A05A", ear: "#D77D3D", outfit: "#A35C70", accent: "#D7B66F", accessory: "cap", pattern: "tabby" },
  kiko: { fur: "#F4F2E9", ear: "#C9C9C4", outfit: "#762B40", accent: "#D7B66F", accessory: "bandana", pattern: "tuxedo" },
  raka: { fur: "#A96E50", ear: "#845039", outfit: "#4D1C2B", accent: "#D7B66F", accessory: "bowtie", pattern: "mask" }
};

export function getCatPresetFromAvatar(skin?: string, outfit?: string, expression?: string): CatAvatarPreset {
  if (skin === "cerah" && outfit === "ungu") return "luna";
  if (skin === "kuning-langsat" && outfit === "oranye") return "cici";
  if (skin === "cokelat" && outfit === "biru") return "nala";
  if (skin === "cerah" && outfit === "hijau" && expression === "ceria") return "mimi";
  if (skin === "cokelat" && outfit === "oranye") return "oyen";
  if (skin === "sawo-matang" && outfit === "biru") return "bimo";
  if (skin === "kuning-langsat" && outfit === "hijau") return "leo";
  if (skin === "cerah" && outfit === "oranye") return "kiko";
  if (skin === "cokelat" && outfit === "ungu") return "raka";
  return "moka";
}

export function getCatPresetValues(preset: CatAvatarPreset) {
  const values: Record<CatAvatarPreset, {
    skin: string;
    outfit: string;
    expression: "senyum" | "ceria" | "serius";
    gender: "laki-laki" | "perempuan";
  }> = {
    moka: { skin: "sawo-matang", outfit: "hijau", expression: "senyum", gender: "perempuan" },
    luna: { skin: "cerah", outfit: "ungu", expression: "ceria", gender: "perempuan" },
    cici: { skin: "kuning-langsat", outfit: "oranye", expression: "ceria", gender: "perempuan" },
    nala: { skin: "cokelat", outfit: "biru", expression: "serius", gender: "perempuan" },
    mimi: { skin: "cerah", outfit: "hijau", expression: "ceria", gender: "perempuan" },
    oyen: { skin: "cokelat", outfit: "oranye", expression: "senyum", gender: "laki-laki" },
    bimo: { skin: "sawo-matang", outfit: "biru", expression: "serius", gender: "laki-laki" },
    leo: { skin: "kuning-langsat", outfit: "hijau", expression: "senyum", gender: "laki-laki" },
    kiko: { skin: "cerah", outfit: "oranye", expression: "serius", gender: "laki-laki" },
    raka: { skin: "cokelat", outfit: "ungu", expression: "senyum", gender: "laki-laki" }
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
  const face = expression || (preset === "nala" || preset === "bimo" || preset === "kiko" ? "serius" : preset === "cici" || preset === "mimi" ? "ceria" : "senyum");

  return (
    <svg
      className={`cat-avatar-svg ${className}`}
      width={size}
      height={size}
      viewBox="0 0 180 180"
      role="img"
      aria-label="Ilustrasi karakter kucing Arabeeza"
    >
      <ellipse cx="90" cy="163" rx="54" ry="10" fill="#2E4D42" opacity=".10" />
      <path d="M49 107 Q42 137 54 151 Q68 164 90 164 Q112 164 126 151 Q138 137 131 107Z" fill={v.outfit} stroke="#4D1C2B" strokeWidth="4" />
      <path d="M57 112 Q42 126 49 143" fill="none" stroke={v.accent} strokeWidth="10" strokeLinecap="round" opacity=".9" />
      <path d="M123 112 Q138 126 131 143" fill="none" stroke={v.accent} strokeWidth="10" strokeLinecap="round" opacity=".9" />
      {v.pattern === "tuxedo" && <path d="M66 118 Q90 108 114 118 L110 153 Q90 161 70 153Z" fill="#FFFDF6" stroke="#4D1C2B" strokeWidth="2.5" />}

      <path d="M43 67 C38 57 38 42 43 31 C52 32 62 39 68 48 C82 43 98 43 112 48 C118 39 128 32 137 31 C142 42 142 57 137 67 C146 80 146 98 138 112 C128 128 110 137 90 137 C70 137 52 128 42 112 C34 98 34 80 43 67Z" fill={v.fur} stroke="#4D1C2B" strokeWidth="4" strokeLinejoin="round" />
      <path d="M47 56 C44 46 45 38 48 35 C56 39 62 44 66 51Z M114 51 C118 44 124 39 132 35 C135 38 136 46 133 56Z" fill={v.ear} />

      {v.pattern === "tabby" && (
        <g fill="none" stroke="#9A5C35" strokeWidth="4" strokeLinecap="round" opacity=".82">
          <path d="M78 48 L83 59 M90 45 L90 58 M102 48 L97 59" />
          <path d="M42 88 L55 91 M41 99 L55 99 M138 88 L125 91 M139 99 L125 99" />
        </g>
      )}
      {v.pattern === "patch" && <path d="M44 65 Q49 49 71 48 Q68 69 78 81 Q65 91 46 84Z" fill="#FFFDF6" opacity=".88" />}
      {v.pattern === "tuxedo" && <path d="M42 65 Q53 47 77 47 Q73 72 77 90 Q61 96 43 86Z" fill="#4A4D54" opacity=".92" />}
      {v.pattern === "mask" && <path d="M49 72 Q90 54 131 72 L126 94 Q90 104 54 94Z" fill="#5C4037" opacity=".72" />}

      <ellipse cx="67" cy="83" rx="10" ry="13" fill="#263B35" />
      <ellipse cx="113" cy="83" rx="10" ry="13" fill="#263B35" />
      <circle cx="70" cy="79" r="3.5" fill="white" />
      <circle cx="116" cy="79" r="3.5" fill="white" />

      {face === "serius" ? (
        <>
          <path d="M57 67 L73 63" stroke="#4D1C2B" strokeWidth="4" strokeLinecap="round" />
          <path d="M107 63 L123 67" stroke="#4D1C2B" strokeWidth="4" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M57 65 Q66 60 74 64" stroke="#4D1C2B" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M106 64 Q114 60 123 65" stroke="#4D1C2B" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      )}

      <path d="M84 98 Q90 92 96 98 Q90 106 84 98Z" fill="#EF8E9E" />
      {face === "serius"
        ? <path d="M82 113 Q90 109 98 113" fill="none" stroke="#4D1C2B" strokeWidth="3" strokeLinecap="round" />
        : face === "ceria"
          ? <path d="M76 105 Q90 126 104 105 Q100 121 90 121 Q80 121 76 105Z" fill="#34423D" />
          : <path d="M77 106 Q90 121 103 106" fill="none" stroke="#4D1C2B" strokeWidth="3.5" strokeLinecap="round" />
      }
      <g fill="#F29AA5" opacity={face === "ceria" ? ".78" : ".48"}><ellipse cx="51" cy="103" rx="8" ry="4.5"/><ellipse cx="129" cy="103" rx="8" ry="4.5"/></g>
      <path d="M39 94 L16 89 M40 103 L15 105 M141 94 L164 89 M140 103 L165 105" stroke="#68756F" strokeWidth="2.5" strokeLinecap="round" />

      {v.accessory === "bow" && (
        <g transform="translate(90 31)">
          <path d="M0 4 C-18 -12 -31 -5 -26 7 C-21 18 -8 14 0 7Z" fill="#762B40" stroke="#4D1C2B" strokeWidth="3" />
          <path d="M0 4 C18 -12 31 -5 26 7 C21 18 8 14 0 7Z" fill="#762B40" stroke="#4D1C2B" strokeWidth="3" />
          <circle cx="0" cy="6" r="7" fill="#D7B66F" stroke="#4D1C2B" strokeWidth="3" />
        </g>
      )}
      {v.accessory === "glasses" && (
        <g fill="none" stroke="#762B40" strokeWidth="5"><rect x="51" y="72" width="32" height="24" rx="8"/><rect x="97" y="72" width="32" height="24" rx="8"/><path d="M83 80 Q90 76 97 80"/></g>
      )}
      {v.accessory === "cap" && (
        <g><path d="M48 47 Q90 18 132 47 L126 59 Q90 43 54 59Z" fill="#762B40" stroke="#4D1C2B" strokeWidth="3"/><path d="M124 50 Q146 51 153 60 Q134 65 120 60Z" fill="#4D1C2B" stroke="#4D1C2B" strokeWidth="3"/></g>
      )}
      {v.accessory === "flower" && (
        <g transform="translate(126 45)"><circle cx="0" cy="-8" r="7" fill="#F29AB5"/><circle cx="8" cy="0" r="7" fill="#F29AB5"/><circle cx="0" cy="8" r="7" fill="#F29AB5"/><circle cx="-8" cy="0" r="7" fill="#F29AB5"/><circle cx="0" cy="0" r="5" fill="#F6C95E"/></g>
      )}
      {v.accessory === "scarf" && (
        <g><path d="M53 116 Q90 130 127 116 L125 132 Q90 145 55 132Z" fill="#E7A5C2" stroke="#4D1C2B" strokeWidth="3"/><path d="M111 128 L127 151 L113 151 L103 132Z" fill="#D989AE" stroke="#4D1C2B" strokeWidth="3"/></g>
      )}
      {v.accessory === "bell" && (
        <g><path d="M75 124 Q90 116 105 124 L102 139 Q90 146 78 139Z" fill="#D7B66F" stroke="#4D1C2B" strokeWidth="3"/><circle cx="90" cy="141" r="4" fill="#B7831E"/></g>
      )}
      {v.accessory === "headphones" && (
        <g fill="none" stroke="#4D1C2B" strokeWidth="7" strokeLinecap="round"><path d="M43 83 Q42 38 90 36 Q138 38 137 83"/><path d="M42 77 L42 100 M138 77 L138 100" stroke={v.accent} strokeWidth="13"/></g>
      )}
      {v.accessory === "bandana" && (
        <g><path d="M49 112 Q90 128 131 112 L119 137 Q90 148 61 137Z" fill="#F4C65E" stroke="#4D1C2B" strokeWidth="3"/><path d="M111 131 L133 151 L114 151 L101 136Z" fill="#E9AA43" stroke="#4D1C2B" strokeWidth="3"/></g>
      )}
      {v.accessory === "bowtie" && (
        <g><path d="M90 124 L69 115 Q65 130 73 137 L90 130 L107 137 Q115 130 111 115Z" fill="#F4C65E" stroke="#4D1C2B" strokeWidth="3"/><circle cx="90" cy="126" r="6" fill="#E78A63" stroke="#4D1C2B" strokeWidth="2"/></g>
      )}
      {v.accessory === "badge" && (
        <g><circle cx="90" cy="130" r="13" fill="#F6D16C" stroke="#4D1C2B" strokeWidth="3"/><path d="M90 121 L93 127 L100 128 L95 133 L96 140 L90 136 L84 140 L85 133 L80 128 L87 127Z" fill="#fff"/></g>
      )}
    </svg>
  );
}
