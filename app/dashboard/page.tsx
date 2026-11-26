import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Sparkles, Trophy, MessageCircle, Handshake, UserRound, CircleHelp,
  BookOpen, Headphones, PencilLine, Lock, Star, ArrowRight
} from "lucide-react";
import AppShell from "@/components/AppShell";
import CatMascot from "@/components/CatMascot";
import GamificationIcon from "@/components/GamificationIcon";
import { createClient } from "@/lib/supabase/server";
import type { Lesson, Profile } from "@/lib/types";

export const dynamic = "force-dynamic";

const levelSteps = [
  { level: 1, label: "Salam", icon: MessageCircle },
  { level: 2, label: "Perkenalan", icon: Handshake },
  { level: 3, label: "Kata ganti", icon: UserRound },
  { level: 4, label: "Kata tanya", icon: CircleHelp },
  { level: 5, label: "Kosakata", icon: BookOpen },
  { level: 6, label: "Dialog", icon: Headphones },
  { level: 7, label: "Praktik", icon: PencilLine }
];

const levelOffsets = [0, 30, 52, 26, -26, -48, -16];

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  await supabase.rpc("refresh_daily_hearts");

  const [{ data: profileData }, { data: lessonsData }, { data: stageProgressData }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("lessons").select("*").eq("slug", "at-taaruf").eq("is_published", true).order("sort_order").limit(1),
    supabase.from("stage_progress").select("lesson_id,level_no,completed_sessions,best_score,best_stars").eq("user_id", user.id)
  ]);

  const profile = (profileData || {
    display_name: user.user_metadata?.display_name || "Teman Arabeeza",
    role: "student", xp: 0, diamonds: 0, hearts: 5, streak_count: 0
  }) as Profile;
  const lessons = (lessonsData || []) as Lesson[];
  const stageProgress = stageProgressData || [];
  const activeLesson = lessons[0];
  const getStageProgress = (levelNo: number) =>
    stageProgress.find((item: any) => item.lesson_id === activeLesson?.id && item.level_no === levelNo);
  const totalStars = stageProgress
    .filter((item: any) => item.lesson_id === activeLesson?.id)
    .reduce((total: number, item: any) => total + Number(item.best_stars || 0), 0);
  const completedStages = stageProgress
    .filter((item: any) => item.lesson_id === activeLesson?.id && Number(item.completed_sessions || 0) > 0).length;

  return (
    <AppShell active="/dashboard" role={profile.role} stats={{ streak: profile.streak_count, diamonds: profile.diamonds, hearts: profile.hearts }}>
      <div className="dashboard-layout">
        <div className="dashboard-main-column">
          {lessons.length === 0 ? (
            <div className="surface p-8 text-center">
              <Sparkles className="mx-auto text-[#762b40]" size={30} />
              <h3 className="mt-3 font-black">Materi belum tersedia</h3>
              <p className="mt-2 text-sm text-[#806f73]">Jalankan file supabase/seed.sql untuk memasukkan materi awal At-Ta‘āruf.</p>
            </div>
          ) : (
            <>
              <section className="unit-banner dashboard-unit-banner">
                <div className="min-w-0">
                  <p className="unit-banner-kicker">BAB 1</p>
                  <h1 className="mt-1 text-2xl font-black md:text-3xl">At-Ta‘āruf</h1>
                  <p className="mt-1 text-sm font-bold text-white/95">Perkenalan · التَّعَارُفُ</p>
                </div>
              </section>

              <div className="level-path-caption">
                <span>7 tahap · 15 soal per tahap</span>
                <span className="level-scroll-hint">Geser halaman untuk melihat semua tahap ↓</span>
              </div>

              <section className="surface dashboard-path-panel">
                <nav className="learning-path" aria-label="Tujuh tahap latihan At-Ta‘āruf">
                  {levelSteps.map((step, index) => {
                    const Icon = step.icon;
                    const stage = getStageProgress(step.level);
                    const completed = Number(stage?.completed_sessions || 0) > 0;
                    const previousStage = step.level === 1 ? null : getStageProgress(step.level - 1);
                    const unlocked = step.level === 1 || Number(previousStage?.completed_sessions || 0) > 0;
                    const stars = Number(stage?.best_stars || 0);
                    const target = `/practice/${activeLesson?.slug}?mode=mixed&level=${step.level}`;

                    return (
                      <div
                        key={step.level}
                        className={`level-step ${completed ? "is-completed" : unlocked ? "is-unlocked" : "is-locked"}`}
                        style={{ marginLeft: `calc(50% + ${levelOffsets[index]}px - 70px)` }}
                      >
                        {unlocked ? (
                          <Link
                            href={target}
                            className="level-hit-area"
                            aria-label={`${completed ? "Ulangi" : "Mulai"} tahap ${step.level}: ${step.label}`}
                            title={step.label}
                          >
                            <span className={`level-node level-node-${step.level} ${completed ? "has-played" : "is-current"}`}>
                              <Icon size={29} strokeWidth={2.7} aria-hidden="true" />
                            </span>
                          </Link>
                        ) : (
                          <div className="level-hit-area is-locked" role="group" aria-label={`Tahap ${step.level}: ${step.label}, terkunci. Selesaikan tahap sebelumnya untuk membuka.`} aria-disabled="true" title="Selesaikan tahap sebelumnya untuk membuka tahap ini">
                            <span className="level-node is-locked">
                              <Lock size={23} strokeWidth={2.7} aria-hidden="true" />
                            </span>
                          </div>
                        )}

                        <div className="level-stars" role="img" aria-label={`${stars} dari 3 bintang`}>
                          {[1, 2, 3].map((star) => (
                            <Star
                              key={star}
                              size={18}
                              className={star <= stars ? "level-star earned" : "level-star"}
                              fill={star <= stars ? "currentColor" : "none"}
                              aria-hidden="true"
                            />
                          ))}
                        </div>
                        <span className="level-label">{step.label}</span>
                      </div>
                    );
                  })}
                </nav>
                <div className="dashboard-path-footer">
                  <span>105 soal · 7 tahap pembelajaran</span>
                  <span>Ulangi tahap kapan saja untuk memperbaiki bintang</span>
                </div>
              </section>

              <section className="dashboard-tip-card">
                <div>
                  <p className="material-kicker">TIPS HARI INI</p>
                  <h2 className="mt-1 text-lg font-black">اِسْتَمِرَّ فِي التَّعَلُّمِ</h2>
                  <p className="mt-1 text-sm">Teruslah belajar sedikit demi sedikit. Konsistensi lebih penting daripada terburu-buru.</p>
                </div>
                <span aria-hidden="true">✦</span>
              </section>
            </>
          )}
        </div>

        <aside className="dashboard-side-column" aria-label="Ringkasan belajar">
          <section className="dashboard-welcome-card">
            <div className="min-w-0">
              <p className="dashboard-eyebrow">مَرْحَبًا · MARHABAN!</p>
              <h2>Halo, {profile.display_name}! 👋</h2>
              <p>Senang bertemu kembali. Siap belajar Bahasa Arab hari ini?</p>
            </div>
            <CatMascot mood="happy" size={66} className="dashboard-welcome-cat" />
          </section>

          <section className="surface dashboard-stats-panel">
            <div className="dashboard-panel-heading">
              <h2>Statistik belajar</h2>
              <span>PROGRESMU</span>
            </div>
            <div className="dashboard-stats-grid">
              <div className="dashboard-stat-card">
                <GamificationIcon kind="streak" size={34} />
                <div><strong>{profile.streak_count}</strong><span>Hari streak</span></div>
              </div>
              <div className="dashboard-stat-card">
                <GamificationIcon kind="diamond" size={34} />
                <div><strong>{profile.diamonds.toLocaleString("id-ID")}</strong><span>Berlian</span></div>
              </div>
              <div className="dashboard-stat-card">
                <GamificationIcon kind="heart" size={34} />
                <div><strong>{profile.hearts}/5</strong><span>Nyawa</span></div>
              </div>
              <div className="dashboard-stat-card">
                <GamificationIcon kind="star" size={34} />
                <div><strong>{totalStars}</strong><span>Total bintang terbaik</span></div>
              </div>
            </div>
          </section>

          <section className="surface dashboard-xp-panel">
            <div className="flex items-center justify-between gap-3">
              <div><p className="dashboard-eyebrow">TOTAL PENGALAMAN</p><div className="dashboard-xp-value">{profile.xp.toLocaleString("id-ID")} <span>XP</span></div></div>
              <GamificationIcon kind="xp" size={43} />
            </div>
            <div className="progress-track mt-4" role="progressbar" aria-label="Progres menuju 500 XP berikutnya" aria-valuemin={0} aria-valuemax={500} aria-valuenow={profile.xp % 500}>
              <div className="progress-fill" style={{ width: `${(profile.xp % 500) / 5}%` }} />
            </div>
            <p className="mt-2 text-xs text-[#806f73]">Menuju target 500 XP berikutnya</p>
            <Link href="/outcomes" className="dashboard-side-link"><Trophy size={17} /> Lihat capaian pembelajaran <ArrowRight size={16} /></Link>
          </section>

          <section className="dashboard-progress-card">
            <div className="flex items-center justify-between gap-3"><span>Progres Bab 1</span><strong>{completedStages}/7 tahap</strong></div>
            <div className="progress-track mt-3"><div className="progress-fill" style={{ width: `${(completedStages / 7) * 100}%` }} /></div>
            <p className="mt-2 text-xs">Selesaikan tahap secara berurutan dan kumpulkan bintang terbaikmu.</p>
          </section>
        </aside>
      </div>
    </AppShell>
  );
}
