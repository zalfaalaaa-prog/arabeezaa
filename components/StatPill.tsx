import GamificationIcon from "@/components/GamificationIcon";

export function StatPill({ kind, value }: { kind: "streak" | "diamonds" | "hearts" | "xp"; value: number }) {
  const iconKind = kind === "streak" ? "streak" : kind === "diamonds" ? "diamond" : kind === "hearts" ? "heart" : "xp";
  return (
    <span className={`stat-pill ${kind === "diamonds" ? "text-sky-600" : kind === "hearts" ? "text-rose-500" : kind === "streak" ? "text-orange-500" : "text-amber-600"}`}>
      <GamificationIcon kind={iconKind} size={18} />
      {value.toLocaleString("id-ID")}
    </span>
  );
}
