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


## Revisi v4 — nyawa harian dan efek suara jawaban

- Nyawa akun kembali menjadi 5 pada pergantian hari pukul 00.00 WIB (Asia/Jakarta); reset tidak mengurangi berlian.
- Reset dipastikan di database saat halaman dimuat, sebelum nyawa dikonsumsi, dan sebelum isi ulang berbayar.
- Jika aplikasi tetap terbuka melewati tengah malam, komponen sinkronisasi akan memeriksa reset dan memperbarui tampilan. Jika tab tertidur/ditutup, reset diproses saat pengguna kembali membuka aplikasi.
- Setiap jawaban yang diperiksa menghasilkan bunyi chime: nada naik untuk benar dan nada turun lembut untuk salah. Jawaban benar tetap mendapat suara apresiasi Bagus/Mumtaz/Keren.
- Database update: jalankan migration `004_daily_hearts_reset.sql` satu kali di Supabase SQL Editor.


## Revisi v5 — jalur level, bintang, audio Maryam, dan animasi

- Peta belajar memakai tampilan unit bergaya Duolingo dengan tujuh node berbentuk bulat. Tahap 1 terbuka sejak awal; tahap berikutnya baru terbuka setelah tahap sebelumnya diselesaikan. Tahap terkunci tampil abu-abu dan tidak dapat dibuka, termasuk jika URL tahap diketik langsung.
- Setiap node menampilkan tiga bintang. Aturan bintang berdasarkan jawaban benar pada percobaan pertama: 15/15 = 3 bintang; 10–14/15 = 2 bintang; 0–9/15 = 1 bintang.
- Setiap tahap dapat diulang. Skor terbaik dan bintang terbaik disimpan per pengguna, materi, dan tahap. Hasil pengulangan yang lebih rendah tidak menurunkan bintang yang sudah diperoleh.
- Layar latihan mendapat animasi karakter, balon percakapan, pilihan jawaban, panel feedback yang naik dari bawah, dan layar selebrasi. Dialog dengan label pembicara ditampilkan per baris.
- Audio menggunakan suara Arab yang tersedia pada browser/perangkat, memprioritaskan nama voice yang terindikasi perempuan, menaikkan pitch dan mengatur tempo agar lebih lembut. Audio memiliki kontrol berhenti dan batas waktu otomatis untuk mencegah pemutaran tersangkut.
- Suara Speech Synthesis tetap bergantung pada voice yang terpasang di perangkat/browser. Jika perangkat tidak menyediakan voice perempuan Bahasa Arab, browser dapat memakai voice Arab yang tersedia dengan pitch lebih tinggi; hasil gender suara tidak dapat dijamin sama pada semua perangkat.

### Database update v5

Setelah migration 001–004 sudah diterapkan, jalankan satu kali `supabase/migrations/005_stage_progress.sql` melalui Supabase → SQL Editor. Migration ini membuat tabel `stage_progress`, menyimpan skor/bintang terbaik per tahap, dan menambahkan RPC `record_stage_quiz_result()` untuk memvalidasi pembukaan tahap di sisi server. Tanpa migration 005, fitur simpan bintang dan buka tahap berikutnya belum aktif. Progres versi sebelumnya hanya tersimpan sebagai ringkasan per materi, bukan per tahap, sehingga bintang tahap mulai direkam sejak revisi ini; tahap tetap dibuka berurutan dari tahap 1.


## Revisi v7 — sticky unit, menu lebih rapi, audio lebih natural, dan karakter kucing

- Judul bab/unit pada jalur belajar sekarang **sticky**. Banner Materi 1 tetap terlihat di bagian atas ketika tujuh level di-scroll, mengikuti pola referensi video.
- Warna banner unit tidak lagi oranye terang; palet jalur dibuat senada dengan tema Arabeeza: sage, teal lembut, dusty rose, olive, dan cream.
- Garis putus-putus vertikal pada jalur level dihapus agar tampilan lebih bersih.
- Area klik level diperbesar menjadi sekitar 90px sehingga lebih mudah disentuh di ponsel.
- Level yang terkunci tetap abu-abu dan tidak dapat diklik. Level yang sudah selesai dapat dimainkan ulang.
- Materi dan Capaian tidak lagi ditampilkan sebagai kartu duplikat di Beranda. Keduanya tersedia langsung dari menu navigasi, termasuk menu mobile.
- Halaman Profil tidak lagi menggunakan avatar manusia/toga. Pengguna dapat memilih enam karakter kucing Arabeeza dengan warna, ekspresi, dan aksesori berbeda.
- Panel apresiasi jawaban dibuat lebih lebar/full-width dan suara apresiasi diperlambat serta dibuat lebih ekspresif, misalnya “Baguuuuus!”.
- Audio latihan diberi safety timeout yang lebih longgar agar pelafalan Arab tidak terpotong terlalu cepat.
- Latihan berbicara sekarang melakukan pencocokan toleran terhadap hasil Speech Recognition. Jika browser menangkap ucapan yang sedikit berbeda karena variasi tanda baca, huruf, atau hasil transkripsi, jawaban tetap dapat dikenali sebagai benar bila kemiripannya cukup tinggi.
- Jika hasil Speech Recognition cocok dengan salah satu pilihan jawaban, sistem otomatis memilih opsi tersebut sehingga siswa tidak langsung dianggap salah hanya karena transkripsi browser sedikit berbeda.


## Revisi v8 — layout mobile, navigasi profil, warna lebih cerah, dan karakter kucing tambahan

- Memperbaiki aturan lebar `.page-wrap` pada layar kecil menggunakan nilai `calc()` yang valid, menahan overflow horizontal, dan memastikan header, navigasi, konten utama, serta footer menggunakan lebar viewport yang tersedia.
- Header mobile dirapikan agar logo dan indikator streak/berlian/nyawa tetap muat tanpa mendorong halaman melebar ke samping.
- Tombol **Keluar** dihapus dari header dan dipindahkan ke halaman **Profil** sebagai tombol “Keluar dari akun”.
- Warna jalur level dibuat lebih cerah dan beragam: hijau, teal, ungu, kuning, coral, biru langit, dan pink. Tahap terkunci memakai biru pastel agar tetap terlihat terkunci tanpa blok abu-abu kusam.
- Warna banner unit diperbarui menjadi hijau yang lebih segar dan tetap konsisten dengan warna latihan.
- Pilihan karakter profil tidak lagi menampilkan nama karakter. Pilihan ditampilkan sebagai ilustrasi kucing saja.
- Jumlah karakter kucing bertambah menjadi sepuluh. Empat karakter tambahan memiliki tampilan lebih maskulin melalui variasi pola bulu, topi, headphone, bandana, dan aksesori dasi kupu-kupu.
- Pilihan kucing menyimpan kombinasi nilai avatar yang sudah diizinkan oleh migration 002. Tidak ada migration Supabase baru yang diperlukan.

### Setelah update v8

- Tidak perlu menjalankan SQL migration baru.
- Ganti isi repository GitHub dengan isi ZIP v8, commit ke branch `main`, lalu tunggu deployment Vercel.
- Setelah deployment, cek tampilan pada lebar ponsel dan buka halaman Profil untuk mencoba seluruh pilihan karakter serta tombol Keluar.


## Revisi v9 — warna jalur lebih tegas dan pilihan jawaban acak

- Banner unit jalur belajar menggunakan warna hijau solid yang lebih kuat; gradasi pada banner dihilangkan agar tampilannya tidak kusam.
- Tujuh lingkaran tahap menggunakan warna solid yang lebih tegas (hijau, teal, ungu, kuning, coral, biru, dan pink). Efek bayangan dan penanda tahap aktif diperjelas, sedangkan tahap terkunci tetap netral.
- Pilihan jawaban latihan sekarang diacak pada setiap soal dan setiap sesi. Posisi jawaban benar tidak lagi selalu berada pada pilihan pertama/A.
- Urutan pilihan pengecoh juga diacak. Isi soal dan kunci jawaban di database tidak diubah.
- Pilihan jawaban menampilkan penanda A, B, dan C sehingga posisi opsi mudah dibaca. Penanda akan mengikuti urutan hasil pengacakan.
- Tidak ada migration Supabase baru yang diperlukan untuk revisi ini.
