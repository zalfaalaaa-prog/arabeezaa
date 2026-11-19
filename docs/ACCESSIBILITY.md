# Aksesibilitas ARABEEZA — V11

## Tujuan

ARABEEZA menggunakan prinsip Universal Design for Learning (UDL): materi yang sama dapat diakses melalui lebih dari satu cara dan siswa dapat menyesuaikan tampilan sesuai kebutuhan. Fitur ini ditujukan bagi semua siswa, termasuk siswa dengan hambatan penglihatan, pendengaran, berbicara, motorik, perhatian, atau kebutuhan belajar lainnya.

## Pengaturan yang tersedia

| Pengaturan | Fungsi | Cara kerja |
|---|---|---|
| Ukuran tulisan | Memperbesar teks antarmuka | Mengubah skala dasar `rem` menjadi 100%, 112%, atau 125%. |
| Kontras tinggi | Memperjelas batas dan teks | Menggunakan warna latar putih, teks gelap, garis tegas, dan fokus yang jelas. |
| Teks lebih mudah dibaca | Mengurangi kepadatan huruf | Menggunakan Verdana/Arial dan sedikit jarak antarkarakter; teks Arab tetap memakai font Arab. |
| Jarak teks lebih lega | Membantu pembacaan | Menambah line-height pada paragraf, label, daftar, dan pilihan jawaban. |
| Garis bawah tautan | Membantu mengenali tautan | Menambahkan underline pada tautan. |
| Kurangi animasi | Mengurangi distraksi/ketidaknyamanan gerakan | Menonaktifkan hampir semua animasi dan transisi. Preferensi sistem `prefers-reduced-motion` dibaca saat pertama kali. |
| Bacakan teks terpilih | Alternatif audio untuk teks | Menggunakan Web Speech API untuk teks yang disorot; bahasa Arab dipilih jika karakter Arab terdeteksi. |

Pengaturan disimpan dengan localStorage menggunakan key `arabeeza-accessibility-v1`. Data tidak dikirim ke Supabase dan tidak disinkronkan lintas perangkat.

## Aksesibilitas dalam aktivitas

- Navigasi utama mempunyai label; tautan lewati navigasi mengarahkan fokus ke `main-content`.
- Progress latihan dan XP menggunakan `role="progressbar"` beserta nilai minimum, maksimum, dan nilai saat ini.
- Soal pilihan jawaban dan latihan menjodohkan menggunakan tombol native yang dapat dioperasikan dengan keyboard.
- Pilihan jawaban menyatakan status terpilih melalui `aria-pressed`.
- Latihan menjodohkan mengumumkan jumlah pasangan yang cocok, serta menambahkan status dan ikon untuk pasangan yang benar/salah.
- Soal listening menyediakan transkrip opsional. Transkrip dapat membantu siswa dengan hambatan pendengaran, tetapi dapat mengungkap isi audio sehingga siswa/guru dapat menggunakannya sesuai kebutuhan pembelajaran.
- Speaking-repeat menyediakan input teks sebagai alternatif mikrofon dan tombol untuk melewati aktivitas berbicara tanpa memaksa siswa menggunakan suara.
- Field login diberi label yang terhubung dengan input.

## Cara menggunakan panel

1. Tekan tombol **Aksesibilitas** yang mengambang di kanan bawah layar.
2. Pilih ukuran teks, kontras, jarak teks, garis bawah tautan, atau pengurangan animasi.
3. Untuk pembaca suara, sorot teks pada halaman lalu tekan **Bacakan**.
4. Tekan **Selesai** untuk menutup panel. Pengaturan tersimpan otomatis pada browser/perangkat.
5. Tekan **Atur ulang** untuk mengembalikan pengaturan awal (tetap mengikuti preferensi pengurangan gerakan sistem operasi jika tersedia).

## Pengujian manual yang disarankan

- Navigasi seluruh halaman hanya dengan Tab, Shift+Tab, Enter, Space, dan Escape.
- Pastikan tautan **Lewati ke konten utama** terlihat ketika menerima fokus.
- Uji panel aksesibilitas pada viewport HP dan desktop; pastikan panel tidak keluar layar dan dapat digulir.
- Uji pengaturan ukuran teks pada halaman dashboard, materi, latihan, profil, login, dan registrasi.
- Uji kontras tinggi pada banner, tombol, soal benar/salah, dan panel umpan balik.
- Aktifkan pengurangan animasi dan pastikan gerakan dekoratif berhenti.
- Uji transkrip listening dan input teks speaking-repeat tanpa mikrofon.
- Uji dengan NVDA/VoiceOver/TalkBack serta pembesaran browser 200%.

## Batasan yang diketahui

- Panel tidak menggantikan fitur pembaca layar bawaan sistem operasi.
- Web Speech API dan pengenalan suara berbeda dukungannya pada tiap browser/perangkat.
- Pengaturan belum tersimpan pada profil siswa di Supabase.
- Materi visual/audio perlu diperiksa satu per satu untuk memastikan teks alternatif, transkrip, dan caption sudah lengkap.
- Paket ini belum diklaim lulus audit WCAG 2.2 AA. Audit otomatis dan pengujian pengguna dengan kebutuhan aksesibilitas masih diperlukan.
