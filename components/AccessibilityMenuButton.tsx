"use client";

import { Accessibility } from "lucide-react";

export default function AccessibilityMenuButton({ mobile = false }: { mobile?: boolean }) {
  return (
    <button
      type="button"
      className={mobile ? "mobile-nav-link" : "sidebar-nav-link"}
      aria-label="Buka pengaturan aksesibilitas"
      onClick={() => window.dispatchEvent(new Event("arabeeza:open-accessibility"))}
    >
      <Accessibility size={mobile ? 20 : 21} strokeWidth={2.2} aria-hidden="true" />
      <span>{mobile ? "Akses" : "Aksesibilitas"}</span>
    </button>
  );
}
