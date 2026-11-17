-- ARABEEZA revision 004
-- Restore each student's hearts to 5 on the first request after a new day in WIB (Asia/Jakarta).
-- The shared app shell also checks at 00:00 WIB while the app is open.

begin;

alter table public.profiles
  add column if not exists hearts_reset_date date;

update public.profiles
set hearts_reset_date = (now() at time zone 'Asia/Jakarta')::date
where hearts_reset_date is null;

alter table public.profiles
  alter column hearts_reset_date set default ((now() at time zone 'Asia/Jakarta')::date),
  alter column hearts_reset_date set not null;

create or replace function public.refresh_daily_hearts()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_today date := (now() at time zone 'Asia/Jakarta')::date;
  v_hearts integer;
  v_reset_date date;
  v_did_reset boolean := false;
begin
  if v_user is null then
    raise exception 'Silakan login terlebih dahulu.';
  end if;

  select hearts, hearts_reset_date
    into v_hearts, v_reset_date
  from public.profiles
  where id = v_user
  for update;

  if not found then
    raise exception 'Profil tidak ditemukan.';
  end if;

  if v_reset_date is null or v_reset_date < v_today then
    update public.profiles
    set hearts = 5,
        hearts_reset_date = v_today
    where id = v_user
    returning hearts into v_hearts;
    v_did_reset := true;
  end if;

  return jsonb_build_object(
    'ok', true,
    'hearts', v_hearts,
    'reset', v_did_reset,
    'reset_date', v_today
  );
end;
$$;

-- Refresh before consuming a heart, so an old empty balance cannot carry into a new WIB day.
create or replace function public.consume_heart()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_hearts integer;
begin
  if v_user is null then
    raise exception 'Silakan login terlebih dahulu.';
  end if;

  perform public.refresh_daily_hearts();

  select hearts into v_hearts
  from public.profiles
  where id = v_user
  for update;

  if v_hearts is null then
    raise exception 'Profil tidak ditemukan.';
  end if;

  if v_hearts <= 0 then
    return jsonb_build_object('ok', false, 'hearts', 0, 'message', 'Nyawa habis.');
  end if;

  update public.profiles
  set hearts = greatest(hearts - 1, 0)
  where id = v_user
  returning hearts into v_hearts;

  return jsonb_build_object('ok', true, 'hearts', v_hearts);
end;
$$;

-- Refresh before a paid refill as well, so the student is not charged if a new day already began.
create or replace function public.buy_hearts(p_cost integer default 25)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_diamonds integer;
  v_hearts integer;
  v_cost integer := greatest(1, least(coalesce(p_cost, 25), 10000));
begin
  if v_user is null then
    raise exception 'Silakan login terlebih dahulu.';
  end if;

  perform public.refresh_daily_hearts();

  select diamonds, hearts
    into v_diamonds, v_hearts
  from public.profiles
  where id = v_user
  for update;

  if v_hearts >= 5 then
    raise exception 'Nyawa kamu sudah penuh.';
  end if;
  if v_diamonds < v_cost then
    raise exception 'Berlian tidak cukup. Kamu membutuhkan 25 berlian.';
  end if;

  update public.profiles
  set diamonds = diamonds - v_cost,
      hearts = 5
  where id = v_user;

  return jsonb_build_object('ok', true, 'hearts', 5, 'diamonds', v_diamonds - v_cost);
end;
$$;

revoke all on function public.refresh_daily_hearts() from public;
revoke all on function public.consume_heart() from public;
revoke all on function public.buy_hearts(integer) from public;
grant execute on function public.refresh_daily_hearts() to authenticated;
grant execute on function public.consume_heart() to authenticated;
grant execute on function public.buy_hearts(integer) to authenticated;

commit;
