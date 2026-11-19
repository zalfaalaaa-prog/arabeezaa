# Checklist Deploy ARABEEZA ke Vercel

## Struktur repository

- [ ] `app/` berada langsung di root repository.
- [ ] `package.json` berada langsung di root repository.
- [ ] Tidak ada folder pembungkus tambahan yang membuat path menjadi `arabeeza/arabeeza/app`.
- [ ] Vercel Root Directory kosong atau `./`.

## Vercel

- [ ] Framework Preset: Next.js.
- [ ] Install Command: `npm install`.
- [ ] Build Command: `npm run build`.
- [ ] Output Directory: default/kosong.
- [ ] `NEXT_PUBLIC_SUPABASE_URL` tersedia.
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` atau `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` tersedia.
- [ ] Kedua variabel tersedia pada Production dan Preview.

## Supabase

- [ ] Migration `supabase/migrations/001_init.sql` telah dijalankan.
- [ ] Migration `supabase/migrations/002_arabeeza_revision.sql` telah dijalankan.
- [ ] Seed `supabase/seed.sql` telah dijalankan.
- [ ] Migration `supabase/migrations/003_materi1_105_questions_and_lives.sql` telah dijalankan.
- [ ] Migration `supabase/migrations/004_daily_hearts_reset.sql` telah dijalankan.
- [ ] Migration `supabase/migrations/005_stage_progress.sql` telah dijalankan.
- [ ] Migration `supabase/migrations/006_interactive_question_types.sql` telah dijalankan.
- [ ] Site URL dan Redirect URLs memuat domain Vercel.

## Setelah deploy

- [ ] Halaman landing dapat dibuka.
- [ ] Registrasi dan login berhasil.
- [ ] Dashboard dapat memuat profil.
- [ ] Materi At-Ta‘āruf tampil.
- [ ] Ketujuh tahap Materi 1 masing-masing memuat 15 soal (105 soal total).
- [ ] Tahap 1 terbuka dan tahap 2–7 terkunci sampai tahap sebelumnya selesai.
- [ ] Setiap tahap menampilkan tiga bintang; skor terbaik tidak turun saat siswa mengulang.
- [ ] Audio Maryam dapat diputar dan dihentikan tanpa membuat halaman tersangkut.
- [ ] Dialog percakapan tampil per baris dengan nama pembicara.
- [ ] Jawaban salah mengurangi nyawa dan dialog isi ulang tampil saat nyawa habis.
- [ ] Profil dan catatan guru dapat dibuka sesuai role.


## Database update for the Arabeeza revision

For an existing Supabase project, run `supabase/migrations/002_arabeeza_revision.sql` in SQL Editor after the original migration. This updates the heart refill price to 25 diamonds and adds avatar customization columns. No Vercel environment variable changes are required. Commit/push the revised ZIP contents to GitHub, then redeploy the project on Vercel.

## Update bank soal dan nyawa

Pada database yang sudah digunakan, jalankan `supabase/migrations/003_materi1_105_questions_and_lives.sql` melalui Supabase SQL Editor. Migration ini mengganti bank soal campuran Materi 1 menjadi 105 soal unik (7 × 15) dan menambahkan RPC `consume_heart()` agar setiap jawaban salah tersimpan sebagai pengurangan satu nyawa.

## Reset nyawa harian dan efek suara

Untuk database Arabeeza yang sudah menjalankan migration 001–003, jalankan satu kali `supabase/migrations/004_daily_hearts_reset.sql` melalui Supabase → SQL Editor sebelum memakai/deploy kode v4. Fungsi ini memakai tanggal Asia/Jakarta (WIB). Nyawa kembali menjadi 5 pada 00.00 WIB; bila pengguna tidak sedang membuka aplikasi, reset diproses saat halaman berikutnya dibuka atau saat pengguna kembali ke tab. Tidak ada berlian yang dipotong untuk reset harian.

Efek suara jawaban dibuat melalui Web Audio API di browser: bunyi chime berbeda untuk jawaban benar dan salah. Tidak memerlukan file audio, environment variable, atau perubahan database tambahan selain migration 004.


## Revisi v5 — progres tujuh tahap dan audio

Untuk database yang sudah menjalankan migration 001–004, jalankan satu kali `supabase/migrations/005_stage_progress.sql` di Supabase → SQL Editor sebelum menggunakan fitur bintang dan pembukaan tahap. Tahap 1 terbuka; tahap 2–7 baru terbuka setelah tahap sebelumnya diselesaikan. Skor dan bintang terbaik per tahap disimpan di tabel `stage_progress`. Bintang dihitung dari jawaban benar percobaan pertama: 15/15 = 3 bintang, 10–14/15 = 2 bintang, dan 0–9/15 = 1 bintang. Progres v4 yang sebelumnya hanya direkap per materi tetap tersimpan, tetapi tidak dapat dipetakan secara akurat ke tujuh tahap; pencatatan bintang per tahap dimulai pada revisi ini.

Audio Arab menggunakan Speech Synthesis bawaan browser dan memprioritaskan voice Bahasa Arab yang namanya mengindikasikan suara perempuan. Ketersediaan voice bergantung pada perangkat/browser; untuk hasil terbaik gunakan Chrome atau Edge terbaru dengan voice Arabic yang terpasang. Kontrol audio dapat menghentikan pemutaran, dan pemutaran otomatis dihentikan bila terlalu lama agar tidak membuat latihan tersangkut.


## Revisi v10 — bank soal interaktif

Untuk database yang sudah menjalankan migration 001–005, jalankan satu kali `supabase/migrations/006_interactive_question_types.sql` melalui Supabase SQL Editor. Migration ini memperbarui 105 soal Materi 1 tanpa menghapus data akun atau progres siswa. Setelah itu push source code ke GitHub dan tunggu deployment Vercel selesai.

Uji setelah deploy: matching Arab–Indonesia, susun kata, audio listening, speaking-repeat dengan tombol skip, pilihan kosakata bergambar, dan pengacakan posisi jawaban.
