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
- [ ] Seed `supabase/seed.sql` telah dijalankan.
- [ ] Site URL dan Redirect URLs memuat domain Vercel.

## Setelah deploy

- [ ] Halaman landing dapat dibuka.
- [ ] Registrasi dan login berhasil.
- [ ] Dashboard dapat memuat profil.
- [ ] Materi At-Ta‘āruf tampil.
- [ ] Latihan 15 soal dapat diselesaikan.
- [ ] Profil dan catatan guru dapat dibuka sesuai role.
