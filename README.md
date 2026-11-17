# ARABEEZA — Bahan Ajar Bahasa Arab Interaktif

ARABEEZA adalah bahan ajar Bahasa Arab inklusif berbasis website untuk siswa kelas X Madrasah Aliyah (Fase E). Paket awal berfokus pada **Materi 1: التَّعَارُفُ (At-Ta‘āruf / Perkenalan)** sesuai dokumen rancangan yang diberikan.

Project ini menggunakan Next.js App Router, React, TypeScript, Tailwind CSS, dan Supabase (Auth + PostgreSQL). Struktur ZIP ini sengaja dibuat **langsung di root project**: folder `app/` dan file `package.json` berada sejajar. Karena itu, ketika diunggah ke GitHub, unggah **isi ZIP**, bukan folder pembungkusnya.

## Pembaruan pada revisi ini

- Navigasi mobile menampilkan label Beranda, Capaian, Toko, dan Profil.
- Maskot kucing Arabeeza tampil di beranda dan selama latihan; logo SVG juga diganti menjadi kucing.
- Dashboard menampilkan jalur visual 7 tahap dengan ikon ilustratif dan warna dari palet Arabeeza.
- Jawaban tidak langsung dikoreksi saat dipilih. Siswa harus menekan tombol **Periksa jawaban**.
- Soal yang meminta arti kosakata tidak menampilkan ulang teks Arab yang merupakan petunjuk jawaban.
- Setiap jawaban salah mengurangi satu nyawa dan tersimpan di Supabase; isi ulang 5 nyawa memerlukan 25 berlian. Jalankan migration 002, 003, dan 004 pada database yang sudah ada.
- Avatar mendapat opsi karakter laki-laki/perempuan, model rambut, kerudung, dan ekspresi wajah.
- Capaian At-Ta‘āruf dilengkapi tujuh target pembelajaran sesuai dokumen revisi.

**Bank soal:** Materi 1 kini memiliki 105 butir unik, dibagi ke dalam 7 tahap dengan 15 soal per tahap. Setiap tahap menggabungkan menyimak, berbicara, membaca, dan menulis. Materi 2–5 merupakan bagian/topik di dalam cakupan Materi 1 sesuai LKS yang dilampirkan, bukan empat bab terpisah di database.

## Fitur pada paket awal

- Landing page ARABEEZA, registrasi, login, dan logout.
- Dashboard siswa: XP, berlian, 5 nyawa, streak harian, dan jalur materi.
- Materi 1 At-Ta‘āruf: tujuan pembelajaran, salam dan perkenalan, kosakata, kata tanya, dhamir munfashil/muttashil, dialog, bacaan, penerapan, dan empat maharah.
- Latihan terintegrasi 4 maharah pada setiap tahap: menyimak, berbicara, membaca, dan menulis.
- Tujuh tahap latihan dengan 15 soal per tahap, umpan balik setelah tombol Periksa, serta pengulangan soal yang belum benar.
- Hadiah XP dan berlian berdasarkan skor; toko untuk menukar 25 berlian menjadi 5 nyawa.
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
6. Jalankan seluruh isi `supabase/seed.sql` untuk memasukkan Materi 1, kosakata, dialog, dan bank soal.

Jalankan migration sebelum seed. File seed dapat dijalankan ulang; data inti memakai kunci unik agar tidak menggandakan baris.

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

`supabase/migrations/003_materi1_105_questions_and_lives.sql` dan setelah itu `supabase/migrations/004_daily_hearts_reset.sql`

Migration 003 mengganti bank soal `mixed` Materi 1 dengan 105 butir dan membuat RPC `consume_heart()` untuk menyimpan pengurangan nyawa setiap jawaban salah. Migration 004 menambahkan reset otomatis 5 nyawa pada pergantian hari pukul 00.00 WIB. Isi ulang manual tetap menggunakan 25 berlian.

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

Setelah database siap, unggah seluruh isi ZIP ke root repository GitHub lalu lakukan redeploy di Vercel. Tidak ada environment variable baru untuk revisi ini.


### Regenerasi nyawa harian (revisi v4)

Migration `004_daily_hearts_reset.sql` menambahkan `hearts_reset_date` dan RPC `refresh_daily_hearts()`. Setiap akun mendapat 5 nyawa lagi pada pergantian tanggal pukul 00.00 WIB (Asia/Jakarta), tanpa mengurangi berlian. Jika siswa tidak membuka aplikasi tepat tengah malam, reset tetap diterapkan saat siswa membuka halaman atau kembali ke tab. Efek suara singkat dimainkan setiap kali jawaban diperiksa; jawaban benar juga tetap mendapat ucapan apresiasi Bagus/Mumtaz/Keren.
