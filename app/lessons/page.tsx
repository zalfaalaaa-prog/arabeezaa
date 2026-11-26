import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, BookOpen, Lock, Sparkles } from "lucide-react";
import AppShell from "@/components/AppShell";
import CatMascot from "@/components/CatMascot";
import { createClient } from "@/lib/supabase/server";
import { chapterCatalog } from "@/lib/chapters";

export const dynamic = "force-dynamic";

export default async function LessonsIndexPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: activeLesson }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("lessons").select("id,slug,is_published").eq("slug", "at-taaruf").eq("is_published", true).maybeSingle()
  ]);
  const availableCount = activeLesson ? 1 : 0;

  return (
    <AppShell active="/lessons" role={profile?.role || "student"} stats={{ streak: profile?.streak_count || 0, diamonds: profile?.diamonds || 0, hearts: profile?.hearts || 0 }}>
      <section className="mb-7">
        <p className="text-xs font-black tracking-[.16em] text-[#762b40]">PERPUSTAKAAN ARABEEZA</p>
        <h1 className="mt-1 text-3xl font-black md:text-4xl">Pilih bab yang ingin dipelajari</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#806f73]">Setiap sampul berisi materi, percakapan, kosakata, dan latihan dalam satu bab.</p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-2xl bg-[#f8edf0] px-4 py-3 text-sm font-bold text-[#762b40]">
            <BookOpen size={19} /> {chapterCatalog.length} bab dalam katalog
          </div>
          <span className="text-xs font-semibold text-[#806f73]">{availableCount} bab tersedia · bab lainnya sedang disiapkan</span>
        </div>
      </section>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {chapterCatalog.map((chapter) => (
          <Link
            href={`/lessons/${chapter.slug}`}
            key={chapter.slug}
            className={`chapter-cover-card group ${chapter.available ? "is-available" : "is-upcoming"}`}
            aria-label={`Buka Bab ${chapter.number}: ${chapter.title}${chapter.available ? "" : ", materi belum dimasukkan"}`}
          >
            <div className="chapter-cover-top">
              <span className="chapter-cover-label">BAB {chapter.number}</span>
              <span className={`chapter-cover-status ${chapter.available ? "is-available" : "is-upcoming"}`}>
                {chapter.available ? <Sparkles size={16} /> : <Lock size={15} />}
                {chapter.available ? "Tersedia" : "Segera hadir"}
              </span>
            </div>
            <div className="chapter-cover-art">
              <CatMascot mood={chapter.available ? "happy" : "thinking"} size={116} className="chapter-cover-cat" />
            </div>
            <p lang="ar" dir="rtl" className="arabic chapter-cover-arabic">{chapter.titleAr}</p>
            <h2 className="chapter-cover-title">{chapter.title}</h2>
            <p className="chapter-cover-description">{chapter.description}</p>
            <span className="chapter-cover-open">{chapter.available ? "Buka bab" : "Lihat bab"} <ArrowRight size={17} /></span>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
