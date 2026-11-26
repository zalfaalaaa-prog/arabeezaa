import { Flame, Heart, Zap } from "lucide-react";
import GamificationIcon from "@/components/GamificationIcon";

export function StatPill({ kind, value }: { kind: "streak" | "diamonds" | "hearts" | "xp"; value: number }) {
  const map = {
    streak: { icon: Flame, color: "text-orange-500" },
    hearts: { icon: Heart, color: "text-rose-500" },
    xp: { icon: Zap, color: "text-amber-500" }
  };

  if (kind === "diamonds") {
    return <span className="stat-pill text-sky-500"><GamificationIcon kind="diamond" size={16} />{value.toLocaleString("id-ID")}</span>;
  }

  const Icon = map[kind].icon;
  return <span className={`stat-pill ${map[kind].color}`}><Icon size={16} fill={kind === "hearts" ? "currentColor" : "none"} />{value.toLocaleString("id-ID")}</span>;
}
