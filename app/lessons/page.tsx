import Link from "next/link";
import type { CSSProperties } from "react";
import { redirect } from "next/navigation";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import AppShell from "@/components/AppShell";
import CatMascot from "@/components/CatMascot";
import { createClient } from "@/lib/supabase/server";
import type { Lesson } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function LessonsIndexPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: lessons }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("lessons").select("*").eq("is_published", true).order("sort_order")
  ]);

  const chapters = (lessons || []) as Lesson[];
  return (
    <AppShell active="/lessons" role={profile?.role || "student"} stats={{ streak: profile?.streak_count || 0, diamonds: profile?.diamonds || 0, hearts: profile?.hearts || 0 }}>
      <section className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black tracking-[.16em] text-[#2e8b62]">PERPUSTAKAAN ARABEEZA</p>
          <h1 className="mt-1 text-3xl font-black">Pilih bab yang ingin dipelajari</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#718078]">Setiap sampul berisi materi, percakapan, kosakata, dan latihan dalam satu bab.</p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-[#fff0d9] px-4 py-3 text-sm font-bold text-[#94662c]"><BookOpen size={18}/> {chapters.length} bab tersedia</div>
      </section>

      {chapters.length === 0 ? (
        <div className="surface p-8 text-center"><CatMascot mood="thinking" size={86} className="mx-auto"/><h2 className="mt-3 font-black">Sampul materi belum tersedia</h2><p className="mt-2 text-sm text-[#718078]">Materi akan muncul setelah data bab diterbitkan.</p></div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {chapters.map((lesson, index) => (
            <Link href={`/lessons/${lesson.slug}`} key={lesson.id} className="chapter-cover-card group" style={{ "--chapter-color": lesson.color || "#2e8b62" } as CSSProperties & { "--chapter-color": string }}>
              <div className="chapter-cover-top">
                <span className="chapter-cover-label">BAB {lesson.level_no || index + 1}</span>
                <span className="chapter-cover-sparkle"><Sparkles size={18}/></span>
              </div>
              <div className="chapter-cover-art"><CatMascot mood="happy" size={116} className="chapter-cover-cat"/></div>
              <p lang="ar" dir="rtl" className="arabic chapter-cover-arabic">{lesson.title_ar}</p>
              <h2 className="chapter-cover-title">{lesson.title}</h2>
              <p className="chapter-cover-description">{lesson.description}</p>
              <span className="chapter-cover-open">Buka bab <ArrowRight size={17}/></span>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}
