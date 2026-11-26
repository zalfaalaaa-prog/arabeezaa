export type ChapterCatalogItem = {
  number: number;
  slug: string;
  title: string;
  titleAr: string;
  shortTitle: string;
  description: string;
  grammar: string;
  available: boolean;
};

// Katalog bab mengikuti tema yang sudah muncul pada rancangan materi ARABEEZA.
// Hanya Bab 1 yang memiliki bahan ajar dan bank soal aktif pada versi ini.
export const chapterCatalog: ChapterCatalogItem[] = [
  {
    number: 1,
    slug: "at-taaruf",
    title: "At-Ta‘āruf · Perkenalan",
    titleAr: "التَّعَارُفُ",
    shortTitle: "At-Ta‘āruf",
    description: "Belajar salam, memperkenalkan diri, kosakata dasar, kata tanya, kata ganti, dan dialog perkenalan sederhana.",
    grammar: "أَدَوَاتُ الِاسْتِفْهَامِ dan الضَّمَائِرُ",
    available: true
  },
  {
    number: 2,
    slug: "al-usrah",
    title: "Al-Usrah · Keluarga",
    titleAr: "الْأُسْرَةُ",
    shortTitle: "Al-Usrah",
    description: "Tema keluarga dan hubungan antaranggota keluarga.",
    grammar: "Materi tata bahasa akan ditambahkan bersama isi bab.",
    available: false
  },
  {
    number: 3,
    slug: "al-madrasah",
    title: "Al-Madrasah · Sekolah",
    titleAr: "الْمَدْرَسَةُ",
    shortTitle: "Al-Madrasah",
    description: "Tema lingkungan sekolah, kegiatan belajar, dan kehidupan di madrasah.",
    grammar: "Materi tata bahasa akan ditambahkan bersama isi bab.",
    available: false
  },
  {
    number: 4,
    slug: "afrad-al-bayt",
    title: "Afrād al-Bayt · Anggota Rumah",
    titleAr: "أَفْرَادُ الْبَيْتِ",
    shortTitle: "Afrād al-Bayt",
    description: "Tema anggota rumah dan aktivitas di lingkungan rumah.",
    grammar: "Materi tata bahasa akan ditambahkan bersama isi bab.",
    available: false
  }
];
