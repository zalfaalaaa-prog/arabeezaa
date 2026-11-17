import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import type { Lesson } from "@/lib/types";

export default function LessonCard({ lesson, completed = 0, bestScore = 0 }: { lesson: Lesson; completed?: number; bestScore?: number }) {
  return (
    <article className="surface overflow-hidden">
      <div className="h-2" style={{ background: lesson.color || "#a5af79" }} />
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="rounded-full bg-[#fff0d9] px-3 py-1 text-xs font-extrabold text-[#a76d50]">MATERI {lesson.level_no}</span>
          <span className="text-xs font-bold text-[#8a9890]">{completed} sesi selesai</span>
        </div>
        <p className="arabic text-right text-2xl font-bold">{lesson.title_ar}</p>
        <h3 className="mt-1 text-lg font-black">{lesson.title}</h3>
        <p className="mt-2 min-h-10 text-sm leading-6 text-[#718078]">{lesson.description}</p>
        <div className="mt-4 flex items-center justify-between text-xs font-bold text-[#718078]"><span>Skor terbaik</span><span>{bestScore}/100</span></div>
        <div className="progress-track mt-2"><div className="progress-fill" style={{ width: `${Math.min(bestScore, 100)}%` }} /></div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <Link href={`/practice/${lesson.slug}?mode=mixed&level=1`} className="btn-primary"><Sparkles size={16} /> Mulai tahap 1</Link>
          <Link href={`/lessons/${lesson.slug}`} className="btn-secondary"><BookOpen size={16} /> Pelajari Materi 1 <ArrowRight size={14} /></Link>
        </div>
      </div>
    </article>
  );
}
