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


## Revisi v10 — tema dashboard, animasi level, dan variasi bentuk soal

- Banner judul unit di dashboard berubah dari hijau menjadi biru indigo `#344B78`, sehingga tidak menyatu dengan lingkaran level pertama yang tetap hijau.
- Tujuh lingkaran level memiliki animasi mengambang naik-turun dan perubahan bayangan secara bergantian. Animasi dibuat lembut, tidak serempak, dan berhenti untuk perangkat yang mengaktifkan `prefers-reduced-motion`.
- Bank soal Materi 1 disusun ulang menjadi 105 soal (7 tahap × 15 soal) berdasarkan Bab 1 At-Ta'aruf pada buku yang dilampirkan: salam dan perkenalan, identitas dan keluarga, dhamir, adawatul istifham, mufradat, dialog Faris–Zaid, serta pemahaman bacaan Abdullah dan Khalid.
- Soal dalam setiap tahap mencampurkan pilihan ganda, menjodohkan kosakata, menyusun keping kata, listening dengan susunan kata, speaking-repeat, dan pilihan kosakata bergambar/piktogram. Urutan opsi dan keping kata diacak.
- Model menjodohkan menggunakan status abu-abu sebelum dipasangkan, hijau saat cocok, dan merah sesaat saat salah lalu kembali abu-abu untuk dicoba ulang.
- Latihan speaking-repeat memakai audio browser dan Speech Recognition jika tersedia. Tombol **Tidak bisa bicara sekarang** melewati latihan tanpa mengurangi nyawa; soal yang dilewati tidak dihitung sebagai jawaban benar.
- Pilihan gambar menggunakan piktogram/emoji agar ringan dan tetap tampil baik di ponsel tanpa mengunduh aset gambar eksternal.
- Tidak ada perubahan pada sistem autentikasi, akun, nyawa harian, XP, berlian, maupun progres tahap.

### Database update v10

Untuk project Supabase yang sudah menjalankan migration 001–005 dan seed, jalankan satu kali file `supabase/migrations/006_interactive_question_types.sql` melalui Supabase → SQL Editor. Migration ini memperbarui isi 105 soal Materi 1 dan menyimpan tipe soal interaktif pada kolom `question_type` serta data terstruktur pada `options` (JSONB). Migration tidak menghapus profil, hasil kuis, nyawa, atau progres/bintang siswa.

### Pemeriksaan setelah update

- Pastikan jumlah soal Materi 1 adalah 105 (7 × 15).
- Uji setiap tipe soal: pilihan ganda, matching, word order, listening word order, speaking repeat, dan image choice.
- Pastikan posisi jawaban dan keping kata berubah ketika sesi baru dimulai.
- Uji salah satu pasangan matching: status salah harus merah sebentar lalu kembali abu-abu.
- Uji tombol skip speaking: soal dilewati tanpa mengurangi nyawa dan tidak menambah skor benar.
- Uji dashboard di ponsel dan desktop; animasi level harus halus dan tidak berjalan pada preferensi reduced motion.


## Revisi v11 — aksesibilitas dan pembelajaran inklusif

- Menambahkan tombol **Aksesibilitas** yang tersedia di seluruh halaman publik dan halaman siswa. Panel dapat dibuka dengan keyboard, ditutup dengan Escape, dan pengaturannya disimpan di localStorage browser.
- Menambahkan pengaturan ukuran teks Normal/Besar/Lebih besar, kontras tinggi, huruf antarmuka lebih sederhana, jarak teks lebih lega, garis bawah tautan, dan pengurangan animasi. Pengaturan reduce motion juga mengikuti preferensi sistem saat pertama kali digunakan.
- Menambahkan tautan **Lewati ke konten utama**, indikator fokus keyboard yang jelas, target sentuh minimal 44px pada tombol/form, dan label navigasi utama.
- Menambahkan progressbar yang memiliki nama dan nilai aksesibel untuk progres XP, skor materi, dan kemajuan latihan.
- Menambahkan fitur bacakan teks yang dipilih menggunakan Web Speech API jika didukung browser/perangkat.
- Soal listening menyediakan transkrip opsional untuk siswa yang tidak dapat mendengar audio. Transkrip dapat mengungkap isi audio, sehingga dapat dipakai sebagai alternatif akses sesuai kebutuhan siswa/guru.
- Speaking-repeat menyediakan input teks sebagai alternatif mikrofon, selain opsi melewati latihan.
- Latihan matching tetap memakai tombol native (bukan drag-and-drop), dapat dipakai dengan keyboard, mengumumkan progres pasangan, dan memberi label/ikon untuk status benar atau salah.
- Memperbaiki hubungan label dan input pada halaman login serta menambahkan status/alert pada pesan hasil autentikasi.
- Tidak ada perubahan skema database atau migration Supabase. Preferensi aksesibilitas disimpan lokal di browser dan belum disinkronkan ke akun siswa.
- Paket ini merupakan implementasi dasar aksesibilitas, bukan sertifikasi WCAG. Pengujian manual dengan keyboard, NVDA/VoiceOver/TalkBack, pembesaran 200%, dan siswa dengan kebutuhan aksesibilitas tetap diperlukan.


## V12 — Penyempurnaan konten dan alur belajar
- Halaman sebelum login diringkas menjadi satu landing page dengan logo Arabeeza, maskot kucing, dan tombol masuk/daftar.
- Menu Materi diarahkan ke katalog sampul bab; isi lengkap tetap berada di halaman detail bab.
- Dialog pada materi dan soal ditampilkan per giliran pembicara dalam gelembung percakapan, dengan audio per baris pada materi.
- Warna merah pada matching hanya diterapkan pada dua tile yang dipilih secara keliru.
- Ditambahkan pilihan isi ulang hingga lima nyawa dengan 100 XP; pilihan 25 berlian tetap tersedia.
- Petunjuk soal word-order tertentu diubah menjadi arti Bahasa Indonesia, termasuk contoh kalimat Khalid rajin di sekolah.
- Pemilihan avatar kucing diberi animasi pop-up dan menghormati pengaturan reduce-motion.
- Migration tambahan: `007_dialogue_xp_refill_and_indonesian_word_order.sql`.


## V13 (26 November 2026)

- Mengubah warna aplikasi ke palet pastel dan mengganti banner/navy menjadi biru soft.
- Mengganti maskot pada halaman login dan menyusun ulang layout login.
- Membungkus materi inti dalam navigasi slide; tujuan pembelajaran dan pertanyaan pemantik tetap di luar slide.
- Membuat dialog latihan Nadia-Hana terpisah dari dialog materi Faris-Zaid.
- Menambahkan audio dialog berurutan dengan pergantian suara/intonasi dan tidak membacakan nama pembicara.
- Menghapus transkrip audio pada soal listening dan menyembunyikan teks target speaking repeat.
- Menambahkan alternatif non-audio untuk aktivitas listening/speaking tanpa penalti skip dan tanpa re-queue.
- Menambahkan bacaan Abdullah dan Khalid untuk mendukung soal yang sebelumnya tidak memiliki teks sumber.
- Memperjelas perolehan bintang dengan ambang 90/75.
- Mempercepat umpan balik jawaban dan memperbaiki area sentuh tombol.


## V13 (26 November 2026)

- Palet aplikasi diubah menjadi pastel: pink, peach, kuning, mint, biru soft, lavender, dan periwinkle.
- Halaman login ditata ulang dengan maskot kucing Arabeeza yang lebih ramah.
- Materi inti dibungkus menjadi presentasi slide yang dapat digeser; tujuan pembelajaran dan pertanyaan pemantik tetap di luar presentasi.
- Dialog latihan Nadia-Hana dibedakan dari dialog materi Faris-Zaid. Audio dialog diputar berurutan dengan pergantian suara/intonasi bila browser mendukung dan tidak membacakan nama pembicara.
- Transkrip jawaban dihilangkan dari soal listening dan teks target disembunyikan pada speaking repeat. Siswa dapat memilih mode alternatif non-audio tanpa penalti skip dan tanpa pengulangan.
- Bacaan Abdullah dan Khalid ditambahkan sebagai konteks soal yang sebelumnya belum memiliki teks sumber.
- Ambang bintang diperjelas: skor 90–100 = 3 bintang, 75–89 = 2 bintang, dan di bawah 75 = 1 bintang.
- Jalankan migration `008_v13_dialogue_assessment_and_star_rules.sql` setelah migration 001–007.

## V14 — pematangan tema, Bab 1, progres bintang, dan interaksi
- Identitas visual aplikasi disatukan ke tema maroon, deep maroon, blush, cream, dan champagne gold. Status jawaban benar tetap hijau dan jawaban salah tetap merah.
- Dashboard menggunakan label BAB 1, tanpa ikon buku pada banner. Jalur pembelajaran tetap terdiri dari tujuh tahap.
- Menu Materi hanya menampilkan satu sampul Bab 1 At-Ta'aruf; route materi lain belum dibuka agar cakupan belajar terfokus.
- Materi inti memiliki area scroll vertikal di dalam panel presentasi, serupa area dialog, dan posisi scroll kembali ke atas saat slide berganti.
- Catatan guru dihapus dari profil siswa. Fitur catatan guru tetap tersedia pada halaman guru/admin dan tabel database tidak dihapus.
- Toko hadiah menyediakan isi ulang lima nyawa menggunakan 25 berlian atau 100 XP. Harga XP tetap ditetapkan oleh fungsi Supabase di sisi server.
- Halaman praktik tahap 6 diberi identitas Praktik Dialog dan tahap 7 Praktik Penerapan. Dialog percakapan tetap ditampilkan sebagai gelembung percakapan pada soal yang memiliki konteks dialog; aktivitas audio tetap tidak membocorkan transkrip jawaban.
- Tampilan hasil menonjolkan bintang terbaik yang tersimpan, sementara bintang percobaan terbaru ditampilkan sebagai informasi sekunder.
- Ditambahkan migration `009_best_stars_persistence.sql` untuk memastikan bintang terbaik menggunakan nilai maksimum antara pencapaian lama dan hasil terbaru. Migration tidak menurunkan bintang yang sudah tersimpan.
- Maskot utama dan avatar profil diperbarui menjadi bentuk wajah lebih bulat, dengan animasi lembut yang menghormati preferensi reduce-motion. Logo SVG menggunakan aksen maroon.
- ZIP ini mempertahankan fitur aksesibilitas global V11. Pengaturan aksesibilitas khusus di halaman profil belum ditambahkan pada revisi ini.
