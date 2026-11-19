import Link from "next/link";
import { BookOpen, Flame, Gem, Heart, Home, ShoppingBag, UserRound, GraduationCap } from "lucide-react";
import CatMascot from "@/components/CatMascot";
import DailyHeartSync from "@/components/DailyHeartSync";

const links = [
  { href: "/dashboard", label: "Beranda", icon: Home },
  { href: "/lessons/at-taaruf", label: "Materi", icon: BookOpen },
  { href: "/outcomes", label: "Capaian", icon: GraduationCap },
  { href: "/shop", label: "Toko", icon: ShoppingBag },
  { href: "/profile", label: "Profil", icon: UserRound }
];

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
    <div className="app-shell-root min-h-screen">
      <DailyHeartSync />
      <header className="app-header sticky top-0 z-30 border-b border-[#e7eee8] bg-white/95 backdrop-blur">
        <div className="page-wrap app-header-main">
          <Link href="/dashboard" className="app-brand" aria-label="Arabeeza beranda">
            <CatMascot size={44}/>
            <span className="app-brand-name">arabeeza<span className="text-[#45ad78]">.</span></span>
            <span className="language-badge" aria-label="Bahasa Arab" title="Bahasa Arab">🇸🇦</span>
          </Link>
          <nav className="desktop-nav flex items-center gap-5" aria-label="Navigasi utama">
            {links.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.href || (item.href === "/lessons/at-taaruf" && active?.startsWith("/lessons/"));
              return <Link key={item.href} href={item.href} className={`nav-link ${isActive ? "active" : ""}`} aria-current={isActive ? "page" : undefined}><Icon size={17} />{item.label}</Link>;
            })}
            {role === "teacher" || role === "admin" ? <Link href="/teacher" className={`nav-link ${active === "/teacher" ? "active" : ""}`}><BookOpen size={17} />Guru</Link> : null}
          </nav>
          <div className="header-stats">
            {stats?.streak !== undefined && <span className="stat-pill header-stat-pill text-orange-600" aria-label={`${stats.streak} hari streak`}><Flame size={16} />{stats.streak}</span>}
            {stats?.diamonds !== undefined && <span className="stat-pill header-stat-pill text-sky-600" aria-label={`${stats.diamonds} berlian`}><Gem size={16} />{stats.diamonds}</span>}
            {stats?.hearts !== undefined && <span className="stat-pill header-stat-pill text-rose-500" aria-label={`${stats.hearts} nyawa`}><Heart size={16} fill="currentColor" />{stats.hearts}</span>}
          </div>
        </div>
        <nav className="mobile-nav border-t border-[#edf2ee] bg-white px-1 py-2 md:hidden" aria-label="Navigasi utama">
          {links.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.href || (item.href === "/lessons/at-taaruf" && active?.startsWith("/lessons/"));
            return <Link key={item.href} href={item.href} aria-label={item.label} className={`mobile-nav-link ${isActive ? "active" : ""}`} aria-current={isActive ? "page" : undefined}><Icon size={19} /><span>{item.label}</span></Link>;
          })}
        </nav>
      </header>
      <main id="main-content" tabIndex={-1} className="page-wrap app-main py-7 md:py-9">{children}</main>
      <footer className="page-wrap app-footer border-t border-[#e7eee8] py-6 text-center text-xs text-[#89968f]">
        Arabeeza · Belajar Bahasa Arab dengan menyenangkan
      </footer>
    </div>
  );
}
