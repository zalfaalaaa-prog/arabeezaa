# ARABEEZA — Bahan Ajar Bahasa Arab Interaktif

ARABEEZA adalah bahan ajar Bahasa Arab inklusif berbasis website untuk siswa kelas X Madrasah Aliyah (Fase E). Paket awal berfokus pada **Materi 1: التَّعَارُفُ (At-Ta‘āruf / Perkenalan)** sesuai dokumen rancangan yang diberikan.

Project ini menggunakan Next.js App Router, React, TypeScript, Tailwind CSS, dan Supabase (Auth + PostgreSQL). Struktur ZIP ini sengaja dibuat **langsung di root project**: folder `app/` dan file `package.json` berada sejajar. Karena itu, ketika diunggah ke GitHub, unggah **isi ZIP**, bukan folder pembungkusnya.

## Fitur pada paket awal

- Landing page ARABEEZA, registrasi, login, dan logout.
- Dashboard siswa: XP, berlian, 5 nyawa, streak harian, dan jalur materi.
- Materi 1 At-Ta‘āruf: kosakata berharakat, transliterasi, terjemahan, contoh kalimat, kata tanya, kata ganti, dan dialog.
- Empat pilihan latihan: campuran 4 maharah, menyimak, membaca/pelafalan, dan percakapan.
- Sesi latihan maksimal 15 soal, umpan balik benar/salah, serta pengulangan soal yang belum benar.
- Hadiah XP dan berlian berdasarkan skor; toko untuk menukar 100 berlian menjadi 5 nyawa.
- Profil dan pengaturan avatar dasar.
- Halaman capaian pembelajaran Fase E.
- Dashboard guru untuk melihat siswa dan menulis catatan pembelajaran.
- Supabase Row Level Security (RLS), migration, seed materi, dan fungsi database untuk menyimpan hasil sesi.
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
5. Jalankan seluruh isi `supabase/seed.sql` untuk memasukkan Materi 1, kosakata, dialog, dan bank soal.

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
8. Klik Deploy.

Halaman yang membutuhkan data Supabase ditandai `force-dynamic`, sehingga tidak diprerender saat build. Ini mencegah proses `next build` mencoba membaca sesi/database Supabase saat deployment. Koneksi Supabase tetap wajib tersedia saat pengguna membuka fitur login, dashboard, materi, latihan, profil, toko, atau dashboard guru.

### C. Pengaturan URL Supabase Auth

Setelah deployment berhasil, buka Supabase → Authentication → URL Configuration. Atur Site URL ke domain Vercel dan tambahkan domain deployment ke Redirect URLs, misalnya:

```text
https://NAMA-PROJECT.vercel.app/**
```

## 5. Membuat akun guru

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

## 6. Pemeriksaan sebelum rilis

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
