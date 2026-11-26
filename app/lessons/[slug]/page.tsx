import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft, BookOpen, Volume2, Languages, UserRound, MessageCircle,
  Headphones, Mic, PenLine, Sparkles, GraduationCap
} from "lucide-react";
import AppShell from "@/components/AppShell";
import CatMascot from "@/components/CatMascot";
import DialogueChat, { type DialogueTurn } from "@/components/DialogueChat";
import LessonSlides from "@/components/LessonSlides";
import { createClient } from "@/lib/supabase/server";
import { chapterCatalog } from "@/lib/chapters";

export const dynamic = "force-dynamic";

const greetings = [
  { ar: "اَلسَّلَامُ عَلَيْكُمْ", meaning: "Semoga keselamatan tercurah kepadamu", note: "Salam pembuka" },
  { ar: "وَعَلَيْكُمُ السَّلَامُ", meaning: "Dan semoga keselamatan juga tercurah kepadamu", note: "Jawaban salam" },
  { ar: "أَهْلًا وَسَهْلًا", meaning: "Selamat datang", note: "Menyambut seseorang" },
  { ar: "صَبَاحُ الْخَيْرِ", meaning: "Selamat pagi", note: "Sapaan pagi" },
  { ar: "صَبَاحُ النُّورِ", meaning: "Selamat pagi juga", note: "Jawaban sapaan pagi" },
  { ar: "مَسَاءُ الْخَيْرِ", meaning: "Selamat sore/malam", note: "Sapaan petang" },
  { ar: "مَعَ السَّلَامَةِ", meaning: "Selamat jalan/sampai jumpa", note: "Berpamitan" }
];

const extraVocabulary = [
  ["الْأُسْرَةُ", "keluarga"], ["التَّعَارُفُ", "perkenalan"], ["سَعِيدٌ", "bahagia"],
  ["طَالِبٌ", "siswa laki-laki"], ["طَالِبَةٌ", "siswi"], ["رَبَّةُ الْبَيْتِ", "ibu rumah tangga"],
  ["الْمَدْرَسَةُ الثَّانَوِيَّةُ", "sekolah menengah atas"], ["لِأَوَّلِ مَرَّةٍ", "untuk pertama kali"],
  ["أَرْجُو", "saya mengharap"], ["تُعَرِّفُونَ", "kalian memperkenalkan"], ["يَبْدَأُ", "dimulai"],
  ["يَتَحَدَّثُونَ", "mereka berbicara"], ["أَهَمِّيَّةٌ", "pentingnya"], ["خَرِّيجٌ", "alumni/lulusan"],
  ["لِطَلَبِ الرِّزْقِ", "untuk mencari rezeki"], ["بَيْتِي", "rumahku"], ["قَرْيَةٌ", "desa"],
  ["شَارِعٌ", "jalan"], ["خَارِجَ الْمَدِينَةِ", "di luar kota"]
] as const;

const questionWords = [
  ["مَا", "Apa", "مَا اسْمُكَ؟", "Siapa namamu?"],
  ["مَنْ", "Siapa", "مَنْ هَذَا؟", "Siapa ini?"],
  ["أَيْنَ", "Di mana", "أَيْنَ تَسْكُنُ؟", "Di mana kamu tinggal?"],
  ["مَتَى", "Kapan", "مَتَى تَذْهَبُ؟", "Kapan kamu pergi?"],
  ["كَيْفَ", "Bagaimana", "كَيْفَ حَالُكَ؟", "Bagaimana kabarmu?"],
  ["كَمْ", "Berapa", "كَمْ عُمْرُكَ؟", "Berapa umurmu?"],
  ["هَلْ", "Apakah", "هَلْ أَنْتَ طَالِبٌ؟", "Apakah kamu seorang siswa?"],
  ["أَ", "Apakah (hamzah tanya)", "أَأَنْتَ طَالِبٌ؟", "Apakah kamu seorang siswa?"]
] as const;

const pronouns = [
  ["أَنَا", "Saya", "Orang pertama tunggal"], ["نَحْنُ", "Kami/kita", "Orang pertama jamak"],
  ["أَنْتَ", "Kamu laki-laki", "Orang kedua tunggal"], ["أَنْتِ", "Kamu perempuan", "Orang kedua tunggal"],
  ["أَنْتُمَا", "Kalian berdua", "Orang kedua dual"], ["أَنْتُمْ", "Kalian laki-laki/campuran", "Orang kedua jamak"],
  ["أَنْتُنَّ", "Kalian perempuan", "Orang kedua jamak"], ["هُوَ", "Dia laki-laki", "Orang ketiga tunggal"],
  ["هِيَ", "Dia perempuan", "Orang ketiga tunggal"], ["هُمَا", "Mereka berdua", "Orang ketiga dual"],
  ["هُمْ", "Mereka laki-laki/campuran", "Orang ketiga jamak"], ["هُنَّ", "Mereka perempuan", "Orang ketiga jamak"]
] as const;

const learningObjectives = [
  "Mengevaluasi informasi tentang perkenalan dan sapaan.",
  "Membangun interaksi dengan teks tentang perkenalan dan sapaan.",
  "Memahami informasi dari paragraf, teks visual, dan teks multimodal bertema perkenalan.",
  "Menghubungkan kalimat menjadi paragraf yang runtut dan logis tentang perkenalan dan sapaan."
];

const maharah = [
  { title: "Menyimak · الاستماع", detail: "Mendengarkan ungkapan, sapaan, dan dialog perkenalan; menemukan informasi tersurat maupun tersirat.", icon: Headphones, color: "bg-[#eaf2df] text-[#74834f]" },
  { title: "Berbicara · الكلام", detail: "Mempraktikkan salam, menanyakan kabar, memperkenalkan identitas, dan merespons lawan bicara.", icon: Mic, color: "bg-[#f8e6dc] text-[#bd795a]" },
  { title: "Membaca · القراءة", detail: "Membaca kosakata, dialog, dan teks pendek tentang identitas serta memahami maknanya.", icon: BookOpen, color: "bg-[#f1eadb] text-[#827148]" },
  { title: "Menulis · الكتابة", detail: "Melengkapi kalimat, menyusun kata, dan menulis paragraf sederhana tentang identitas diri.", icon: PenLine, color: "bg-[#fff0d9] text-[#bd795a]" }
];

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const catalogChapter = chapterCatalog.find((chapter) => chapter.slug === slug);
  if (!catalogChapter) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  await supabase.rpc("refresh_daily_hearts");
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  if (!catalogChapter.available) {
    return (
      <AppShell active="/lessons" role={profile?.role || "student"} stats={{ streak: profile?.streak_count || 0, diamonds: profile?.diamonds || 0, hearts: profile?.hearts || 0 }}>
        <Link href="/lessons" className="mb-5 inline-flex min-h-12 items-center gap-2 text-sm font-bold text-[#762b40]"><ArrowLeft size={18} /> Kembali ke perpustakaan</Link>
        <section className="chapter-placeholder-card">
          <span className="chapter-cover-label">BAB {catalogChapter.number}</span>
          <CatMascot mood="thinking" size={126} className="chapter-placeholder-cat" />
          <p lang="ar" dir="rtl" className="arabic mt-3 text-3xl font-bold text-[#762b40]">{catalogChapter.titleAr}</p>
          <h1 className="mt-2 text-2xl font-black text-[#4d1c2b]">{catalogChapter.title}</h1>
          <div className="chapter-placeholder-message">
            <Sparkles size={22} />
            <div>
              <h2>Materi belum dimasukkan</h2>
              <p>Bab ini sudah tersedia di daftar materi. Isi pembelajaran sedang disiapkan dan akan ditambahkan nanti.</p>
            </div>
          </div>
          <Link href="/lessons" className="btn-primary mt-5">Kembali ke daftar bab <ArrowLeft size={17} /></Link>
        </section>
      </AppShell>
    );
  }

  const [{ data: lesson }, { data: vocab }, { data: dialogues }] = await Promise.all([
    supabase.from("lessons").select("*").eq("slug", slug).eq("is_published", true).single(),
    supabase.from("vocabulary").select("*").order("sort_order"),
    supabase.from("dialogues").select("*").order("sort_order")
  ]);
  if (!lesson) notFound();
  const words = (vocab || []).filter((item: any) => item.lesson_id === lesson.id);
  const conversations = (dialogues || []).filter((item: any) => item.lesson_id === lesson.id);

  return (
    <AppShell active={`/lessons/${slug}`} role={profile?.role || "student"} stats={{ streak: profile?.streak_count || 0, diamonds: profile?.diamonds || 0, hearts: profile?.hearts || 0 }}>
      <Link href="/dashboard" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-[#827148]"><ArrowLeft size={17} /> Kembali ke beranda</Link>

      <section className="relative overflow-hidden rounded-[28px] bg-[#fff0d9] p-6 md:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#a76d50]">BAB 1 · التَّعَارُفُ</span>
            <p lang="ar" dir="rtl" className="arabic mt-5 text-right text-4xl font-black">التَّحِيَّةُ وَالتَّعَارُفُ</p>
            <h1 className="mt-2 text-3xl font-black">Salam dan Perkenalan</h1>
            <p className="mt-3 text-sm leading-6 text-[#78664d]">Pelajari ungkapan salam, memperkenalkan diri, menanyakan kabar, identitas, kata tanya, kata ganti, dialog, dan penerapannya dalam kehidupan sehari-hari.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link href={`/practice/${slug}?mode=mixed&level=1`} className="btn-primary">Mulai tahap 1 →</Link>
              <span className="rounded-xl bg-white/80 px-4 py-3 text-sm font-extrabold text-[#827148]">105 soal · 7 tahap</span>
            </div>
          </div>
          <CatMascot mood="happy" size={126} className="self-center drop-shadow-sm" />
        </div>
      </section>

      <section className="material-section mt-6 p-5 md:p-6">
        <div className="mb-4 flex items-center gap-3"><div className="rounded-2xl bg-[#eaf2df] p-3 text-[#74834f]"><GraduationCap size={23} /></div><div><p className="material-kicker">Tujuan pembelajaran</p><h2 className="text-xl font-black">Setelah mempelajari materi ini, kamu diharapkan mampu:</h2></div></div>
        <ul className="grid gap-3 md:grid-cols-2">{learningObjectives.map((item, index) => <li key={item} className="flex gap-3 rounded-2xl bg-[#fffaf3] p-4 text-sm leading-6 text-[#5f5a4c]"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#a5af79] text-xs font-black text-white">{index + 1}</span>{item}</li>)}</ul>
        <div className="mt-5 rounded-2xl bg-[#f8e6dc] p-4"><p className="material-kicker">Pertanyaan pemantik</p><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-[#785a4a]"><li>Mengapa sikap sopan dan jujur penting saat memperkenalkan diri?</li><li>Bagaimana cara memperkenalkan diri dengan baik menurut ajaran Islam?</li></ul></div>
      </section>

      <LessonSlides title="Materi inti">
      <section className="mt-7">
        <div className="mb-4 flex items-center gap-3"><div className="rounded-2xl bg-[#eaf2df] p-3 text-[#74834f]"><MessageCircle size={22} /></div><div><p className="material-kicker">Bagian 1</p><h2 className="text-xl font-black">Ungkapan salam dan perkenalan</h2></div></div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {greetings.map((item) => <article key={item.ar} className="material-section p-4"><p lang="ar" dir="rtl" className="arabic text-right text-2xl font-bold">{item.ar}</p><p className="mt-2 font-black text-[#827148]">{item.meaning}</p><p className="mt-1 text-xs text-[#89968f]">{item.note}</p></article>)}
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <article className="material-section p-5"><h3 className="font-black">Memperkenalkan identitas</h3><div className="mt-3 space-y-3 text-sm"><div><p lang="ar" dir="rtl" className="arabic text-right text-xl font-bold">اِسْمِيْ ...</p><p className="text-[#718078]">Nama saya ...</p></div><div><p lang="ar" dir="rtl" className="arabic text-right text-xl font-bold">أَنَا مِنْ ...</p><p className="text-[#718078]">Saya berasal dari ...</p></div><div><p lang="ar" dir="rtl" className="arabic text-right text-xl font-bold">أَنَا طَالِبٌ / طَالِبَةٌ</p><p className="text-[#718078]">Saya seorang siswa / siswi.</p></div><div><p lang="ar" dir="rtl" className="arabic text-right text-xl font-bold">أَسْكُنُ فِيْ ...</p><p className="text-[#718078]">Saya tinggal di ...</p></div></div></article>
          <article className="material-section p-5"><h3 className="font-black">Menanyakan kabar</h3><div className="mt-3 space-y-3 text-sm"><div><p lang="ar" dir="rtl" className="arabic text-right text-xl font-bold">كَيْفَ حَالُكَ؟ / كَيْفَ حَالُكِ؟</p><p className="text-[#718078]">Bagaimana kabarmu? (laki-laki / perempuan)</p></div><div><p lang="ar" dir="rtl" className="arabic text-right text-xl font-bold">أَنَا بِخَيْرٍ، الْحَمْدُ لِلَّهِ</p><p className="text-[#718078]">Saya baik, segala puji bagi Allah.</p></div><div><p lang="ar" dir="rtl" className="arabic text-right text-xl font-bold">شُكْرًا</p><p className="text-[#718078]">Terima kasih.</p></div></div></article>
        </div>
      </section>

      <section className="mt-7">
        <div className="mb-4 flex items-center gap-3"><div className="rounded-2xl bg-[#f8e6dc] p-3 text-[#bd795a]"><Languages size={22} /></div><div><p className="material-kicker">Bagian 2</p><h2 className="text-xl font-black">Kosakata inti</h2></div></div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {words.map((word: any) => <article key={word.id} className="material-section p-4"><p lang="ar" dir="rtl" className="arabic text-right text-2xl font-bold">{word.arabic}</p><p className="mt-2 text-sm font-black text-[#827148]">{word.meaning}</p>{word.transliteration && <p className="mt-1 text-xs text-[#89968f]">{word.transliteration}</p>}{word.example_arabic && <div className="mt-3 border-t border-[#eee5d7] pt-3"><p lang="ar" dir="rtl" className="arabic text-right text-lg">{word.example_arabic}</p><p className="mt-1 text-xs text-[#718078]">{word.example_meaning}</p></div>}</article>)}
          {extraVocabulary.map(([ar, meaning]) => <article key={ar} className="material-section p-4"><p lang="ar" dir="rtl" className="arabic text-right text-2xl font-bold">{ar}</p><p className="mt-2 text-sm font-black text-[#827148]">{meaning}</p></article>)}
        </div>
      </section>

      <section className="material-section mt-7 p-5 md:p-6">
        <div className="mb-4 flex items-center gap-3"><div className="rounded-2xl bg-[#f1eadb] p-3 text-[#827148]"><CircleQuestionIcon /></div><div><p className="material-kicker">Bagian 3</p><h2 className="text-xl font-black">أَدَوَاتُ الِاسْتِفْهَامِ · Kata tanya</h2></div></div>
        <p className="mb-4 text-sm leading-6 text-[#718078]">Adawātul istifhām adalah kata atau alat tanya dalam Bahasa Arab yang digunakan untuk meminta informasi. Perhatikan arti dan contoh penggunaannya.</p>
        <div className="lesson-table-scroll" data-no-slide-swipe tabIndex={0} role="region" aria-label="Tabel kata tanya, dapat digeser ke samping"><table className="w-full min-w-[560px] border-collapse text-sm"><thead><tr className="bg-[#fff0d9] text-left"><th className="rounded-l-xl p-3">Kata tanya</th><th className="p-3">Arti</th><th className="p-3">Contoh kalimat</th><th className="rounded-r-xl p-3">Terjemahan</th></tr></thead><tbody>{questionWords.map(([ar, meaning, example, translation]) => <tr key={ar} className="border-b border-[#eee5d7]"><td lang="ar" dir="rtl" className="arabic p-3 text-right text-xl font-bold">{ar}</td><td className="p-3 font-bold">{meaning}</td><td lang="ar" dir="rtl" className="arabic p-3 text-right text-lg">{example}</td><td className="p-3 text-[#718078]">{translation}</td></tr>)}</tbody></table></div>
      </section>

      <section className="material-section mt-7 p-5 md:p-6">
        <div className="mb-4 flex items-center gap-3"><div className="rounded-2xl bg-[#eaf2df] p-3 text-[#74834f]"><UserRound size={22} /></div><div><p className="material-kicker">Bagian 4</p><h2 className="text-xl font-black">الضَّمَائِرُ · Kata ganti (Dhamir)</h2></div></div>
        <p className="mb-4 text-sm leading-6 text-[#718078]">Dhamir adalah kata ganti yang menggantikan nama orang atau benda. Dhamir dapat menunjukkan orang yang berbicara, lawan bicara, atau orang yang sedang dibicarakan.</p>
        <div className="lesson-table-scroll" data-no-slide-swipe tabIndex={0} role="region" aria-label="Tabel kata ganti, dapat digeser ke samping"><table className="w-full min-w-[520px] border-collapse text-sm"><thead><tr className="bg-[#eaf2df] text-left"><th className="rounded-l-xl p-3">Dhamir</th><th className="p-3">Arti</th><th className="rounded-r-xl p-3">Kelompok</th></tr></thead><tbody>{pronouns.map(([ar, meaning, group]) => <tr key={ar} className="border-b border-[#eee5d7]"><td lang="ar" dir="rtl" className="arabic p-3 text-right text-xl font-bold">{ar}</td><td className="p-3 font-bold">{meaning}</td><td className="p-3 text-[#718078]">{group}</td></tr>)}</tbody></table></div>
        <div className="mt-4 grid gap-3 md:grid-cols-2"><article className="rounded-2xl bg-[#fffaf3] p-4"><h3 className="font-black">Dhamir munfashil (terpisah)</h3><p className="mt-2 text-sm leading-6 text-[#718078]">Kata ganti berdiri sendiri dan tidak melekat pada kata lain. Contoh: <span lang="ar" dir="rtl" className="arabic text-lg font-bold">أَنَا طَالِبٌ</span> — saya seorang siswa.</p></article><article className="rounded-2xl bg-[#f8e6dc] p-4"><h3 className="font-black">Dhamir muttashil (bersambung)</h3><p className="mt-2 text-sm leading-6 text-[#785a4a]">Kata ganti melekat pada kata lain, misalnya untuk kepemilikan atau objek. Contoh: <span lang="ar" dir="rtl" className="arabic text-lg font-bold">كِتَابُكَ</span> — bukumu; <span lang="ar" dir="rtl" className="arabic text-lg font-bold">قَلَمُهُ</span> — penanya; <span lang="ar" dir="rtl" className="arabic text-lg font-bold">سَاعَدَنِي</span> — dia menolong saya.</p></article></div>
      </section>

      <section id="dialog" className="mt-7 scroll-mt-6">
        <div className="mb-4 flex items-center gap-3"><div className="rounded-2xl bg-[#fff0d9] p-3 text-[#bd795a]"><MessageCircle size={22} /></div><div><p className="material-kicker">Bagian 5</p><h2 className="text-xl font-black">الْحِوَارُ · Dialog perkenalan</h2></div></div>
        <div className="grid gap-4 lg:grid-cols-2">
          {conversations.map((dialogue: any) => <article key={dialogue.id} className="material-section p-4 md:p-5"><DialogueChat title={dialogue.title} turns={parseDialogueTurns(dialogue.arabic_text, dialogue.translation)} /></article>)}
        </div>
        <article className="material-section mt-4 p-5"><div className="flex items-center gap-2"><Volume2 size={19} className="text-[#827148]" /><h3 className="font-black">Teks bacaan: Identitas diri</h3></div><p lang="ar" dir="rtl" className="arabic mt-4 text-right text-xl font-bold leading-[2.2]">اِسْمِي أَحْمَدُ. أَنَا طَالِبٌ فِي الْمَدْرَسَةِ الثَّانَوِيَّةِ. أَسْكُنُ فِي سُورَابَايَا مَعَ أُسْرَتِي. أُحِبُّ تَعَلُّمَ اللُّغَةِ الْعَرَبِيَّةِ.</p><p className="mt-3 text-sm leading-7 text-[#718078]">Nama saya Ahmad. Saya seorang siswa di sekolah menengah. Saya tinggal di Surabaya bersama keluarga saya. Saya suka belajar Bahasa Arab.</p><p className="mt-3 rounded-xl bg-[#fff0d9] p-3 text-sm text-[#78664d]">Saat membaca teks, temukan nama, status, tempat tinggal, anggota keluarga yang disebutkan, dan kegiatan yang disukai tokoh.</p></article>
      </section>
      </LessonSlides>

      <section className="material-section mt-7 p-5 md:p-6">
        <div className="mb-4 flex items-center gap-3"><div className="rounded-2xl bg-[#f8e6dc] p-3 text-[#bd795a]"><Sparkles size={22} /></div><div><p className="material-kicker">Bagian 6</p><h2 className="text-xl font-black">اَلتَّطْبِيْقُ · Penerapan materi</h2></div></div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            "Buat kartu identitas diri dalam Bahasa Arab yang berisi nama, umur, asal, dan tempat tinggal.",
            "Susun kata-kata acak menjadi kalimat perkenalan yang benar.",
            "Praktikkan percakapan salam dan perkenalan bersama teman.",
            "Presentasikan identitas diri secara singkat dengan lafal dan sikap yang santun."
          ].map((task, index) => <div key={task} className="flex gap-3 rounded-2xl bg-[#fffaf3] p-4"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#e8a07c] text-white"><span className="font-black">{index + 1}</span></span><p className="text-sm leading-6 text-[#5f5a4c]">{task}</p></div>)}
        </div>
      </section>

      <section className="material-section mt-7 p-5 md:p-6">
        <div className="mb-4"><p className="material-kicker">Latihan dan evaluasi</p><h2 className="text-xl font-black">Asesmen formatif, aktivitas mandiri, dan proyek</h2></div>
        <div className="grid gap-3 md:grid-cols-2">
          <article className="rounded-2xl bg-[#fffaf3] p-4"><h3 className="font-black">Asesmen formatif</h3><ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-[#718078]"><li>Jawab pertanyaan berdasarkan teks atau dialog perkenalan.</li><li>Tentukan arti kata tanya dan kata ganti yang digunakan.</li><li>Pilih respons yang tepat dalam percakapan.</li><li>Tulis beberapa kalimat sederhana tentang identitas diri.</li></ul></article>
          <article className="rounded-2xl bg-[#eaf2df] p-4"><h3 className="font-black">Aktivitas mandiri</h3><ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-[#5f694b]"><li>Buat daftar kosakata baru beserta artinya.</li><li>Latih pengucapan salam dan ungkapan perkenalan.</li><li>Susun lima kalimat tentang diri sendiri.</li><li>Bacakan teks perkenalan dengan lafal yang jelas.</li></ul></article>
          <article className="rounded-2xl bg-[#f8e6dc] p-4"><h3 className="font-black">Refleksi belajar</h3><p className="mt-2 text-sm leading-6 text-[#785a4a]">Setelah belajar, tanyakan pada diri sendiri: apakah aku sudah dapat memberi salam, menyebutkan nama dan asal, menanyakan kabar, memahami kata tanya, serta menggunakan dhamir dengan tepat?</p></article>
          <article className="rounded-2xl bg-[#f1eadb] p-4"><h3 className="font-black">Tugas proyek</h3><p className="mt-2 text-sm leading-6 text-[#6d624d]">Buat kartu identitas atau poster perkenalan dalam Bahasa Arab. Sertakan nama, umur, asal, tempat tinggal, dan status sebagai siswa. Presentasikan di depan kelas atau praktikkan dalam dialog berpasangan.</p></article>
        </div>
      </section>

      <section className="mt-7">
        <div className="mb-4"><p className="material-kicker">Empat maharah</p><h2 className="text-xl font-black">Keterampilan yang akan dilatih</h2></div>
        <div className="grid gap-3 sm:grid-cols-2">{maharah.map((item) => { const Icon = item.icon; return <article key={item.title} className="material-section flex gap-4 p-5"><div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${item.color}`}><Icon size={22} /></div><div><h3 className="font-black">{item.title}</h3><p className="mt-1 text-sm leading-6 text-[#718078]">{item.detail}</p></div></article>; })}</div>
      </section>

      <section className="mt-7 rounded-[26px] bg-[#eaf2df] p-5 md:p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><CatMascot mood="celebrate" size={68} /><div><p className="material-kicker">Siap berlatih?</p><h2 className="text-xl font-black">Uji pemahamanmu di 7 level</h2><p className="mt-1 text-sm text-[#5f694b]">Setiap level berisi 15 soal dengan tingkat tantangan bertahap.</p></div></div><Link href={`/practice/${slug}?mode=mixed&level=1`} className="btn-primary shrink-0">Mulai belajar →</Link></div></section>
    </AppShell>
  );
}


function parseDialogueTurns(arabicText: string, translation: string): DialogueTurn[] {
  const parseLines = (value: string) => value.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n").split(/\r?\n/).map((line) => {
    const colon = line.indexOf(":");
    return colon >= 0
      ? { speaker: line.slice(0, colon).trim(), text: line.slice(colon + 1).trim() }
      : { speaker: "", text: line.trim() };
  }).filter((line) => line.text);

  const arabicLines = parseLines(arabicText || "");
  const translatedLines = parseLines(translation || "");
  return arabicLines.map((line, index) => ({
    speaker: translatedLines[index]?.speaker || line.speaker || `Pembicara ${index + 1}`,
    arabic: line.text,
    translation: translatedLines[index]?.text || ""
  }));
}

function CircleQuestionIcon() {
  return <span className="inline-flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 border-current text-sm font-black">؟</span>;
}
