# ARABEEZA — Bahan Ajar Bahasa Arab Interaktif

ARABEEZA adalah bahan ajar Bahasa Arab inklusif berbasis website untuk siswa kelas X Madrasah Aliyah (Fase E). Paket awal berfokus pada **Materi 1: التَّعَارُفُ (At-Ta‘āruf / Perkenalan)** sesuai dokumen rancangan yang diberikan.

Project ini menggunakan Next.js App Router, React, TypeScript, Tailwind CSS, dan Supabase (Auth + PostgreSQL). Struktur ZIP ini sengaja dibuat **langsung di root project**: folder `app/` dan file `package.json` berada sejajar. Karena itu, ketika diunggah ke GitHub, unggah **isi ZIP**, bukan folder pembungkusnya.

## Pembaruan ARABEEZA V15

- Navigasi desktop dipindahkan ke sidebar kiri yang tetap terlihat, dengan menu Beranda, Materi, Capaian, Latihan, Dialog & Audio, Toko Hadiah, dan Profil. Navigasi mobile tetap responsif.
- Dashboard desktop memakai tiga area: sidebar kiri, jalur belajar tujuh tahap di tengah, serta sapaan siswa dan statistik belajar di kanan. Animasi utama dibatasi pada level.
- Katalog Materi menampilkan Bab 1 sampai Bab 4. Bab 1 At-Ta‘āruf tetap menjadi satu-satunya bab aktif; Bab 2 Al-Usrah, Bab 3 Al-Madrasah, dan Bab 4 Afrād al-Bayt dapat dibuka sebagai halaman placeholder bertuliskan “Materi belum dimasukkan”.
- Banner belajar disederhanakan menjadi BAB 1, At-Ta‘āruf, dan terjemahannya tanpa kalimat instruksi yang berulang.
- Ikon streak, berlian, nyawa, XP, dan bintang menggunakan ilustrasi SVG bergradasi agar lebih konsisten di layar ponsel dan laptop.
- Ikon kucing pada bagian Capaian menggunakan maskot Arabeeza yang sama, bukan emoji kucing terpisah.
- Audio dialog menormalkan akhiran nama Faris, Nadia, dan Hana agar tidak dibaca dengan akhiran i‘rab ketika nama dipanggil. Teks Arab yang terlihat di materi tidak diubah.
- Area tabel kata tanya dan dhamir memiliki scroll horizontal sendiri. Gerakan pada tabel, tombol, dan tautan tidak lagi diperlakukan sebagai gesture pindah slide.
- Area sentuh tombol utama diperbesar untuk penggunaan HP, termasuk tombol audio, navigasi slide, pilihan jawaban, menu mobile, dan kontrol aksesibilitas.
- Tidak ada migration database baru pada V15. Migration 009 tetap diperlukan jika database belum menerapkan penyimpanan bintang terbaik.

## Pembaruan ARABEEZA V14

- Identitas utama menggunakan tema maroon, deep maroon, blush, cream, dan champagne gold. Indikator jawaban benar tetap hijau dan jawaban salah tetap merah.
- Materi aktif dibatasi pada Bab 1 At-Ta‘āruf; tujuh tahap latihan tetap tersedia di dalam Bab 1.
- Banner dashboard menampilkan label BAB 1 tanpa ikon buku. Katalog Materi hanya menampilkan satu kartu sampul Bab 1.
- Area materi inti dapat digulir secara vertikal di dalam panel presentasi.
- Catatan guru tidak ditampilkan pada profil siswa; pengelolaan catatan tetap tersedia di halaman guru.
- Toko hadiah menyediakan isi ulang lima nyawa dengan 25 berlian atau 100 XP.
- Praktik tahap 6 diberi identitas Praktik Dialog dan tahap 7 Praktik Penerapan.
- Hasil tahap menampilkan pencapaian bintang terbaik; pengulangan dengan skor lebih rendah tidak menurunkan bintang tersimpan.
- Maskot dan avatar dibuat lebih bulat serta diberi animasi lembut.

## Pembaruan pada revisi sebelumnya

- Navigasi mobile menampilkan label Beranda, Materi, Capaian, Toko, dan Profil.
- Maskot kucing Arabeeza tampil di beranda dan selama latihan; logo SVG juga diganti menjadi kucing.
- Dashboard menampilkan jalur visual 7 tahap dengan ikon ilustratif; banner unit memakai indigo agar berbeda dari level pertama yang hijau, dan bulatan level bergerak naik-turun secara halus.
- Jawaban tidak langsung dikoreksi saat dipilih. Siswa harus menekan tombol **Periksa jawaban**.
- Soal yang meminta arti kosakata tidak menampilkan ulang teks Arab yang merupakan petunjuk jawaban.
- Setiap jawaban salah mengurangi satu nyawa dan tersimpan di Supabase; isi ulang hingga 5 nyawa dapat menggunakan 25 berlian atau 100 XP. Jalankan migration 002, 003, dan 004 pada database yang sudah ada.
- Avatar mendapat opsi karakter laki-laki/perempuan, model rambut, kerudung, dan ekspresi wajah.
- Capaian At-Ta‘āruf dilengkapi tujuh target pembelajaran sesuai dokumen revisi.

**Bank soal:** Materi 1 memiliki 105 butir unik (7 tahap × 15 soal) berdasarkan Bab 1 At-Ta'aruf. Setiap tahap mencampurkan pilihan ganda, menjodohkan arti Arab–Indonesia, menyusun keping kata, listening, speaking-repeat, dan kosakata bergambar. Tingkat kesulitan bergerak dari salam/perkenalan dasar menuju dhamir, kata tanya, kosakata, dialog, dan pemahaman bacaan. Konten database dan bank soal pada paket ini tetap berfokus pada Bab 1. Kartu Bab 2–4 di katalog merupakan placeholder antarmuka berdasarkan tema yang telah muncul pada rancangan ARABEEZA; kontennya belum disediakan.

## Aksesibilitas dan pembelajaran inklusif (V11)

ARABEEZA menyediakan panel **Aksesibilitas** yang tersedia di seluruh halaman. Pengaturan disimpan secara lokal pada perangkat/browser yang digunakan, sehingga siswa dapat menyesuaikan pengalaman belajar tanpa harus membuat profil disabilitas. Fitur V11 meliputi:

- Ukuran teks Normal, Besar, dan Lebih besar.
- Kontras tinggi untuk memperjelas teks, batas, tombol, dan fokus.
- Huruf antarmuka yang lebih sederhana serta jarak teks yang lebih lega.
- Garis bawah tautan agar tautan tidak dibedakan hanya berdasarkan warna.
- Pengurangan animasi, termasuk dukungan preferensi `prefers-reduced-motion` dari sistem operasi.
- Tombol untuk membacakan teks yang dipilih melalui Web Speech API jika browser mendukungnya.
- Tautan lewati navigasi untuk pengguna keyboard dan pembaca layar.
- Label, nama aksesibel, status, progress bar, dan grup kontrol pada elemen pembelajaran.
- Transkrip audio opsional pada soal menyimak sebagai alternatif bagi siswa yang tidak dapat mendengar audio.
- Alternatif mengetik jawaban pada latihan speaking-repeat jika mikrofon tidak dapat digunakan; opsi melewati latihan tetap tersedia.
- Latihan menjodohkan tetap berbasis tombol, sehingga dapat dioperasikan dengan keyboard dan tidak bergantung pada drag-and-drop. Status pasangan benar/salah juga diumumkan melalui teks aksesibel dan ikon.

Pengaturan aksesibilitas berlaku lintas halaman pada browser/perangkat yang sama. Pengaturan belum disinkronkan ke akun Supabase dan tidak otomatis berpindah ke perangkat lain. Fitur pembaca suara bergantung pada dukungan suara yang tersedia di browser/perangkat. Panel ini merupakan fondasi aksesibilitas; audit manual dengan pembaca layar, keyboard, dan perangkat bantu tetap perlu dilakukan sebelum menyatakan kesesuaian WCAG secara penuh.

## Fitur pada paket awal

- Landing page ARABEEZA, registrasi, login, dan logout.
- Dashboard siswa: XP, berlian, 5 nyawa, streak harian, dan jalur materi.
- Materi 1 At-Ta‘āruf: tujuan pembelajaran, salam dan perkenalan, kosakata, kata tanya, dhamir munfashil/muttashil, dialog, bacaan, penerapan, dan empat maharah.
- Latihan terintegrasi 4 maharah pada setiap tahap: menyimak, berbicara, membaca, dan menulis.
- Tujuh tahap latihan dengan 15 soal per tahap; variasi menjodohkan, word bank, listening, speaking-repeat (dengan opsi skip), kosakata bergambar, dan pilihan ganda; umpan balik setelah tombol Periksa; serta pengulangan soal yang belum benar.
- Hadiah XP dan berlian berdasarkan skor; toko untuk menukar 25 berlian menjadi 5 nyawa, dengan opsi alternatif 100 XP.
- Profil dan pengaturan avatar dasar.
- Halaman capaian pembelajaran Fase E.
- Dashboard guru untuk melihat siswa dan menulis catatan pembelajaran.
- Supabase Row Level Security (RLS), migration, seed materi, fungsi menyimpan hasil sesi, dan RPC pengurangan nyawa.
- Tampilan responsif dan struktur navigasi mobile.

> Catatan cakupan: katalog avatar lanjutan, fitur mengikuti teman, animasi video streak, serta editor bank soal visual belum termasuk pada paket tahap awal. Struktur database dan aplikasi dapat dikembangkan untuk fitur tersebut.

## Teknologi dan versi runtime

- Node.js 20.9+ (disarankan Node.js 22)
- Next.js 15 App Router
- React 19
- TypeScript 5
- Tailwind CSS 3
- Supabase Auth + PostgreSQL
- Vercel untuk deployment

## 1. Struktur project

```text
ARABEEZA/
├── app/
│   ├── dashboard/
│   ├── lessons/[slug]/
│   ├── login/
│   ├── outcomes/
│   ├── practice/[slug]/
│   ├── profile/
│   ├── register/
│   ├── shop/
│   ├── teacher/
│   ├── actions.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
├── docs/
├── lib/supabase/
├── public/
├── supabase/migrations/001_init.sql
├── supabase/seed.sql
├── middleware.ts
├── package.json
└── next.config.ts
```

## 2. Jalankan secara lokal

```bash
npm install
```

Salin `.env.example` menjadi `.env.local`, lalu isi kredensial Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_OR_PUBLIC_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Jika project Supabase menggunakan publishable key baru, dapat digunakan sebagai alternatif:

```env
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

Kemudian jalankan:

```bash
npm run dev
```

Buka `http://localhost:3000`.

## 3. Siapkan database Supabase

1. Buat project baru di Supabase.
2. Buka **Project Settings → API** untuk mengambil Project URL dan anon/public key atau publishable key.
3. Buka **SQL Editor**.
4. Jalankan seluruh isi `supabase/migrations/001_init.sql`.
5. Jalankan seluruh isi `supabase/migrations/002_arabeeza_revision.sql` untuk harga isi ulang nyawa 25 berlian dan opsi avatar lanjutan.
6. Jalankan seluruh isi `supabase/seed.sql` untuk memasukkan Materi 1, kosakata, dialog, dan bank soal awal.
7. Jalankan migration `003_materi1_105_questions_and_lives.sql`, `004_daily_hearts_reset.sql`, dan `005_stage_progress.sql` secara berurutan.
8. Jalankan migration `006_interactive_question_types.sql` untuk bank soal terbaru dengan tipe interaktif.
9. Jalankan migration `007_dialogue_xp_refill_and_indonesian_word_order.sql` untuk dialog Faris–Zaid, soal susun kata berbasis arti Indonesia, dan isi ulang nyawa dengan 100 XP.
10. Jalankan migration `008_v13_dialogue_assessment_and_star_rules.sql` untuk dialog latihan, bacaan, alternatif aktivitas non-audio, dan ambang bintang 90/75.
11. Jalankan migration `009_best_stars_persistence.sql` agar bintang terbaik selalu tersimpan dan tidak turun saat siswa mengulang tahap.

Urutan instalasi untuk database baru: migration 001–002, seed.sql untuk membuat materi/bab, lalu migration 003–009 secara berurutan. Pada database yang sudah menjalankan migration 001–008, cukup jalankan migration 009. Jika migration 007 atau 008 belum dijalankan, selesaikan urutannya terlebih dahulu. File seed dapat dijalankan ulang; data inti memakai kunci unik agar tidak menggandakan baris.

## 4. Deploy ke GitHub dan Vercel

### A. Upload ke GitHub

1. Buat repository baru, misalnya `arabeeza`.
2. Ekstrak ZIP ini.
3. Masuk ke folder hasil ekstraksi.
4. Pilih seluruh isi folder (termasuk `app`, `components`, `lib`, `package.json`, dan file konfigurasi).
5. Upload ke **root repository GitHub**. Jangan membuat folder tambahan seperti `arabeeza/arabeeza/`.
6. Pastikan halaman utama repository langsung menampilkan folder `app` dan file `package.json`.

### B. Konfigurasi Vercel

1. Impor repository GitHub ke Vercel.
2. Framework Preset: **Next.js**.
3. Root Directory: **kosong / `./`** karena `app/` dan `package.json` berada di root repository.
4. Build Command: `npm run build` (default Next.js juga boleh).
5. Install Command: `npm install`.
6. Output Directory: biarkan default/kosong.
7. Tambahkan Environment Variables berikut untuk **Production** dan **Preview**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (atau `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`)
   - `NEXT_PUBLIC_SITE_URL` (isi dengan domain utama Vercel, misalnya `https://nama-project.vercel.app`)
8. Klik Deploy.

Halaman yang membutuhkan data Supabase ditandai `force-dynamic`, sehingga tidak diprerender saat build. Ini mencegah proses `next build` mencoba membaca sesi/database Supabase saat deployment. Koneksi Supabase tetap wajib tersedia saat pengguna membuka fitur login, dashboard, materi, latihan, profil, toko, atau dashboard guru.

### C. Pengaturan URL Supabase Auth dan verifikasi email

Setelah deployment berhasil, buka Supabase → Authentication → URL Configuration.

- Atur **Site URL** ke domain utama Vercel, misalnya `https://nama-project.vercel.app`.
- Tambahkan URL callback berikut ke **Redirect URLs**: `https://nama-project.vercel.app/auth/callback`.
- Pastikan provider **Email** aktif pada Authentication → Providers.
- Jika verifikasi email diaktifkan, siswa harus membuka email konfirmasi sebelum dapat login. Aplikasi akan menampilkan instruksi setelah pendaftaran.
- Pastikan `NEXT_PUBLIC_SITE_URL` di Vercel sama dengan domain utama tersebut, lalu redeploy setelah mengubah Environment Variables.

Route `/auth/callback` menukar kode verifikasi menjadi sesi login Supabase dan mengarahkan siswa ke dashboard.

## 5. Alur registrasi dan login siswa

1. Siswa membuka `/register`, mengisi nama lengkap, email, dan kata sandi minimal 8 karakter.
2. Aplikasi mengirim pendaftaran ke Supabase Auth dan menyimpan `display_name` sebagai metadata pengguna.
3. Jika Supabase mengaktifkan konfirmasi email, halaman registrasi menampilkan instruksi untuk membuka email dan mengklik tautan verifikasi. Tautan diarahkan ke `/auth/callback`, lalu sesi ditukar dan pengguna diarahkan ke dashboard.
4. Jika konfirmasi email dinonaktifkan, sesi langsung dibuat dan pengguna diarahkan ke `/dashboard`.
5. Profil siswa dibuat otomatis oleh trigger `on_auth_user_created` dari migration `001_init.sql`.

Jika tombol daftar tidak menghasilkan akun, periksa:
- Environment Variables `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` atau `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- Migration `supabase/migrations/001_init.sql` sudah dijalankan pada project Supabase yang sama.
- Authentication → Providers → Email dalam keadaan aktif.
- Authentication → URL Configuration memiliki URL callback domain aplikasi.
- Authentication → Users untuk memastikan apakah user baru benar-benar tercatat.

## 6. Membuat akun guru

Registrasi normal membuat role `student`. Untuk mengubah akun tertentu menjadi guru:

1. Daftarkan akun melalui `/register`.
2. Buka Supabase → Authentication → Users dan salin UUID akun.
3. Jalankan SQL berikut:

```sql
update public.profiles
set role = 'teacher'
where id = 'UUID-AKUN-GURU';
```

4. Login ulang. Menu `/teacher` tersedia untuk role `teacher` atau `admin`.

Jangan memberikan role guru/admin kepada pengguna umum.

## 7. Pemeriksaan sebelum rilis

```bash
npm run typecheck
npm run build
```

Pastikan juga:
- Root GitHub langsung memiliki folder `app/` dan file `package.json`.
- Root Directory Vercel kosong/`./`.
- Environment Variables Supabase terisi tanpa spasi tambahan.
- Migration dan seed telah dijalankan pada project Supabase yang benar.
- URL Vercel telah dimasukkan ke konfigurasi Supabase Auth.

## Catatan fitur dan validasi

- Audio menggunakan suara Arab yang tersedia pada browser/perangkat; ketersediaan suara dan Speech Recognition berbeda antar-browser.
- Avatar pada paket awal menggunakan pilihan warna karakter dan pakaian dasar.
- Bank soal awal adalah materi contoh yang perlu ditinjau guru sebelum digunakan untuk penilaian resmi.
- Hasil latihan disimpan melalui Supabase RPC. Sebelum digunakan sebagai penilaian berisiko tinggi, validasi jawaban dan perhitungan hadiah sebaiknya dipindahkan sepenuhnya ke server/database.
- Jika verifikasi email Supabase aktif, siswa perlu mengonfirmasi email sebelum login.

## Identitas bahan ajar

- Nama bahan ajar: Bahan Ajar Bahasa Arab Inklusif Berbasis Website
- Nama produk: **ARABEEZA**
- Mata pelajaran: Bahasa Arab
- Satuan pendidikan: Madrasah Aliyah (MA)
- Kelas/Fase: X / Fase E
- Materi awal: التَّعَارُفُ (At-Ta‘āruf / Perkenalan)
- Submateri: أَدَوَاتُ الِاسْتِفْهَامِ (kata tanya) dan الضَّمَائِرُ (kata ganti)
- Pendekatan: komunikatif dan desain pembelajaran inklusif
- Penyusun: Wahda Lathifa Zalfa
- Tahun pengembangan: 2026

## Pembaruan lanjutan Materi 1 — 7 tahap dan 105 soal

Versi ini mengganti jalur latihan menjadi 7 tahap dengan 15 soal unik per tahap (105 soal total). Halaman **Materi 1** juga memuat salam dan perkenalan, kosakata, kata tanya, dhamir, dialog, bacaan, penerapan, serta latihan empat maharah.

### Update database Supabase yang sudah ada

Setelah `001_init.sql`, `002_arabeeza_revision.sql`, dan `seed.sql` pernah dijalankan, jalankan file berikut satu kali melalui Supabase → SQL Editor:

`supabase/migrations/003_materi1_105_questions_and_lives.sql`, `supabase/migrations/004_daily_hearts_reset.sql`, dan `supabase/migrations/005_stage_progress.sql`

Migration 003 mengganti bank soal `mixed` Materi 1 dengan 105 butir dan membuat RPC `consume_heart()` untuk menyimpan pengurangan nyawa setiap jawaban salah. Migration 004 menambahkan reset otomatis 5 nyawa pada pergantian hari pukul 00.00 WIB. Isi ulang manual dapat menggunakan 25 berlian atau 100 XP melalui migration 007.

Verifikasi jumlah soal:

```sql
select count(*)
from public.questions q
join public.lessons l on l.id = q.lesson_id
where l.slug = 'at-taaruf' and q.mode = 'mixed' and q.is_published = true;
```

Hasil yang diharapkan: `105`.

### Untuk instalasi Supabase baru

Jalankan berurutan:
1. `supabase/migrations/001_init.sql`
2. `supabase/migrations/002_arabeeza_revision.sql`
3. `supabase/seed.sql`
4. `supabase/migrations/003_materi1_105_questions_and_lives.sql`
5. `supabase/migrations/004_daily_hearts_reset.sql`
6. `supabase/migrations/005_stage_progress.sql`

Setelah database siap, unggah seluruh isi ZIP ke root repository GitHub lalu lakukan redeploy di Vercel. Tidak ada environment variable baru untuk revisi ini.


### Regenerasi nyawa harian (revisi v4)

Migration `004_daily_hearts_reset.sql` menambahkan `hearts_reset_date` dan RPC `refresh_daily_hearts()`. Setiap akun mendapat 5 nyawa lagi pada pergantian tanggal pukul 00.00 WIB (Asia/Jakarta), tanpa mengurangi berlian. Jika siswa tidak membuka aplikasi tepat tengah malam, reset tetap diterapkan saat siswa membuka halaman atau kembali ke tab. Efek suara singkat dimainkan setiap kali jawaban diperiksa; jawaban benar juga tetap mendapat ucapan apresiasi Bagus/Mumtaz/Keren.


### Progres level dan bintang (Revisi v5)

Jalankan migration `005_stage_progress.sql` setelah migration 001–004. Tujuh tahap akan terbuka secara berurutan; tahap terkunci berwarna abu-abu. Setiap tahap menampilkan tiga bintang berdasarkan jawaban benar pada percobaan pertama (15 benar = 3 bintang; 10–14 benar = 2 bintang; 0–9 benar = 1 bintang). Saat mengulang tahap, skor dan bintang terbaik tidak akan diturunkan.


## Revisi v7

- Banner judul bab/unit pada jalur level bersifat sticky saat level di-scroll.
- Jalur level memakai palet pastel sage/teal/dusty rose/olive yang lebih konsisten; garis putus-putus dihapus.
- Area klik level diperbesar untuk ponsel.
- Materi dan Capaian dipindahkan menjadi menu navigasi agar Beranda lebih fokus pada jalur belajar.
- Profil memakai enam karakter kucing Arabeeza dengan aksesori dan ekspresi berbeda.
- Audio apresiasi dibuat lebih lambat dan ekspresif; audio latihan memiliki safety timeout yang lebih longgar.
- Speech Recognition untuk latihan berbicara memakai pencocokan toleran agar transkripsi yang sedikit berbeda tidak langsung dianggap salah.


## ARABEEZA V12 — Revisi materi dan interaksi

V12 menambahkan landing page satu layar, katalog sampul bab, tampilan percakapan per baris, perbaikan penanda pasangan salah, petunjuk susun kalimat berbasis arti Bahasa Indonesia, animasi pemilihan karakter, dan isi ulang nyawa menggunakan XP.

### Database
Jalankan migration `supabase/migrations/007_dialogue_xp_refill_and_indonesian_word_order.sql` setelah migration 001–006. Fungsi `buy_hearts_with_xp()` menetapkan biaya 100 XP di sisi database dan mengisi nyawa hingga 5.


## Revisi V13

- Palet warna diperhalus menjadi pastel pink, peach, kuning, mint, biru, lavender, dan periwinkle.
- Halaman login menggunakan layout dua kolom dengan maskot kucing yang lebih ramah.
- Materi inti ditampilkan sebagai presentasi slide yang dapat digeser pada perangkat seluler.
- Dialog latihan dibedakan dari dialog materi dan tersedia pemutaran berurutan dengan dua profil suara/intonasi bila didukung browser.
- Audio listening tidak menampilkan transkrip yang membocorkan jawaban; siswa dapat memilih alternatif non-audio tanpa penalti dan tanpa pengulangan.
- Latihan speaking repeat tidak menampilkan teks target sebelum dijawab; siswa dapat beralih ke susun kata.
- Skor bintang: 90-100 = 3 bintang, 75-89 = 2 bintang, di bawah 75 = 1 bintang.
- Jalankan migration `supabase/migrations/008_v13_dialogue_assessment_and_star_rules.sql` setelah migration 001-007.


### Pembaruan V16
- Sidebar desktop tetap di sisi kiri saat konten halaman digulir.
- Menu utama diringkas: Beranda, Materi, Capaian, Toko Hadiah, dan Profil. Latihan, dialog, dan audio tetap berada di dalam Materi.
- Tombol Keluar tersedia di bagian paling bawah sidebar desktop; pada mobile tetap tersedia di Profil.
- Ikon berlian Toko Hadiah disamakan dengan ikon berlian pada Beranda menggunakan komponen SVG ARABEEZA.
