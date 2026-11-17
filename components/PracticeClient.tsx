"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, CheckCircle2, Gem, Heart, Mic,
  Volume2, XCircle, Sparkles, Headphones, BookOpen, PencilLine
} from "lucide-react";
import { buyHearts, loseHeart, saveQuizResult } from "@/app/actions";
import { normalizeArabic } from "@/lib/utils";
import type { Question } from "@/lib/types";
import CatMascot from "@/components/CatMascot";

type Feedback = { correct: boolean; message: string; answer: string };

function speakArabic(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ar-SA";
  utterance.rate = 0.82;
  window.speechSynthesis.speak(utterance);
  return true;
}

function playPraiseSound() {
  if (typeof window === "undefined") return;
  const praise = [
    { text: "Bagus!", lang: "id-ID" },
    { text: "Mumtaz!", lang: "ar-SA" },
    { text: "Keren!", lang: "id-ID" }
  ];
  const chosen = praise[Math.floor(Math.random() * praise.length)];
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(chosen.text);
    utterance.lang = chosen.lang;
    utterance.rate = 1.03;
    utterance.pitch = 1.12;
    window.speechSynthesis.speak(utterance);
    return;
  }
  try {
    const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(660, context.currentTime);
    oscillator.frequency.setValueAtTime(880, context.currentTime + 0.12);
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, context.currentTime + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.28);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.3);
    oscillator.onended = () => void context.close();
  } catch {
    // Audio is an enhancement; answering and progress remain functional if blocked.
  }
}

const skillMeta: Record<string, { label: string; icon: typeof Headphones; color: string }> = {
  listening: { label: "Menyimak", icon: Headphones, color: "bg-[#eaf2df] text-[#74834f]" },
  speaking: { label: "Berbicara", icon: Mic, color: "bg-[#f8e6dc] text-[#bd795a]" },
  reading: { label: "Membaca", icon: BookOpen, color: "bg-[#f1eadb] text-[#827148]" },
  writing: { label: "Menulis", icon: PencilLine, color: "bg-[#fff0d9] text-[#bd795a]" }
};

export default function PracticeClient({
  lessonSlug,
  lessonTitle,
  mode,
  level = 1,
  questions,
  initialHearts,
  initialDiamonds
}: {
  lessonSlug: string;
  lessonTitle: string;
  mode: string;
  level?: number;
  questions: Question[];
  initialHearts: number;
  initialDiamonds: number;
}) {
  const [queue, setQueue] = useState<Question[]>(questions);
  const [index, setIndex] = useState(0);
  const [hearts, setHearts] = useState(initialHearts);
  const [diamonds, setDiamonds] = useState(initialDiamonds);
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [firstTryCorrect, setFirstTryCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const [gameOver, setGameOver] = useState(initialHearts <= 0);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [buyMessage, setBuyMessage] = useState("");
  const [voiceMessage, setVoiceMessage] = useState("");
  const [recording, setRecording] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const question = queue[index];
  const progress = Math.min(100, Math.round(((index + (feedback ? 1 : 0)) / Math.max(queue.length, 1)) * 100));
  const score = useMemo(() => Math.round((firstTryCorrect / Math.max(questions.length, 1)) * 100), [firstTryCorrect, questions.length]);
  const modeLabel = mode === "listening" ? "Menyimak" : mode === "reading" ? "Membaca" : mode === "conversation" ? "Percakapan" : "Campuran 4 Maharah";
  const currentSkill = question ? (skillMeta[question.skill] || skillMeta.reading) : skillMeta.reading;
  const SkillIcon = currentSkill.icon;

  async function verifyAnswer() {
    if (!question || feedback || !selected || verifying || gameOver) return;
    setVerifying(true);
    setBuyMessage("");
    const correct = normalizeArabic(selected) === normalizeArabic(question.correct_answer);

    if (correct) {
      if (!wrongIds.includes(question.id)) setFirstTryCorrect((value) => value + 1);
      setWrongIds((items) => items.filter((id) => id !== question.id));
      setFeedback({ correct: true, message: "Mumtaz! Jawabanmu tepat.", answer: question.correct_answer });
      playPraiseSound();
    } else {
      // Every incorrect check consumes one heart, including a retry of the same question.
      let remainingHearts = Math.max(0, hearts - 1);
      try {
        const result = await loseHeart();
        if (result.ok) remainingHearts = result.hearts;
        else if (result.error) setBuyMessage(`Nyawa belum tersimpan ke akun: ${result.error}`);
      } catch {
        setBuyMessage("Koneksi belum stabil. Pengurangan nyawa hanya berlaku pada sesi ini.");
      }
      setHearts(remainingHearts);
      setWrongIds((items) => items.includes(question.id) ? items : [...items, question.id]);
      setFeedback({ correct: false, message: "Belum tepat. Perhatikan koreksinya, lalu coba lagi.", answer: question.correct_answer });
      if (remainingHearts <= 0) setGameOver(true);
    }
    setVerifying(false);
  }

  async function nextQuestion() {
    if (gameOver) return;
    setSelected(null);
    setFeedback(null);
    setVoiceMessage("");
    if (index + 1 < queue.length) {
      setIndex((value) => value + 1);
      return;
    }

    const pending = questions.filter((item) => wrongIds.includes(item.id));
    if (pending.length > 0) {
      setQueue(pending);
      setIndex(0);
      return;
    }

    setSaving(true);
    setFinished(true);
    const finalScore = Math.round((firstTryCorrect / Math.max(questions.length, 1)) * 100);
    const diamondsEarned = Math.max(1, Math.round(finalScore / 10));
    const xpEarned = Math.min(1000, questions.length * 10 + Math.round(finalScore / 5));
    const result = await saveQuizResult({
      lessonSlug,
      score: finalScore,
      correctCount: firstTryCorrect,
      questionCount: questions.length,
      xpEarned,
      diamondsEarned
    });
    setSavedMessage(result.ok ? `Progres tersimpan. +${xpEarned} XP dan +${diamondsEarned} berlian.` : (result.error || "Sesi selesai. Progres belum tersimpan."));
    setSaving(false);
  }

  async function refillHearts() {
    setBuyMessage("");
    const result = await buyHearts();
    if (result.ok) {
      setHearts(result.hearts ?? 5);
      setDiamonds(result.diamonds ?? diamonds);
      setGameOver(false);
      setBuyMessage("Nyawa berhasil diisi. Lanjutkan pelajaranmu!");
    } else {
      setBuyMessage(result.error || "Berlian belum cukup untuk mengisi nyawa.");
    }
  }

  function startVoicePractice() {
    const browserWindow = window as Window & { SpeechRecognition?: any; webkitSpeechRecognition?: any };
    const Recognition = browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition;
    if (!Recognition) {
      setVoiceMessage("Fitur mikrofon belum didukung browser ini. Kamu tetap bisa memilih jawaban di bawah.");
      return;
    }
    const recognition = new Recognition();
    recognition.lang = "ar-SA";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => { setRecording(true); setVoiceMessage("Silakan ucapkan jawaban dalam Bahasa Arab."); };
    recognition.onend = () => setRecording(false);
    recognition.onerror = () => { setRecording(false); setVoiceMessage("Suara belum tertangkap. Coba lagi atau pilih jawaban secara manual."); };
    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript ?? "";
      setSelected(transcript);
      setVoiceMessage(transcript ? `Terdengar: ${transcript}` : "Suara belum terbaca. Silakan coba lagi.");
    };
    recognition.start();
  }

  if (finished) {
    const diamondsEarned = Math.max(1, Math.round(score / 10));
    const xpEarned = Math.min(1000, questions.length * 10 + Math.round(score / 5));
    return (
      <div className="mx-auto max-w-xl surface p-7 text-center md:p-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#fff0d9] text-[#bd795a]"><Sparkles size={40} /></div>
        <p className="mt-5 text-xs font-black uppercase tracking-[.18em] text-[#827148]">Tahap selesai</p>
        <h1 className="mt-2 text-3xl font-black">مُمْتَازٌ! Hebat!</h1>
        <p className="mt-2 text-sm text-[#718078]">Kamu telah menyelesaikan 15 soal pada Materi 1 · tahap {level}.</p>
        <div className="my-7 grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-[#fffaf3] p-4"><div className="text-2xl font-black">{score}</div><div className="text-xs font-bold text-[#718078]">Skor / 100</div></div>
          <div className="rounded-2xl bg-[#fffaf3] p-4"><div className="flex items-center justify-center gap-1 text-2xl font-black text-sky-600"><Gem size={19} />{diamondsEarned}</div><div className="text-xs font-bold text-[#718078]">Berlian</div></div>
          <div className="rounded-2xl bg-[#fffaf3] p-4"><div className="text-2xl font-black text-[#bd795a]">+{xpEarned}</div><div className="text-xs font-bold text-[#718078]">XP</div></div>
        </div>
        <p className="rounded-xl bg-[#eaf2df] p-3 text-sm font-bold text-[#657449]">{saving ? "Menyimpan progres..." : savedMessage}</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link className="btn-primary" href={`/practice/${lessonSlug}?mode=mixed&level=${level}`}>Ulangi tahap</Link>
          {level < 7 ? <Link className="btn-secondary" href={`/practice/${lessonSlug}?mode=mixed&level=${level + 1}`}>Tahap berikutnya →</Link> : <Link className="btn-secondary" href="/dashboard">Kembali ke beranda</Link>}
        </div>
      </div>
    );
  }

  if (!question) return <div className="surface p-8 text-center">Soal belum tersedia. Jalankan migration 003 di Supabase terlebih dahulu.</div>;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/dashboard" aria-label="Kembali" className="rounded-full bg-white p-2 text-[#827148] shadow-sm"><ArrowLeft size={22} /></Link>
        <div className="progress-track flex-1"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
        <span className="flex items-center gap-1 font-black text-rose-500"><Heart size={19} fill="currentColor" />{hearts}</span>
      </div>

      <div className="surface p-5 md:p-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full bg-[#fff0d9] px-3 py-1.5 text-xs font-black text-[#a76d50]">Tahap {level} · Materi 1</span>
          <span className="rounded-full bg-[#f1eadb] px-3 py-1.5 text-xs font-black text-[#827148]">{modeLabel}</span>
          <span className="text-xs font-bold text-[#8a9890]">Soal {Math.min(index + 1, questions.length)} dari 15</span>
        </div>

        <div className="mb-4 flex items-center gap-3 rounded-2xl bg-[#fff0d9] p-3">
          <CatMascot mood={feedback ? (feedback.correct ? "celebrate" : "thinking") : "happy"} size={68} />
          <div><p className="text-xs font-black text-[#a76d50]">ARABEEZA MENEMANIMU</p><p className="text-sm font-bold text-[#6d604c]">{feedback ? (feedback.correct ? "Yeay, jawabanmu tepat!" : "Tidak apa-apa, ayo belajar dari koreksi.") : "Pikirkan jawabannya dulu, ya. Periksa kalau sudah yakin!"}</p></div>
        </div>

        <div className="mb-3 flex items-center gap-2"><span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-black ${currentSkill.color}`}><SkillIcon size={15} />{currentSkill.label}</span><span className="text-xs font-semibold text-[#89968f]">Salah menjawab = kehilangan 1 nyawa</span></div>
        <h1 className="text-xl font-black leading-8 md:text-2xl">{question.prompt}</h1>
        {question.prompt_arabic && <p className="arabic mt-5 rounded-2xl bg-[#fffaf3] px-4 py-5 text-center text-3xl font-bold">{question.prompt_arabic}</p>}

        {question.skill === "listening" && question.audio_text && (
          <button type="button" onClick={() => speakArabic(question.audio_text || "")} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#e7dccb] bg-[#fffaf3] px-4 py-3 font-bold text-[#827148]">
            <Volume2 size={19} /> Dengarkan audio Bahasa Arab
          </button>
        )}
        {question.skill === "reading" && question.prompt_arabic && (
          <button type="button" onClick={() => speakArabic(question.prompt_arabic || "")} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#e7dccb] bg-white px-4 py-3 text-sm font-bold text-[#827148]">
            <Volume2 size={18} /> Dengarkan contoh bacaan
          </button>
        )}
        {question.skill === "speaking" && (
          <div className="mt-4 rounded-2xl bg-[#f8e6dc] p-4">
            <p className="text-sm font-bold text-[#785a4a]">Coba ucapkan jawabanmu dalam Bahasa Arab sebelum memilih.</p>
            <button type="button" onClick={startVoicePractice} disabled={recording || !!feedback} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-extrabold text-[#a76d50] disabled:opacity-50"><Mic size={17} />{recording ? "Mendengarkan..." : "Latihan berbicara"}</button>
            {voiceMessage && <p className="mt-2 text-xs text-[#785a4a]">{voiceMessage}</p>}
          </div>
        )}

        <div className="mt-6 grid gap-3">
          {(question.options || []).map((option) => {
            const isCorrect = Boolean(feedback) && normalizeArabic(option) === normalizeArabic(question.correct_answer);
            const isWrong = Boolean(feedback) && selected === option && !feedback?.correct;
            return (
              <button key={option} type="button" disabled={!!feedback} onClick={() => setSelected(option)} className={`choice ${selected === option ? "border-[#827148] bg-[#fff0d9]" : ""} ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`}>
                <span className="flex items-center justify-between gap-3"><span>{option}</span>{isCorrect ? <CheckCircle2 size={19} /> : isWrong ? <XCircle size={19} /> : null}</span>
              </button>
            );
          })}
        </div>

        {feedback && (
          <div className={`mt-5 rounded-2xl p-4 ${feedback.correct ? "bg-[#eaf2df] text-[#586b3d]" : "bg-[#fff0e9] text-[#a65d4b]"}`}>
            <div className="flex items-center gap-2 font-black">{feedback.correct ? <CheckCircle2 size={19} /> : <XCircle size={19} />}{feedback.message}</div>
            {!feedback.correct && <p className="mt-2 text-sm">Jawaban yang tepat: <strong>{feedback.answer}</strong></p>}
            {question.explanation && <p className="mt-2 text-sm leading-6">{question.explanation}</p>}
            <button type="button" onClick={nextQuestion} disabled={gameOver} className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-black text-white disabled:cursor-not-allowed disabled:opacity-40 ${feedback.correct ? "bg-[#827148]" : "bg-[#bd795a]"}`}>
              Lanjutkan <ArrowRight size={17} />
            </button>
          </div>
        )}

        {!feedback && <div className="mt-6"><div className="flex items-center justify-between text-xs font-bold text-[#8a9890]"><span>{selected ? "Sudah yakin? Periksa jawabanmu." : "Pilih satu jawaban terlebih dahulu."}</span><span className="flex items-center gap-1"><Gem size={14} className="text-sky-500" />{diamonds}</span></div><button type="button" disabled={!selected || recording || verifying || gameOver} onClick={verifyAnswer} className="btn-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-40">{verifying ? "Memeriksa..." : "Periksa jawaban"}</button></div>}
      </div>
      <div className="mt-4 text-center text-xs text-[#89968f]">Materi: {lessonTitle} · Tahap {level} · 15 soal</div>

      {gameOver && (
        <div className="life-overlay" role="presentation">
          <section className="life-dialog" role="dialog" aria-modal="true" aria-labelledby="life-title">
            <div className="mb-4 flex items-center justify-between"><span className="rounded-full bg-[#f8e6dc] px-3 py-1 text-xs font-black text-[#a76d50]">ENERGI HABIS</span><Heart className="text-rose-500" fill="currentColor" size={28} /></div>
            <div className="flex items-center gap-3"><CatMascot mood="sad" size={78} /><div><h2 id="life-title" className="text-2xl font-black">Kamu kehabisan nyawa!</h2><p className="mt-1 text-sm leading-5 text-[#718078]">Pelajaran belum selesai. Pilih cara untuk melanjutkan.</p></div></div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={refillHearts} className="rounded-2xl border-2 border-[#e8a07c] bg-white p-4 text-left transition hover:bg-[#fff0d9]"><span className="flex items-center justify-between"><Heart className="text-rose-500" fill="currentColor" size={23} /><span className="rounded-full bg-[#fff0d9] px-2 py-1 text-xs font-black text-[#a76d50]">25 💎</span></span><strong className="mt-3 block text-sm">Isi ulang nyawa</strong><span className="mt-1 block text-xs leading-5 text-[#718078]">Isi kembali hingga 5 nyawa menggunakan 25 berlian.</span></button>
              <Link href="/dashboard" className="rounded-2xl border-2 border-[#d9d3c3] bg-white p-4 text-left transition hover:bg-[#f1eadb]"><span className="flex h-[23px] items-center text-2xl">🏡</span><strong className="mt-3 block text-sm">Akhiri pelajaran</strong><span className="mt-1 block text-xs leading-5 text-[#718078]">Simpan dulu latihan dan kembali ke beranda.</span></Link>
            </div>
            {buyMessage && <p className="mt-4 rounded-xl bg-[#fff0e9] p-3 text-sm font-bold text-[#a65d4b]">{buyMessage}</p>}
            <p className="mt-4 text-center text-xs text-[#89968f]">Berlian tersedia: {diamonds} 💎</p>
          </section>
        </div>
      )}
    </div>
  );
}
