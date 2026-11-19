-- ARABEEZA migration 007
-- Dialog percakapan Faris-Zaid, petunjuk terjemahan Bahasa Indonesia untuk soal susun kata,
-- serta opsi isi ulang nyawa menggunakan XP.
-- Jalankan setelah migration 001-006 di Supabase SQL Editor.

begin;

-- Percakapan ini disusun dari informasi yang sudah dipakai dalam bank soal Bab 1:
-- pertemuan di perpustakaan sekolah, siswa baru, alasan pindah untuk belajar,
-- sistem belajar yang teratur, mata pelajaran Bahasa dan Tafsir, kerja sama, dan salat.
update public.dialogues d
set title = 'Dialog 3 · Faris dan Zaid di perpustakaan',
    arabic_text = $arabic$
فَارِسٌ: السَّلَامُ عَلَيْكَ يَا زَيْدُ، كَيْفَ حَالُكَ؟
زَيْدٌ: وَعَلَيْكَ السَّلَامُ يَا فَارِسُ، أَنَا بِخَيْرٍ، شُكْرًا.
فَارِسٌ: أَيْنَ كُنْتَ بَعْدَ انْتِهَاءِ الْحِصَّةِ؟
زَيْدٌ: كُنْتُ فِي مَكْتَبَةِ الْمَدْرَسَةِ، أَقْرَأُ كِتَابًا.
فَارِسٌ: هَلْ أَنْتَ طَالِبٌ جَدِيدٌ فِي هَذِهِ الْمَدْرَسَةِ؟
زَيْدٌ: نَعَمْ، اِنْتَقَلْتُ إِلَى هُنَا لِأَجْلِ الدِّرَاسَةِ.
فَارِسٌ: مَا رَأْيُكَ فِي نِظَامِ التَّعَلُّمِ فِي هَذِهِ الْمَدْرَسَةِ؟
زَيْدٌ: النِّظَامُ مُنَظَّمٌ، وَيَحْتَاجُ إِلَى الِاجْتِهَادِ وَالِانْضِبَاطِ.
فَارِسٌ: مَا الْمَادَّةُ الَّتِي تُحِبُّهَا أَكْثَرَ؟
زَيْدٌ: أُحِبُّ مَادَّةَ اللُّغَةِ وَالتَّفْسِيرِ.
فَارِسٌ: يُمْكِنُنَا أَنْ نَتَعَاوَنَ فِي التَّعَلُّمِ وَنَتَذَاكَرَ مَعًا.
زَيْدٌ: الصَّدَاقَةُ فِي سَبِيلِ الْعِلْمِ شَيْءٌ جَمِيلٌ.
فَارِسٌ: هَيَّا نَذْهَبُ إِلَى الصَّلَاةِ.
زَيْدٌ: هَيَّا بِنَا.
$arabic$,
    translation = $translation$
Faris: Assalamu'alaikum, Zaid. Bagaimana kabarmu?
Zaid: Wa'alaikumussalam, Faris. Saya baik, terima kasih.
Faris: Di mana kamu setelah pelajaran selesai?
Zaid: Saya berada di perpustakaan sekolah, sedang membaca buku.
Faris: Apakah kamu siswa baru di sekolah ini?
Zaid: Ya, saya pindah ke sini untuk belajar.
Faris: Bagaimana pendapatmu tentang sistem belajar di sekolah ini?
Zaid: Sistemnya teratur dan membutuhkan kesungguhan serta kedisiplinan.
Faris: Mata pelajaran apa yang paling kamu sukai?
Zaid: Saya menyukai mata pelajaran Bahasa dan Tafsir.
Faris: Kita bisa bekerja sama dalam belajar dan mengulang pelajaran bersama.
Zaid: Persahabatan dalam menuntut ilmu adalah hal yang indah.
Faris: Ayo kita pergi salat.
Zaid: Ayo.
$translation$
where d.lesson_id = (select id from public.lessons where slug = 'at-taaruf')
  and d.sort_order = 3;

insert into public.dialogues (lesson_id, title, arabic_text, translation, sort_order)
select l.id,
       'Dialog 3 · Faris dan Zaid di perpustakaan',
       $arabic$
فَارِسٌ: السَّلَامُ عَلَيْكَ يَا زَيْدُ، كَيْفَ حَالُكَ؟
زَيْدٌ: وَعَلَيْكَ السَّلَامُ يَا فَارِسُ، أَنَا بِخَيْرٍ، شُكْرًا.
فَارِسٌ: أَيْنَ كُنْتَ بَعْدَ انْتِهَاءِ الْحِصَّةِ؟
زَيْدٌ: كُنْتُ فِي مَكْتَبَةِ الْمَدْرَسَةِ، أَقْرَأُ كِتَابًا.
فَارِسٌ: هَلْ أَنْتَ طَالِبٌ جَدِيدٌ فِي هَذِهِ الْمَدْرَسَةِ؟
زَيْدٌ: نَعَمْ، اِنْتَقَلْتُ إِلَى هُنَا لِأَجْلِ الدِّرَاسَةِ.
فَارِسٌ: مَا رَأْيُكَ فِي نِظَامِ التَّعَلُّمِ فِي هَذِهِ الْمَدْرَسَةِ؟
زَيْدٌ: النِّظَامُ مُنَظَّمٌ، وَيَحْتَاجُ إِلَى الِاجْتِهَادِ وَالِانْضِبَاطِ.
فَارِسٌ: مَا الْمَادَّةُ الَّتِي تُحِبُّهَا أَكْثَرَ؟
زَيْدٌ: أُحِبُّ مَادَّةَ اللُّغَةِ وَالتَّفْسِيرِ.
فَارِسٌ: يُمْكِنُنَا أَنْ نَتَعَاوَنَ فِي التَّعَلُّمِ وَنَتَذَاكَرَ مَعًا.
زَيْدٌ: الصَّدَاقَةُ فِي سَبِيلِ الْعِلْمِ شَيْءٌ جَمِيلٌ.
فَارِسٌ: هَيَّا نَذْهَبُ إِلَى الصَّلَاةِ.
زَيْدٌ: هَيَّا بِنَا.
$arabic$,
       $translation$
Faris: Assalamu'alaikum, Zaid. Bagaimana kabarmu?
Zaid: Wa'alaikumussalam, Faris. Saya baik, terima kasih.
Faris: Di mana kamu setelah pelajaran selesai?
Zaid: Saya berada di perpustakaan sekolah, sedang membaca buku.
Faris: Apakah kamu siswa baru di sekolah ini?
Zaid: Ya, saya pindah ke sini untuk belajar.
Faris: Bagaimana pendapatmu tentang sistem belajar di sekolah ini?
Zaid: Sistemnya teratur dan membutuhkan kesungguhan serta kedisiplinan.
Faris: Mata pelajaran apa yang paling kamu sukai?
Zaid: Saya menyukai mata pelajaran Bahasa dan Tafsir.
Faris: Kita bisa bekerja sama dalam belajar dan mengulang pelajaran bersama.
Zaid: Persahabatan dalam menuntut ilmu adalah hal yang indah.
Faris: Ayo kita pergi salat.
Zaid: Ayo.
$translation$,
       3
from public.lessons l
where l.slug = 'at-taaruf'
  and not exists (
    select 1 from public.dialogues d where d.lesson_id = l.id and d.sort_order = 3
  );

-- Make the favorite-subject question concise; the full dialogue appears above it.
update public.questions q
set prompt = 'Dalam dialog, Faris menanyakan mata pelajaran yang paling disukai Zaid. Informasi apa yang diminta?'
where q.lesson_id = (select id from public.lessons where slug = 'at-taaruf')
  and q.mode = 'mixed'
  and q.sort_order = 87;

-- Set the dialogue as visible context for the questions that test comprehension of it.
update public.questions q
set prompt_arabic = $dialog$
فَارِسٌ: السَّلَامُ عَلَيْكَ يَا زَيْدُ، كَيْفَ حَالُكَ؟
زَيْدٌ: وَعَلَيْكَ السَّلَامُ يَا فَارِسُ، أَنَا بِخَيْرٍ، شُكْرًا.
فَارِسٌ: أَيْنَ كُنْتَ بَعْدَ انْتِهَاءِ الْحِصَّةِ؟
زَيْدٌ: كُنْتُ فِي مَكْتَبَةِ الْمَدْرَسَةِ، أَقْرَأُ كِتَابًا.
فَارِسٌ: هَلْ أَنْتَ طَالِبٌ جَدِيدٌ فِي هَذِهِ الْمَدْرَسَةِ؟
زَيْدٌ: نَعَمْ، اِنْتَقَلْتُ إِلَى هُنَا لِأَجْلِ الدِّرَاسَةِ.
فَارِسٌ: مَا رَأْيُكَ فِي نِظَامِ التَّعَلُّمِ فِي هَذِهِ الْمَدْرَسَةِ؟
زَيْدٌ: النِّظَامُ مُنَظَّمٌ، وَيَحْتَاجُ إِلَى الِاجْتِهَادِ وَالِانْضِبَاطِ.
فَارِسٌ: مَا الْمَادَّةُ الَّتِي تُحِبُّهَا أَكْثَرَ؟
زَيْدٌ: أُحِبُّ مَادَّةَ اللُّغَةِ وَالتَّفْسِيرِ.
فَارِسٌ: يُمْكِنُنَا أَنْ نَتَعَاوَنَ فِي التَّعَلُّمِ وَنَتَذَاكَرَ مَعًا.
زَيْدٌ: الصَّدَاقَةُ فِي سَبِيلِ الْعِلْمِ شَيْءٌ جَمِيلٌ.
فَارِسٌ: هَيَّا نَذْهَبُ إِلَى الصَّلَاةِ.
زَيْدٌ: هَيَّا بِنَا.
$dialog$
where q.lesson_id = (select id from public.lessons where slug = 'at-taaruf')
  and q.mode = 'mixed'
  and q.sort_order between 76 and 90;

-- Replace the vague word-order instructions with Indonesian meaning prompts.
update public.questions q
set prompt = case q.sort_order
  when 7 then 'Terjemahkan ke dalam Bahasa Arab dengan menyusun kata-kata berikut: “Selamat pagi, wahai temanku.”'
  when 13 then 'Terjemahkan ke dalam Bahasa Arab dengan menyusun kata-kata berikut: “Selamat datang untukmu.”'
  when 21 then 'Terjemahkan ke dalam Bahasa Arab dengan menyusun kata-kata berikut: “Saya tinggal di Surabaya.”'
  when 28 then 'Terjemahkan ke dalam Bahasa Arab dengan menyusun kata-kata berikut: “Ayah saya bekerja sebagai guru.”'
  when 34 then 'Terjemahkan ke dalam Bahasa Arab dengan menyusun kata-kata berikut: “Kami adalah siswa di sekolah.”'
  when 39 then 'Terjemahkan ke dalam Bahasa Arab dengan menyusun kata-kata berikut: “Ini adalah bukuku.”'
  when 49 then 'Terjemahkan ke dalam Bahasa Arab dengan menyusun kata-kata berikut: “Kapan kamu pergi ke sekolah?”'
  when 57 then 'Terjemahkan ke dalam Bahasa Arab dengan menyusun kata-kata berikut: “Apa yang kamu lakukan pada waktu luang?”'
  when 64 then 'Terjemahkan ke dalam Bahasa Arab dengan menyusun kata-kata berikut: “Saya tinggal di luar kota.”'
  when 69 then 'Terjemahkan ke dalam Bahasa Arab dengan menyusun kata-kata berikut: “Saya berharap menjadi orang yang bermanfaat.”'
  when 80 then 'Terjemahkan ke dalam Bahasa Arab dengan menyusun kata-kata berikut: “Apakah kamu siswa baru di sekolah ini?”'
  when 88 then 'Terjemahkan ke dalam Bahasa Arab dengan menyusun kata-kata berikut: “Kita bekerja sama dalam belajar dan mengulang pelajaran bersama.”'
  when 94 then 'Terjemahkan ke dalam Bahasa Arab dengan menyusun kata-kata berikut: “Saya tinggal bersama keluarga di sebuah desa.”'
  when 101 then 'Terjemahkan ke dalam Bahasa Arab dengan menyusun kata-kata berikut: “Khalid adalah siswa yang rajin di sekolah.”'
  else q.prompt
end,
options = case q.sort_order
  when 101 then '["فِي","مُجْتَهِدٌ","خَالِدٌ","الْمَدْرَسَةِ","طَالِبٌ"]'::jsonb
  else q.options
end,
correct_answer = case q.sort_order
  when 101 then 'خَالِدٌ طَالِبٌ مُجْتَهِدٌ فِي الْمَدْرَسَةِ'
  else q.correct_answer
end,
explanation = case q.sort_order
  when 101 then 'خَالِدٌ berarti Khalid, طَالِبٌ berarti siswa, مُجْتَهِدٌ berarti rajin, dan فِي الْمَدْرَسَةِ berarti di sekolah.'
  else q.explanation
end
where q.lesson_id = (select id from public.lessons where slug = 'at-taaruf')
  and q.mode = 'mixed'
  and q.question_type = 'word_order'
  and q.sort_order in (7, 13, 21, 28, 34, 39, 49, 57, 64, 69, 80, 88, 94, 101);

-- Students may refill all hearts with XP. The price is fixed server-side to prevent client manipulation.
create or replace function public.buy_hearts_with_xp()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_xp integer;
  v_hearts integer;
  v_cost constant integer := 100;
begin
  if v_user is null then
    raise exception 'Silakan login terlebih dahulu.';
  end if;

  perform public.refresh_daily_hearts();

  select xp, hearts
    into v_xp, v_hearts
  from public.profiles
  where id = v_user
  for update;

  if v_xp is null then
    raise exception 'Profil tidak ditemukan.';
  end if;
  if v_hearts >= 5 then
    raise exception 'Nyawa kamu sudah penuh.';
  end if;
  if v_xp < v_cost then
    raise exception 'XP tidak cukup. Kamu membutuhkan 100 XP.';
  end if;

  update public.profiles
  set xp = xp - v_cost,
      hearts = 5
  where id = v_user;

  return jsonb_build_object('ok', true, 'hearts', 5, 'xp', v_xp - v_cost, 'cost', v_cost);
end;
$$;

revoke all on function public.buy_hearts_with_xp() from public, anon;
grant execute on function public.buy_hearts_with_xp() to authenticated;

commit;
