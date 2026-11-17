import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Flame, Gem, Heart, Sparkles, Trophy, MessageCircle, Handshake,
  UserRound, CircleHelp, BookOpen, Headphones, PencilLine
} from "lucide-react";
import AppShell from "@/components/AppShell";
import LessonCard from "@/components/LessonCard";
import CatMascot from "@/components/CatMascot";
import { createClient } from "@/lib/supabase/server";
import type { Lesson, Profile } from "@/lib/types";

export const dynamic = "force-dynamic";

const levelSteps = [
  { level: 1, label: "Salam", icon: MessageCircle },
  { level: 2, label: "Perkenalan", icon: Handshake },
  { level: 3, label: "Kata ganti", icon: UserRound },
  { level: 4, label: "Kata tanya", icon: CircleHelp },
  { level: 5, label: "Kosakata", icon: BookOpen },
  { level: 6, label: "Memahami dialog", icon: Headphones },
  { level: 7, label: "Praktik", icon: PencilLine }
];

const levelOffsets = [0, 28, 48, 24, -20, -44, -12];

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  await supabase.rpc("refresh_daily_hearts");

  const [{ data: profileData }, { data: lessonsData }, { data: progressData }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("lessons").select("*").eq("is_published", true).order("sort_order"),
    supabase.from("lesson_progress").select("*").eq("user_id", user.id)
  ]);

  const profile = (profileData || { display_name: user.user_metadata?.display_name || "Teman Arabeeza", role: "student", xp: 0, diamonds: 0, hearts: 5, streak_count: 0 }) as Profile;
  const lessons = (lessonsData || []) as Lesson[];
  const progress = progressData || [];
  const getProgress = (lessonId: string) => progress.find((item: any) => item.lesson_id === lessonId);

  return (
    <AppShell active="/dashboard" role={profile.role} stats={{ streak: profile.streak_count, diamonds: profile.diamonds, hearts: profile.hearts }}>
      <section className="mb-8 grid gap-5 md:grid-cols-[1.5fr_.8fr]">
        <div className="rounded-[26px] bg-[#fff0d9] p-6 md:p-8">
          <p className="text-xs font-black tracking-[.16em] text-[#827148]">مَرْحَبًا · MARHABAN!</p>
          <h1 className="mt-2 text-3xl font-black">Halo, {profile.display_name} 👋</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#6d624d]">Siap belajar Bahasa Arab hari ini? Temani kucing Arabeeza melewati tujuh tahap belajar, berlatih empat maharah, dan kumpulkan XP.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="stat-pill"><Flame size={16} className="text-[#e8895f]" /> {profile.streak_count} hari streak</span>
            <span className="stat-pill"><Gem size={16} className="text-sky-500" /> {profile.diamonds} berlian</span>
            <span className="stat-pill"><Heart size={16} className="text-rose-500" fill="currentColor" /> {profile.hearts}/5 nyawa</span>
          </div>
        </div>
        <div className="surface flex flex-col justify-between p-6">
          <div>
            <span className="text-xs font-black tracking-[.15em] text-[#8a9890]">TOTAL PENGALAMAN</span>
            <div className="mt-2 flex items-end gap-2"><strong className="text-4xl font-black">{profile.xp.toLocaleString("id-ID")}</strong><span className="pb-1 text-sm font-bold text-[#e8895f]">XP</span></div>
            <div className="progress-track mt-4"><div className="progress-fill" style={{ width: `${profile.xp % 500 / 5}%` }} /></div>
            <p className="mt-2 text-xs text-[#8a9890]">Menuju target 500 XP berikutnya</p>
          </div>
          <Link href="/outcomes" className="mt-5 flex items-center gap-2 text-sm font-extrabold text-[#827148]"><Trophy size={17} /> Lihat capaian pembelajaran <span>→</span></Link>
        </div>
      </section>

      <div className="mb-5 flex items-end justify-between gap-3">
        <div><p className="text-xs font-black tracking-[.16em] text-[#827148]">JALUR PEMBELAJARAN</p><h2 className="mt-1 text-2xl font-black">Pilih tahap belajarmu</h2></div>
        <span className="rounded-full bg-white px-3 py-2 text-xs font-bold text-[#718078]">{lessons.length} materi tersedia</span>
      </div>

      {lessons.length === 0 ? (
        <div className="surface p-8 text-center"><Sparkles className="mx-auto text-[#e8895f]" size={30} /><h3 className="mt-3 font-black">Materi belum tersedia</h3><p className="mt-2 text-sm text-[#718078]">Jalankan file supabase/seed.sql untuk memasukkan materi awal At-Ta‘āruf.</p></div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1.3fr_.7fr]">
          <section className="surface p-5 md:p-7">
            <div className="mb-5 flex items-center gap-3"><CatMascot mood="happy" size={76} /><div><p className="text-xs font-black tracking-[.16em] text-[#827148]">MATERI 1 · التَّعَارُفُ</p><h3 className="text-xl font-black">At-Ta‘āruf (Perkenalan)</h3><p className="text-xs text-[#718078]">Ikuti jalur belajar dan kumpulkan bintang!</p></div></div>
            <div className="learning-path" aria-label="Tujuh tahap latihan">
              {levelSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Link key={step.level} href={`/practice/${lessons[0].slug}?mode=mixed&level=${step.level}`} className={`level-node level-node-${step.level}`} style={{ marginLeft: `calc(50% + ${levelOffsets[index]}px - 32px)` }} aria-label={`Tahap ${step.level}: ${step.label}`} title={step.label}>
                    <Icon size={26} strokeWidth={2.7} aria-hidden="true" />
                    <span className="sr-only">{step.label}</span>
                  </Link>
                );
              })}
            </div>
            <p className="mt-5 text-center text-xs leading-5 text-[#89968f]">7 tahap latihan · 15 soal di setiap tahap · 105 soal seluruhnya. Setiap tahap memadukan menyimak, berbicara, membaca, dan menulis.</p>
          </section>

          <div className="space-y-4">
            <div className="rounded-[24px] bg-[#eaf2df] p-5">
              <div className="flex items-center gap-3"><BookOpen className="text-[#827148]" size={24} /><h3 className="font-black">Materi 1</h3></div>
              <p className="mt-2 text-sm leading-6 text-[#5f694b]">Pelajari salam, ungkapan perkenalan, kosakata identitas, kata tanya, kata ganti, dialog, teks bacaan, dan penerapannya.</p>
              <Link href={`/lessons/${lessons[0].slug}`} className="mt-4 inline-flex rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-[#827148]">Buka Materi 1 →</Link>
            </div>
            <div className="surface p-5">
              <div className="flex items-center gap-3"><CatMascot mood="celebrate" size={46} /><div><p className="text-xs font-black text-[#827148]">BELAJAR BERSAMA ARABEEZA</p><h3 className="font-black">Empat maharah</h3></div></div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-bold text-[#6d624d]">
                <span className="rounded-xl bg-[#fff0d9] p-3">🎧 Menyimak</span>
                <span className="rounded-xl bg-[#eaf2df] p-3">🗣️ Berbicara</span>
                <span className="rounded-xl bg-[#f8e6dc] p-3">📖 Membaca</span>
                <span className="rounded-xl bg-[#f1eadb] p-3">✍️ Menulis</span>
              </div>
              <Link href="/outcomes" className="mt-3 inline-flex text-sm font-extrabold text-[#827148]">Lihat capaian →</Link>
            </div>
          </div>
        </div>
      )}

      <div className="mt-7 grid gap-4 md:grid-cols-2">
        {lessons.map((lesson) => { const item = getProgress(lesson.id); return <LessonCard key={lesson.id} lesson={lesson} completed={item?.completed_sessions || 0} bestScore={item?.best_score || 0} />; })}
      </div>

      <section className="mt-8 rounded-[24px] bg-[#f8e6dc] p-5 md:p-6">
        <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center"><div><p className="text-xs font-black tracking-[.16em] text-[#a76d50]">TIPS HARI INI</p><h3 className="mt-1 text-lg font-black">اِسْتَمِرَّ فِي التَّعَلُّمِ</h3><p className="mt-1 text-sm text-[#785a4a]">Teruslah belajar sedikit demi sedikit. Konsistensi lebih penting daripada terburu-buru.</p></div><span className="text-4xl">🌱</span></div>
      </section>
    </AppShell>
  );
}
