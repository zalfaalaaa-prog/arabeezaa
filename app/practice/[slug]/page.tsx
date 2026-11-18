import { notFound, redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import PracticeClient from "@/components/PracticeClient";
import { createClient } from "@/lib/supabase/server";
import type { Question } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function PracticePage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ mode?: string; level?: string }> }) {
  const { slug } = await params;
  const query = await searchParams;
  // All seven learning stages use the integrated 4-maharah question bank.
  const mode = "mixed";
  const level = Math.min(7, Math.max(1, Number.parseInt(query.level || "1", 10) || 1));
  const firstQuestion = mode === "mixed" ? ((level - 1) * 15) + 1 : 1;
  const lastQuestion = mode === "mixed" ? level * 15 : 15;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  await supabase.rpc("refresh_daily_hearts");

  const [{ data: lesson }, { data: profile }] = await Promise.all([
    supabase.from("lessons").select("*").eq("slug", slug).eq("is_published", true).single(),
    supabase.from("profiles").select("*").eq("id", user.id).single()
  ]);
  if (!lesson) notFound();

  // Keep locked stages protected on the server as well as in the dashboard UI.
  if (level > 1) {
    const { data: previousStage, error: stageProgressError } = await supabase
      .from("stage_progress")
      .select("completed_sessions")
      .eq("user_id", user.id)
      .eq("lesson_id", lesson.id)
      .eq("level_no", level - 1)
      .maybeSingle();
    if (stageProgressError || !previousStage || Number(previousStage.completed_sessions) < 1) {
      redirect("/dashboard?locked=1");
    }
  }

  const { data: currentStage } = await supabase
    .from("stage_progress")
    .select("best_stars")
    .eq("user_id", user.id)
    .eq("lesson_id", lesson.id)
    .eq("level_no", level)
    .maybeSingle();

  let { data: questionData } = await supabase
    .from("questions")
    .select("*")
    .eq("lesson_id", lesson.id)
    .eq("mode", mode)
    .eq("is_published", true)
    .gte("sort_order", firstQuestion)
    .lte("sort_order", lastQuestion)
    .order("sort_order")
    .limit(15);

  if (!questionData || questionData.length === 0) {
    const fallback = await supabase
      .from("questions")
      .select("*")
      .eq("lesson_id", lesson.id)
      .eq("mode", "mixed")
      .eq("is_published", true)
      .gte("sort_order", firstQuestion)
      .lte("sort_order", lastQuestion)
      .order("sort_order")
      .limit(15);
    questionData = fallback.data;
  }

  const questions = (questionData || []) as Question[];
  if (questions.length !== 15) notFound();

  return (
    <AppShell stats={{ streak: profile?.streak_count || 0, diamonds: profile?.diamonds || 0, hearts: profile?.hearts || 0 }} role={profile?.role || "student"}>
      <PracticeClient lessonSlug={slug} lessonTitle={lesson.title} mode={mode} level={level} questions={questions} initialHearts={profile?.hearts ?? 5} initialDiamonds={profile?.diamonds ?? 0} initialHeartsResetDate={profile?.hearts_reset_date ?? ""} initialBestStars={Number(currentStage?.best_stars || 0)} />
    </AppShell>
  );
}
