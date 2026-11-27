import Link from "next/link";
import {
  BookOpen, Home, ShoppingBag, UserRound,
  GraduationCap, LogOut
} from "lucide-react";
import CatMascot from "@/components/CatMascot";
import DailyHeartSync from "@/components/DailyHeartSync";
import GamificationIcon from "@/components/GamificationIcon";
import AccessibilityMenuButton from "@/components/AccessibilityMenuButton";
import { signOut } from "@/app/actions";

const links = [
  { href: "/dashboard", label: "Beranda", shortLabel: "Beranda", icon: Home, key: "/dashboard" },
  { href: "/lessons", label: "Materi", shortLabel: "Materi", icon: BookOpen, key: "/lessons" },
  { href: "/outcomes", label: "Capaian", shortLabel: "Capaian", icon: GraduationCap, key: "/outcomes" },
  { href: "/shop", label: "Toko hadiah", shortLabel: "Toko", icon: ShoppingBag, key: "/shop" },
  { href: "/profile", label: "Profil", shortLabel: "Profil", icon: UserRound, key: "/profile" }
];

function isLinkActive(active: string | undefined, key: string) {
  if (!active) return false;
  if (key === "/lessons") {
    return active === "/lessons" || active.startsWith("/lessons/") || active === "/practice";
  }
  return active === key;
}

function NavItems({ active, role, mobile = false }: { active?: string; role: string; mobile?: boolean }) {
  return <>
    {links.map((item) => {
      const Icon = item.icon;
      const isActive = isLinkActive(active, item.key);
      return (
        <Link
          key={item.key}
          href={item.href}
          className={`${mobile ? "mobile-nav-link" : "sidebar-nav-link"} ${isActive ? "active" : ""}`}
          aria-current={isActive ? "page" : undefined}
          aria-label={item.label}
          title={item.label}
        >
          <Icon size={mobile ? 20 : 21} strokeWidth={2.2} aria-hidden="true" />
          <span>{mobile ? item.shortLabel : item.label}</span>
        </Link>
      );
    })}
    {(role === "teacher" || role === "admin") && (
      <Link href="/teacher" className={`${mobile ? "mobile-nav-link" : "sidebar-nav-link"} ${active === "/teacher" ? "active" : ""}`} aria-current={active === "/teacher" ? "page" : undefined}>
        <BookOpen size={mobile ? 20 : 21} aria-hidden="true" />
        <span>{mobile ? "Guru" : "Ruang Guru"}</span>
      </Link>
    )}
    <AccessibilityMenuButton mobile={mobile} />
  </>;
}

export default function AppShell({
  children,
  active,
  role = "student",
  stats
}: {
  children: React.ReactNode;
  active?: string;
  role?: string;
  stats?: { streak?: number; diamonds?: number; hearts?: number };
}) {
  return (
    <div className="app-shell-root">
      <DailyHeartSync />

      <aside className="desktop-sidebar" aria-label="Navigasi utama ARABEEZA">
        <Link href="/dashboard" className="sidebar-brand" aria-label="Arabeeza beranda">
          <CatMascot size={48} />
          <span>arabeeza<span>.</span></span>
        </Link>
        <p className="sidebar-section-label">MENU BELAJAR</p>
        <nav className="desktop-sidebar-nav">
          <NavItems active={active} role={role} />
        </nav>
        <div className="sidebar-bottom-area">
          <div className="sidebar-bottom-note">
            <CatMascot mood="happy" size={46} />
            <p>Belajar sedikit demi sedikit. Kamu pasti bisa!</p>
          </div>
          <form action={signOut} className="sidebar-logout-form">
            <button type="submit" className="sidebar-logout-button">
              <LogOut size={20} strokeWidth={2.2} aria-hidden="true" />
              <span>Keluar</span>
            </button>
          </form>
        </div>
      </aside>

      <div className="app-content-area">
        <header className="app-header mobile-app-header">
          <div className="app-header-main">
            <Link href="/dashboard" className="app-brand" aria-label="Arabeeza beranda">
              <CatMascot size={42} />
              <span className="app-brand-name">arabeeza<span className="app-brand-dot">.</span></span>
            </Link>
            <div className="header-stats" aria-label="Statistik singkat">
              {stats?.streak !== undefined && <span className="stat-pill header-stat-pill" aria-label={`${stats.streak} hari streak`}><GamificationIcon kind="streak" size={23}/><b>{stats.streak}</b></span>}
              {stats?.diamonds !== undefined && <span className="stat-pill header-stat-pill" aria-label={`${stats.diamonds} berlian`}><GamificationIcon kind="diamond" size={23}/><b>{stats.diamonds}</b></span>}
              {stats?.hearts !== undefined && <span className="stat-pill header-stat-pill" aria-label={`${stats.hearts} nyawa`}><GamificationIcon kind="heart" size={23}/><b>{stats.hearts}</b></span>}
            </div>
          </div>
          <nav className={`mobile-nav ${role === "teacher" || role === "admin" ? "has-teacher-link" : ""}`} aria-label="Navigasi utama">
            <NavItems active={active} role={role} mobile />
          </nav>
        </header>

        <main id="main-content" tabIndex={-1} className="page-wrap app-main">{children}</main>
        <footer className="page-wrap app-footer">
          Arabeeza · Belajar Bahasa Arab dengan menyenangkan
        </footer>
      </div>
    </div>
  );
}
