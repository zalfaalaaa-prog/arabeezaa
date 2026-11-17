# Catatan revisi Arabeeza — pembaruan lanjutan

## Perubahan pada versi ini
- Jalur belajar Materi 1 diubah menjadi **7 bulatan** dengan ikon ilustratif (tanpa angka dan tanpa label mudah/menengah/menantang).
- Warna jalur dan kartu materi mengikuti palet referensi: cream `#FFEDD6`, sage `#A5AF79`, cokelat `#827148`, dan salmon `#E8A07C` beserta turunannya.
- Judul akses panduan diubah menjadi **Materi 1**.
- Halaman Materi 1 diperluas: tujuan pembelajaran, pertanyaan pemantik, salam dan perkenalan, kosakata, adawatul istifham, dhamir, dhamir munfashil/muttashil, dialog, bacaan, penerapan, dan empat maharah.
- Materi 1 memiliki **105 soal unik**, dibagi menjadi 7 tahap dengan 15 soal per tahap.
- Setiap tahap menggabungkan keterampilan menyimak, berbicara, membaca, dan menulis.
- Pertanyaan listening tidak menampilkan stimulus Arab sebelum tombol audio ditekan. Soal terjemahan tidak menampilkan jawaban pada teks pertanyaan.
- Alur jawaban tetap menggunakan tombol **Periksa jawaban**; koreksi baru muncul setelah diperiksa.
- Setiap jawaban salah mengurangi satu nyawa, termasuk ketika siswa mengulang soal yang sebelumnya salah.
- Pengurangan nyawa disimpan ke profil Supabase melalui RPC `consume_heart`.
- Saat nyawa habis, muncul dialog dengan dua pilihan: isi ulang 5 nyawa menggunakan 25 berlian atau akhiri pelajaran.
- Jawaban benar memicu suara apresiasi “Bagus”, “Mumtaz”, atau “Keren” menggunakan suara perangkat/browser.
- Setelah menyelesaikan satu tahap, siswa dapat mengulang tahap tersebut atau lanjut ke tahap berikutnya.

## Wajib dilakukan setelah update
1. Buka Supabase → SQL Editor.
2. Jalankan `supabase/migrations/003_materi1_105_questions_and_lives.sql` setelah migration `001`, migration `002`, dan seed awal sudah dijalankan.
3. Pastikan query berikut mengembalikan 105 baris untuk Materi 1:
   ```sql
   select count(*)
   from public.questions q
   join public.lessons l on l.id = q.lesson_id
   where l.slug = 'at-taaruf' and q.mode = 'mixed' and q.is_published = true;
   ```
4. Commit dan push seluruh isi ZIP ke root repository GitHub (folder `app/` dan `package.json` harus langsung berada di root).
5. Redeploy project pada Vercel. Environment variables Supabase yang sudah ada tetap digunakan.

## Catatan penggunaan
- Suara apresiasi dan audio Bahasa Arab memakai Speech Synthesis browser/perangkat. Suara yang tersedia dapat berbeda antarperangkat.
- Latihan berbicara memakai Speech Recognition jika browser mendukungnya. Jika tidak, siswa tetap dapat memilih jawaban secara manual.
- Soal dibuat mengikuti cakupan materi At-Ta‘āruf pada LKS yang dilampirkan. Guru tetap disarankan meninjau redaksi dan kunci sebelum digunakan sebagai asesmen resmi.
