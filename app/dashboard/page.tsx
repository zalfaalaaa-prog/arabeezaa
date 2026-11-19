import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Flame, Gem, Heart, Sparkles, Trophy, MessageCircle, Handshake,
  UserRound, CircleHelp, BookOpen, Headphones, PencilLine, Lock, Star
} from "lucide-react";
import AppShell from "@/components/AppShell";
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

  const [{ data: profileData }, { data: lessonsData }, { data: progressData }, stageProgressResult] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("lessons").select("*").eq("is_published", true).order("sort_order"),
    supabase.from("lesson_progress").select("*").eq("user_id", user.id),
    supabase.from("stage_progress").select("lesson_id,level_no,completed_sessions,best_score,best_stars").eq("user_id", user.id)
  ]);

  const profile = (profileData || {
    display_name: user.user_metadata?.display_name || "Teman Arabeeza",
    role: "student", xp: 0, diamonds: 0, hearts: 5, streak_count: 0
  }) as Profile;
  const lessons = (lessonsData || []) as Lesson[];
  const progress = progressData || [];
  const stageProgress = stageProgressResult.data || [];
  const activeLesson = lessons[0];
  const getProgress = (lessonId: string) => progress.find((item: any) => item.lesson_id === lessonId);
  const getStageProgress = (levelNo: number) =>
    stageProgress.find((item: any) => item.lesson_id === activeLesson?.id && item.level_no === levelNo);

  return (
    <AppShell active="/dashboard" role={profile.role} stats={{ streak: profile.streak_count, diamonds: profile.diamonds, hearts: profile.hearts }}>
      <section className="mb-7 grid gap-5 md:grid-cols-[1.5fr_.8fr]">
        <div className="rounded-[26px] bg-[#edf4e8] p-6 md:p-8">
          <p className="text-xs font-black tracking-[.16em] text-[#6f8f70]">مَرْحَبًا · MARHABAN!</p>
          <h1 className="mt-2 text-3xl font-black">Halo, {profile.display_name} 👋</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#5f705f]">
            Lanjutkan perjalanan Bahasa Arabmu. Buka tahap satu per satu, kumpulkan bintang terbaik, dan ulangi tahap kapan saja untuk memperbaiki skor.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="stat-pill"><Flame size={16} className="text-[#d88962]" /> {profile.streak_count} hari streak</span>
            <span className="stat-pill"><Gem size={16} className="text-sky-500" /> {profile.diamonds} berlian</span>
            <span className="stat-pill"><Heart size={16} className="text-rose-500" fill="currentColor" /> {profile.hearts}/5 nyawa</span>
          </div>
        </div>
        <div className="surface flex flex-col justify-between p-6">
          <div>
            <span className="text-xs font-black tracking-[.15em] text-[#8a9890]">TOTAL PENGALAMAN</span>
            <div className="mt-2 flex items-end gap-2">
              <strong className="text-4xl font-black">{profile.xp.toLocaleString("id-ID")}</strong>
              <span className="pb-1 text-sm font-bold text-[#6f8f70]">XP</span>
            </div>
            <div className="progress-track mt-4" role="progressbar" aria-label="Progres menuju 500 XP berikutnya" aria-valuemin={0} aria-valuemax={500} aria-valuenow={profile.xp % 500}><div className="progress-fill" style={{ width: `${(profile.xp % 500) / 5}%` }} /></div>
            <p className="mt-2 text-xs text-[#8a9890]">Menuju target 500 XP berikutnya</p>
          </div>
          <Link href="/outcomes" className="mt-5 flex items-center gap-2 text-sm font-extrabold text-[#6f8f70]">
            <Trophy size={17} /> Lihat capaian pembelajaran <span>→</span>
          </Link>
        </div>
      </section>

      {lessons.length === 0 ? (
        <div className="surface p-8 text-center">
          <Sparkles className="mx-auto text-[#7e9d7b]" size={30} />
          <h3 className="mt-3 font-black">Materi belum tersedia</h3>
          <p className="mt-2 text-sm text-[#718078]">Jalankan file supabase/seed.sql untuk memasukkan materi awal At-Ta‘āruf.</p>
        </div>
      ) : (
        <section className="surface p-4 md:p-6">
          <div className="unit-banner unit-banner-sticky mb-3">
            <div className="min-w-0">
              <p className="unit-banner-kicker">BAGIAN 1 · UNIT 1</p>
              <h2 className="mt-1 text-xl font-black md:text-2xl">At-Ta‘āruf</h2>
              <p className="mt-1 text-sm font-bold text-white/95">Perkenalan · التَّعَارُفُ</p>
              <p className="mt-2 text-xs leading-5 text-white/85">
                Ikuti jalur belajar, buka tahap baru, dan kumpulkan tiga bintang terbaik.
              </p>
            </div>
            <div className="unit-banner-icon" aria-hidden="true"><BookOpen size={31} strokeWidth={2.5} /></div>
          </div>

          <div className="level-path-caption">
            <span>7 tahap · 15 soal per tahap</span>
            <span className="level-scroll-hint">Geser halaman untuk melihat semua tahap ↓</span>
          </div>

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

          <div className="mt-4 rounded-2xl bg-[#f7faf6] px-4 py-3 text-center text-xs font-semibold text-[#89968f]">
            <span>105 soal · 4 maharah</span>
            <span className="mx-2 text-[#c8cec9]">•</span>
            <span>Ulangi tahap kapan saja untuk memperbaiki bintang</span>
          </div>

          {stageProgressResult.error && (
            <p className="mt-4 rounded-xl bg-[#fff6df] p-3 text-xs leading-5 text-[#98702b]">
              Fitur bintang dan pembukaan level memerlukan migration 005. Jalankan file <strong>supabase/migrations/005_stage_progress.sql</strong> di Supabase SQL Editor.
            </p>
          )}
        </section>
      )}

      {lessons.length > 0 && (
        <section className="mt-7 rounded-[24px] bg-[#f6ebe4] p-5 md:p-6">
          <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-black tracking-[.16em] text-[#a76d50]">TIPS HARI INI</p>
              <h3 className="mt-1 text-lg font-black">اِسْتَمِرَّ فِي التَّعَلُّمِ</h3>
              <p className="mt-1 text-sm text-[#785a4a]">Teruslah belajar sedikit demi sedikit. Konsistensi lebih penting daripada terburu-buru.</p>
            </div>
            <span className="text-4xl">🌱</span>
          </div>
        </section>
      )}
    </AppShell>
  );
}
