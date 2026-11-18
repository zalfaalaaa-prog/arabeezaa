-- ARABEEZA revision 005: progress and best stars for each of the seven learning stages.
-- Run this migration once in Supabase SQL Editor after migrations 001-004.

begin;

create table if not exists public.stage_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  level_no integer not null check (level_no between 1 and 7),
  completed_sessions integer not null default 0 check (completed_sessions >= 0),
  best_score integer not null default 0 check (best_score between 0 and 100),
  best_stars integer not null default 0 check (best_stars between 0 and 3),
  last_completed_at timestamptz,
  unique (user_id, lesson_id, level_no)
);

create index if not exists idx_stage_progress_user_lesson
  on public.stage_progress(user_id, lesson_id, level_no);

alter table public.stage_progress enable row level security;
grant select on public.stage_progress to authenticated;

drop policy if exists "stage_progress_read_own" on public.stage_progress;
create policy "stage_progress_read_own" on public.stage_progress
  for select to authenticated
  using (user_id = auth.uid());

-- Completion is written only by this trusted function, not directly by the browser.
create or replace function public.record_stage_quiz_result(
  p_lesson_slug text,
  p_level_no integer,
  p_score integer,
  p_correct_count integer,
  p_question_count integer,
  p_xp_earned integer,
  p_diamonds_earned integer
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_lesson uuid;
  v_level integer := greatest(1, least(coalesce(p_level_no, 1), 7));
  v_score integer := greatest(0, least(coalesce(p_score, 0), 100));
  v_stars integer;
  v_best_score integer;
  v_best_stars integer;
begin
  if v_user is null then
    raise exception 'Silakan login terlebih dahulu.';
  end if;

  select id into v_lesson
  from public.lessons
  where slug = p_lesson_slug and is_published = true;

  if v_lesson is null then
    raise exception 'Materi tidak ditemukan.';
  end if;

  -- A stage can be recorded only after the previous stage has been completed.
  if v_level > 1 and not exists (
    select 1
    from public.stage_progress
    where user_id = v_user
      and lesson_id = v_lesson
      and level_no = v_level - 1
      and completed_sessions > 0
  ) then
    raise exception 'Tahap ini masih terkunci. Selesaikan tahap sebelumnya terlebih dahulu.';
  end if;

  -- Star rules: 15 correct on first try = 3 stars; 10-14 = 2; 0-9 = 1.
  v_stars := case
    when v_score >= 100 then 3
    when v_score >= 67 then 2
    else 1
  end;

  -- Keep the existing XP, diamonds, streak, attempt and lesson summary behavior.
  perform public.record_quiz_result(
    p_lesson_slug,
    v_score,
    greatest(0, least(coalesce(p_correct_count, 0), 15)),
    greatest(1, least(coalesce(p_question_count, 15), 15)),
    greatest(0, least(coalesce(p_xp_earned, 0), 1000)),
    greatest(0, least(coalesce(p_diamonds_earned, 0), 100))
  );

  insert into public.stage_progress (
    user_id, lesson_id, level_no, completed_sessions, best_score, best_stars, last_completed_at
  ) values (
    v_user, v_lesson, v_level, 1, v_score, v_stars, now()
  )
  on conflict (user_id, lesson_id, level_no) do update
    set completed_sessions = public.stage_progress.completed_sessions + 1,
        best_score = greatest(public.stage_progress.best_score, excluded.best_score),
        best_stars = greatest(public.stage_progress.best_stars, excluded.best_stars),
        last_completed_at = now()
  returning best_score, best_stars into v_best_score, v_best_stars;

  return jsonb_build_object(
    'ok', true,
    'level_no', v_level,
    'stars_earned', v_stars,
    'best_score', v_best_score,
    'best_stars', v_best_stars
  );
end;
$$;

revoke all on function public.record_stage_quiz_result(text, integer, integer, integer, integer, integer, integer) from public, anon;
grant execute on function public.record_stage_quiz_result(text, integer, integer, integer, integer, integer, integer) to authenticated;

commit;
