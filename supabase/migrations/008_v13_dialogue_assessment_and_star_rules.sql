-- ARABEEZA V13 - perbaikan dialog, teks bacaan, dan kejelasan asesmen.
-- Migration ini memperbarui bank soal Materi 1 yang sudah ada.
-- Dialog latihan dibuat berbeda dari dialog inti pada halaman materi.
-- Teks bacaan Abdullah dan Khalid ditambahkan sebagai sumber soal membaca.
-- Transkrip jawaban tidak ditampilkan pada prompt listening dan speaking.
-- Aturan bintang disamakan antara perhitungan browser dan database.
-- Jalankan setelah migration 001 sampai 007 di Supabase SQL Editor.

begin;

-- Dialog latihan Nadia-Hana disimpan pada prompt soal, terpisah dari dialog inti di halaman materi.
-- Dialog ini dipakai sebagai konteks soal membaca dan menjodohkan.
-- Nama pembicara tidak dimasukkan ke audio; hanya kalimat Arab yang dibacakan.
do $$
declare
  v_dialog text := $dialog$
نَادِيَةُ: السَّلَامُ عَلَيْكِ يَا هَنَاءُ، أَرَاكِ فِي قَاعَةِ الْأَنْشِطَةِ. هَلْ أَنْتِ عُضْوَةٌ جَدِيدَةٌ فِي نَادِي اللُّغَةِ الْعَرَبِيَّةِ؟
هَنَاءُ: وَعَلَيْكِ السَّلَامُ يَا نَادِيَةُ، نَعَمْ، اِنْضَمَمْتُ إِلَى النَّادِي هَذَا الْأُسْبُوعَ.
نَادِيَةُ: مِنْ أَيْنَ أَنْتِ؟
هَنَاءُ: أَنَا مِنْ مَالَانْغَ، وَأَسْكُنُ قَرِيبًا مِنَ الْمَدْرَسَةِ مَعَ خَالَتِي.
نَادِيَةُ: لِمَاذَا اِنْضَمَمْتِ إِلَى نَادِي اللُّغَةِ الْعَرَبِيَّةِ؟
هَنَاءُ: أُرِيدُ أَنْ أُحَسِّنَ مُحَادَثَتِي وَأَقْرَأَ الْقِصَصَ الْعَرَبِيَّةَ.
نَادِيَةُ: مَا النَّشَاطُ الَّذِي تُفَضِّلِينَهُ؟
هَنَاءُ: أُفَضِّلُ تَمْثِيلَ الْحِوَارِ وَسَرْدَ الْقِصَصِ.
نَادِيَةُ: هَيَّا نُعِدُّ حِوَارًا لِحَفْلِ الْمَدْرَسَةِ.
هَنَاءُ: فِكْرَةٌ جَمِيلَةٌ، لِنَبْدَأْ الآنَ.
$dialog$;
begin
  update public.questions q
  set prompt_arabic = v_dialog
  from public.lessons l
  where q.lesson_id = l.id
    and l.slug = 'at-taaruf'
    and q.mode = 'mixed'
    and q.sort_order in (76, 77, 81, 82, 85, 87, 89, 90);

  -- Listening dan speaking tidak menampilkan transkrip atau jawaban di soal.
  update public.questions q
  set prompt_arabic = null
  from public.lessons l
  where q.lesson_id = l.id
    and l.slug = 'at-taaruf'
    and q.mode = 'mixed'
    and q.sort_order in (78, 79, 80, 83, 84, 86, 88, 92, 95, 98, 102);
end $$;

-- Revisi pertanyaan dialog 76-90 agar berbahasa Indonesia dan tidak membocorkan jawaban.
update public.questions q
set prompt = case q.sort_order
  when 76 then 'Di mana Nadia dan Hana pertama kali bercakap-cakap?'
  when 77 then 'Jodohkan tokoh, tempat, dan kegiatan dengan informasi yang sesuai dalam dialog.'
  when 78 then 'Mengapa Hana bergabung dengan klub Bahasa Arab?'
  when 79 then 'Ucapkan ungkapan yang menyatakan senang bertemu dengan teman perempuan.'
  when 80 then 'Susun pertanyaan Nadia untuk menanyakan asal Hana.'
  when 81 then 'Kemampuan apa yang ingin Hana tingkatkan setelah bergabung dengan klub?'
  when 82 then 'Jodohkan kosakata dalam dialog dengan arti yang tepat.'
  when 83 then 'Dengarkan ajakan pada akhir dialog, lalu susun kata-kata yang kamu dengar.'
  when 84 then 'Pilih gambar yang menunjukkan tempat Nadia dan Hana bertemu.'
  when 85 then 'Kegiatan apa yang paling disukai Hana di klub Bahasa Arab?'
  when 86 then 'Ucapkan ungkapan yang menunjukkan persetujuan terhadap usul teman.'
  when 87 then 'Apa maksud pertanyaan Nadia pada bagian ketiga dialog?'
  when 88 then 'Susun kalimat yang menyatakan asal dan tempat tinggal Hana.'
  when 89 then 'Apa pesan utama yang dapat diambil dari percakapan Nadia dan Hana?'
  when 90 then 'Kesimpulan apa yang paling tepat dari percakapan Nadia dan Hana?'
  else q.prompt
end,
skill = case q.sort_order
  when 76 then 'reading'
  when 77 then 'vocabulary'
  when 78 then 'listening'
  when 79 then 'speaking'
  when 80 then 'writing'
  when 81 then 'reading'
  when 82 then 'vocabulary'
  when 83 then 'listening'
  when 84 then 'vocabulary'
  when 85 then 'reading'
  when 86 then 'speaking'
  when 87 then 'conversation'
  when 88 then 'writing'
  when 89 then 'reading'
  when 90 then 'reading'
  else q.skill
end,
question_type = case q.sort_order
  when 76 then 'multiple_choice'
  when 77 then 'matching_pairs'
  when 78 then 'multiple_choice'
  when 79 then 'speaking_repeat'
  when 80 then 'word_order'
  when 81 then 'multiple_choice'
  when 82 then 'matching_pairs'
  when 83 then 'listen_word_order'
  when 84 then 'image_choice'
  when 85 then 'multiple_choice'
  when 86 then 'speaking_repeat'
  when 87 then 'multiple_choice'
  when 88 then 'word_order'
  when 89 then 'multiple_choice'
  when 90 then 'multiple_choice'
  else q.question_type
end,
options = case q.sort_order
  when 76 then '["Aula kegiatan sekolah","Perpustakaan sekolah","Lapangan olahraga"]'::jsonb
  when 77 then '[{"id":"p1","arabic":"نَادِيَةُ","meaning":"Siswi yang menyambut Hana"},{"id":"p2","arabic":"هَنَاءُ","meaning":"Siswi baru yang bergabung minggu ini"},{"id":"p3","arabic":"قَاعَةُ الْأَنْشِطَةِ","meaning":"Tempat mereka bertemu"},{"id":"p4","arabic":"نَادِي اللُّغَةِ الْعَرَبِيَّةِ","meaning":"Klub yang diikuti Hana"}]'::jsonb
  when 78 then '["Untuk meningkatkan kemampuan percakapan dan membaca cerita Arab","Untuk mencari pekerjaan di sekolah","Untuk mengunjungi keluarganya"]'::jsonb
  when 79 then '[]'::jsonb
  when 80 then '["أَنْتِ","مِنْ","أَيْنَ"]'::jsonb
  when 81 then '["Kemampuan bercakap dalam Bahasa Arab","Kemampuan memasak makanan","Kemampuan bermain olahraga"]'::jsonb
  when 82 then '[{"id":"p1","arabic":"نَادِي اللُّغَةِ الْعَرَبِيَّةِ","meaning":"Klub Bahasa Arab"},{"id":"p2","arabic":"اِنْضَمَمْتُ","meaning":"Saya bergabung"},{"id":"p3","arabic":"مُحَادَثَتِي","meaning":"Kemampuan percakapan saya"},{"id":"p4","arabic":"سَرْدُ الْقِصَصِ","meaning":"Menceritakan kisah"}]'::jsonb
  when 83 then '["لِحَفْلِ","نُعِدُّ","هَيَّا","الْمَدْرَسَةِ","حِوَارًا"]'::jsonb
  when 84 then '[{"label":"Aula kegiatan sekolah","emoji":"🏫"},{"label":"Pantai","emoji":"🏖️"},{"label":"Pasar","emoji":"🛒"},{"label":"Stasiun","emoji":"🚉"}]'::jsonb
  when 85 then '["Memerankan dialog dan menceritakan kisah","Bermain sepak bola di lapangan","Menggambar pemandangan sekolah"]'::jsonb
  when 86 then '[]'::jsonb
  when 87 then '["Asal daerah Hana","Umur Hana","Hobi Hana"]'::jsonb
  when 88 then '["أَنَا","مِنْ","مَالَانْغَ","وَأَسْكُنُ","قَرِيبًا","مِنَ","الْمَدْرَسَةِ","مَعَ","خَالَتِي"]'::jsonb
  when 89 then '["Klub bahasa menjadi tempat berlatih, mengembangkan kemampuan, dan menyiapkan kegiatan bersama","Belajar bahasa hanya dapat dilakukan sendiri","Kegiatan klub hanya bertujuan untuk bermain"]'::jsonb
  when 90 then '["Dua siswi berkenalan di aula kegiatan dan merencanakan dialog untuk acara sekolah","Dua siswi bertengkar karena berbeda daerah","Seorang guru membatalkan kegiatan klub"]'::jsonb
  else q.options
end,
correct_answer = case q.sort_order
  when 76 then 'Aula kegiatan sekolah'
  when 77 then 'ALL_MATCHED'
  when 78 then 'Untuk meningkatkan kemampuan percakapan dan membaca cerita Arab'
  when 79 then 'سَعِدْتُ بِلِقَائِكِ'
  when 80 then 'مِنْ أَيْنَ أَنْتِ؟'
  when 81 then 'Kemampuan bercakap dalam Bahasa Arab'
  when 82 then 'ALL_MATCHED'
  when 83 then 'هَيَّا نُعِدُّ حِوَارًا لِحَفْلِ الْمَدْرَسَةِ'
  when 84 then 'Aula kegiatan sekolah'
  when 85 then 'Memerankan dialog dan menceritakan kisah'
  when 86 then 'فِكْرَةٌ جَمِيلَةٌ، لِنَبْدَأْ الآنَ'
  when 87 then 'Asal daerah Hana'
  when 88 then 'أَنَا مِنْ مَالَانْغَ وَأَسْكُنُ قَرِيبًا مِنَ الْمَدْرَسَةِ مَعَ خَالَتِي'
  when 89 then 'Klub bahasa menjadi tempat berlatih, mengembangkan kemampuan, dan menyiapkan kegiatan bersama'
  when 90 then 'Dua siswi berkenalan di aula kegiatan dan merencanakan dialog untuk acara sekolah'
  else q.correct_answer
end,
explanation = case q.sort_order
  when 76 then 'Nadia menyapa Hana di قَاعَةِ الْأَنْشِطَةِ, yaitu aula kegiatan sekolah.'
  when 77 then 'Informasi tokoh, tempat, dan kegiatan dapat ditemukan dalam dialog.'
  when 78 then 'Hana bergabung untuk meningkatkan kemampuan percakapan dan membaca cerita berbahasa Arab.'
  when 79 then 'Ungkapan tersebut menyatakan rasa senang setelah bertemu seseorang.'
  when 80 then 'Susunan مِنْ أَيْنَ أَنْتِ؟ digunakan untuk menanyakan asal kepada perempuan.'
  when 81 then 'Hana menyebut ingin meningkatkan kemampuan percakapannya.'
  when 82 then 'Kosakata diambil dari ungkapan yang digunakan Nadia dan Hana.'
  when 83 then 'Kalimat ajakan berarti mari kita menyiapkan dialog untuk acara sekolah.'
  when 84 then 'Percakapan berlangsung di aula kegiatan sekolah.'
  when 85 then 'Hana menyukai kegiatan memerankan dialog dan menceritakan kisah.'
  when 86 then 'Ungkapan tersebut menunjukkan persetujuan dan kesiapan untuk memulai.'
  when 87 then 'Nadia ingin mengetahui daerah asal Hana.'
  when 88 then 'Kalimat memuat informasi asal Malang dan tempat tinggal dekat sekolah bersama bibi.'
  when 89 then 'Percakapan menunjukkan manfaat klub untuk latihan bahasa dan kerja sama.'
  when 90 then 'Kedua siswi berkenalan dan berencana menyiapkan dialog untuk acara sekolah.'
  else q.explanation
end,
audio_text = case q.sort_order
  when 78 then 'اِنْضَمَمْتُ إِلَى النَّادِي لِأُحَسِّنَ مُحَادَثَتِي وَأَقْرَأَ الْقِصَصَ الْعَرَبِيَّةَ'
  when 79 then 'سَعِدْتُ بِلِقَائِكِ'
  when 83 then 'هَيَّا نُعِدُّ حِوَارًا لِحَفْلِ الْمَدْرَسَةِ'
  when 86 then 'فِكْرَةٌ جَمِيلَةٌ، لِنَبْدَأْ الآنَ'
  else null
end
from public.lessons l
where q.lesson_id = l.id
  and l.slug = 'at-taaruf'
  and q.mode = 'mixed'
  and q.sort_order between 76 and 90;

-- Pertanyaan listening tidak lagi menampilkan frasa yang menjadi jawaban audio.
update public.questions q
set prompt = case q.sort_order
  when 6 then 'Dengarkan ungkapan yang diputar. Dalam situasi apa ungkapan tersebut digunakan?'
  when 19 then 'Dengarkan perkenalan singkat. Apa status pembicara?'
  when 33 then 'Dengarkan kalimat berikut. Siapa yang sedang dibicarakan?'
  when 40 then 'Dengarkan kalimat tentang keluarga. Apa informasi yang disampaikan mengenai ayah pembicara?'
  when 48 then 'Dengarkan pertanyaan berikut. Informasi apa yang ingin diketahui pembicara?'
  when 63 then 'Dengarkan frasa berikut. Apa makna yang paling tepat?'
  when 92 then 'Dengarkan alasan Abdullah menyukai Bahasa Arab. Alasan apa yang disampaikan?'
  else q.prompt
end,
prompt_arabic = null,
correct_answer = case q.sort_order
  when 40 then 'Ayah saya bekerja sebagai guru'
  else q.correct_answer
end,
options = case q.sort_order
  when 40 then '["Ayah saya bekerja sebagai guru","Ayah mereka bekerja sebagai guru","Ayahmu bekerja sebagai guru"]'::jsonb
  else q.options
end
from public.lessons l
where q.lesson_id = l.id
  and l.slug = 'at-taaruf'
  and q.mode = 'mixed'
  and q.sort_order in (6, 19, 33, 40, 48, 63, 92);

update public.questions q
set explanation = 'Kalimat yang didengar menyatakan bahwa ayah pembicara bekerja sebagai guru.'
from public.lessons l
where q.lesson_id = l.id and l.slug = 'at-taaruf' and q.mode = 'mixed' and q.sort_order = 40;

-- Latihan pengulangan berbicara hanya menampilkan instruksi dan audio, bukan teks target.
update public.questions q
set prompt_arabic = null
from public.lessons l
where q.lesson_id = l.id
  and l.slug = 'at-taaruf'
  and q.mode = 'mixed'
  and q.question_type = 'speaking_repeat';

-- Hapus arti langsung dari petunjuk soal gambar agar siswa tetap perlu memahami kosakata.
update public.questions q
set prompt = 'Pilih ilustrasi yang paling dekat dengan kegiatan التَّعَارُفُ.'
from public.lessons l
where q.lesson_id = l.id
  and l.slug = 'at-taaruf'
  and q.mode = 'mixed'
  and q.sort_order = 12;

-- Bacaan Abdullah ditambahkan untuk soal 91, 93, 94, dan 97 yang sebelumnya tanpa teks sumber.
-- Isi bacaan memberi konteks yang dibutuhkan untuk menjawab pertanyaan dan menjodohkan informasi.
do $$
declare
  v_abdullah text := $reading$
اِسْمِي عَبْدُ اللَّهِ. أَدْرُسُ فِي الصَّفِّ الْأَوَّلِ الثَّانَوِيِّ. أَعِيشُ مَعَ أُسْرَتِي فِي قَرْيَةٍ قَرِيبَةٍ مِنَ الْمَدِينَةِ. أَبِي مُعَلِّمٌ، وَأُمِّي رَبَّةُ بَيْتٍ. أُحِبُّ دِرَاسَةَ اللُّغَةِ الْعَرَبِيَّةِ لِأَنَّهَا لُغَةُ الْقُرْآنِ الْكَرِيمِ وَالْحَدِيثِ النَّبَوِيِّ. وَتُرَبِّي أُسْرَتِي الْأَوْلَادَ بِالْمَحَبَّةِ وَالصَّبْرِ.
$reading$;
  v_khalid text := $reading$
اِسْمِي خَالِدٌ. أَدْرُسُ فِي الصَّفِّ الْأَوَّلِ الثَّانَوِيِّ، وَعُمْرِي سَبْعَ عَشْرَةَ سَنَةً. أُحِبُّ التَّارِيخَ لِأَنَّهُ يُعَرِّفُنِي أَحْوَالَ الْأُمَمِ السَّابِقَةِ وَحَيَاتَهَا. وَأُحِبُّ الْقِرَاءَةَ وَالْبَحْثَ عَنْ مَعْلُومَاتٍ جَدِيدَةٍ.
$reading$;
begin
  update public.questions q
  set prompt_arabic = v_abdullah
  from public.lessons l
  where q.lesson_id = l.id and l.slug = 'at-taaruf' and q.mode = 'mixed'
    and q.sort_order in (91, 93, 94, 97);

  update public.questions q
  set prompt_arabic = v_khalid
  from public.lessons l
  where q.lesson_id = l.id and l.slug = 'at-taaruf' and q.mode = 'mixed'
    and q.sort_order in (99, 104);
end $$;

update public.questions q
set options = '[{"id":"p1","arabic":"أَبِي","meaning":"Bekerja sebagai guru"},{"id":"p2","arabic":"أُمِّي","meaning":"Ibu rumah tangga"},{"id":"p3","arabic":"أُسْرَتِي","meaning":"Tinggal di desa dekat kota"},{"id":"p4","arabic":"تَرْبِيَةُ الْأَوْلَادِ","meaning":"Pendidikan anak dengan kasih sayang dan kesabaran"}]'::jsonb,
    explanation = 'Bacaan menjelaskan pekerjaan ayah, pekerjaan ibu, tempat tinggal keluarga, dan cara keluarga mendidik anak.'
from public.lessons l
where q.lesson_id = l.id and l.slug = 'at-taaruf' and q.mode = 'mixed' and q.sort_order = 93;

update public.questions q
set prompt = case q.sort_order
  when 91 then 'Berdasarkan bacaan, di kelas berapa Abdullah belajar?'
  when 93 then 'Jodohkan informasi dalam bacaan tentang Abdullah dengan keterangan yang sesuai.'
  when 97 then 'Apa pekerjaan ayah Abdullah menurut bacaan?'
  when 99 then 'Kalimat Arab mana yang menunjukkan usia Khalid?'
  when 104 then 'Berdasarkan bacaan, mengapa Khalid menyukai pelajaran sejarah?'
  else q.prompt
end
from public.lessons l
where q.lesson_id = l.id
  and l.slug = 'at-taaruf'
  and q.mode = 'mixed'
  and q.sort_order in (91, 93, 97, 99, 104);

-- Aturan bintang baru sama pada sisi browser dan database.
-- Skor 80 (12/15 jawaban benar) mendapat 2 bintang; skor 73 (11/15) mendapat 1.
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
    select 1 from public.stage_progress
    where user_id = v_user and lesson_id = v_lesson
      and level_no = v_level - 1 and completed_sessions > 0
  ) then
    raise exception 'Level ini masih terkunci. Selesaikan level sebelumnya terlebih dahulu.';
  end if;

  v_stars := case
    when v_score >= 90 then 3
    when v_score >= 75 then 2
    else 1
  end;

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

-- Hitung ulang bintang lama agar sesuai dengan aturan baru dan tidak mempertahankan skor 3 bintang dari aturan sebelumnya.
update public.stage_progress
set best_stars = case
  when best_score >= 90 then 3
  when best_score >= 75 then 2
  else 1
end
where completed_sessions > 0;

commit;
