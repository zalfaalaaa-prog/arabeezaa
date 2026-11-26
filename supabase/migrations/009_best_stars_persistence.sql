-- ARABEEZA V14: simpan pencapaian bintang terbaik per tahap.
-- Migration ini aman dijalankan setelah migration 001 sampai 008.
-- Nilai bintang tidak akan turun ketika siswa mengulang tahap dan mendapat hasil lebih rendah.

begin;

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

  -- Ambang bintang: 90-100 = 3, 75-89 = 2, di bawah 75 = 1.
  v_stars := case
    when v_score >= 90 then 3
    when v_score >= 75 then 2
    else 1
  end;

  -- Simpan XP, berlian, streak, dan ringkasan sesi melalui fungsi yang sudah ada.
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

-- Rekonsiliasi data lama tanpa menurunkan bintang yang sudah lebih tinggi.
update public.stage_progress
set best_stars = greatest(
  best_stars,
  case
    when best_score >= 90 then 3
    when best_score >= 75 then 2
    else 1
  end
)
where completed_sessions > 0;

commit;
