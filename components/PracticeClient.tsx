"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, CheckCircle2, Gem, Heart, Mic,
  Volume2, VolumeX, XCircle, Headphones, BookOpen,
  PencilLine, Star
} from "lucide-react";
import { buyHearts, loseHeart, saveQuizResult } from "@/app/actions";
import { normalizeArabic } from "@/lib/utils";
import type { Question } from "@/lib/types";
import CatMascot from "@/components/CatMascot";

type Feedback = { correct: boolean; message: string; answer: string };
type DialogueLine = { speaker: string; text: string };

function starsForScore(score: number) {
  if (score >= 100) return 3;
  if (score >= 67) return 2;
  return 1;
}

function findExpressiveVoice(voices: SpeechSynthesisVoice[], language: string) {
  const prefix = language.toLowerCase().split("-")[0];
  const matching = voices.filter((voice) => voice.lang.toLowerCase().startsWith(prefix));
  const feminineNames = /(female|woman|zira|sara|maryam|mariam|hoda|laila|layla|salma|noura|noor|farah|heba|maha|amira|amina|aisha|ayesha|reem|reema|lina|dalia|sanaa|nada|microsoft.*(salma|hoda|amira))/i;
  return matching.find((voice) => feminineNames.test(voice.name))
    || matching.find((voice) => /google/i.test(voice.name))
    || matching[0]
    || null;
}

function getDialogueLines(question: Question): DialogueLine[] | null {
  const source = question.prompt_arabic || question.prompt;
  const firstArabic = source.search(/[\u0600-\u06FF]/);
  if (firstArabic < 0) return null;

  const arabicText = source.slice(firstArabic);
  const speakerNames = "(?:أَحْمَدُ|أَحْمَد|أحمد|عَلِيٌّ|عَلِيّ|عَلِي|علي|فَاطِمَةُ|فَاطِمَة|فاطمة|عَائِشَةُ|عَائِشَة|عائشة|مَرْيَمُ|مَرْيَم|مريم|مُحَمَّدٌ|مُحَمَّد|محمد|سَارَةُ|سارة|خَالِدٌ|خالد|زَيْنَبُ|زينب|يُوسُفُ|يوسف|حَسَنٌ|حسن)";
  const pattern = new RegExp(`(${speakerNames})\\s*:\\s*([\\s\\S]*?)(?=\\s+${speakerNames}\\s*:|$)`, "gu");
  const lines = [...arabicText.matchAll(pattern)].map((match) => ({
    speaker: match[1].trim(),
    text: match[2].trim()
  })).filter((line) => line.speaker && line.text);

  return lines.length >= 2 ? lines : null;
}

function playAnswerChime(correct: boolean) {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const context = new AudioContextClass();
    if (context.state === "suspended") void context.resume();
    const notes = correct ? [880, 1174.66] : [392, 329.63];
    notes.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const startAt = context.currentTime + index * 0.105;
      oscillator.type = correct ? "sine" : "triangle";
      oscillator.frequency.setValueAtTime(frequency, startAt);
      gain.gain.setValueAtTime(0.0001, startAt);
      gain.gain.exponentialRampToValueAtTime(correct ? 0.12 : 0.065, startAt + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.24);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(startAt);
      oscillator.stop(startAt + 0.25);
      if (index === notes.length - 1) oscillator.onended = () => void context.close();
    });
  } catch {
    // Audio is optional; answer checking must keep working if the browser blocks sound.
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
  initialDiamonds,
  initialHeartsResetDate,
  initialBestStars = 0
}: {
  lessonSlug: string;
  lessonTitle: string;
  mode: string;
  level?: number;
  questions: Question[];
  initialHearts: number;
  initialDiamonds: number;
  initialHeartsResetDate: string;
  initialBestStars?: number;
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
  const [bestStars, setBestStars] = useState(initialBestStars);
  const [buyMessage, setBuyMessage] = useState("");
  const [voiceMessage, setVoiceMessage] = useState("");
  const [recording, setRecording] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechMessage, setSpeechMessage] = useState("");
  const voiceListRef = useRef<SpeechSynthesisVoice[]>([]);
  const speechTimerRef = useRef<number | null>(null);
  const speechTokenRef = useRef(0);

  useEffect(() => {
    setHearts(initialHearts);
    setGameOver(initialHearts <= 0);
  }, [initialHearts, initialHeartsResetDate]);

  useEffect(() => {
    setDiamonds(initialDiamonds);
  }, [initialDiamonds]);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const loadVoices = () => { voiceListRef.current = window.speechSynthesis.getVoices(); };
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, []);

  useEffect(() => () => {
    speechTokenRef.current += 1;
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  function stopSpeech(showMessage = false) {
    speechTokenRef.current += 1;
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    speechTimerRef.current = null;
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    if (showMessage) setSpeechMessage("Audio dihentikan.");
  }

  function speakText(text: string, language = "ar-SA") {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSpeechMessage("Audio suara belum didukung browser ini. Coba gunakan Chrome atau Edge terbaru.");
      return;
    }
    if (!text.trim()) return;

    const token = speechTokenRef.current + 1;
    speechTokenRef.current = token;
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const availableVoices = synth.getVoices().length ? synth.getVoices() : voiceListRef.current;
    const voice = findExpressiveVoice(availableVoices, language);
    utterance.lang = voice?.lang || language;
    if (voice) utterance.voice = voice;
    utterance.rate = language.toLowerCase().startsWith("ar") ? 0.88 : 1.02;
    utterance.pitch = 1.2;
    utterance.volume = 1;

    const finishSpeech = () => {
      if (speechTokenRef.current !== token) return;
      if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
      speechTimerRef.current = null;
      setIsSpeaking(false);
    };

    utterance.onstart = () => {
      if (speechTokenRef.current === token) {
        setIsSpeaking(true);
        setSpeechMessage("");
      }
    };
    utterance.onend = finishSpeech;
    utterance.onerror = (event) => {
      finishSpeech();
      if (speechTokenRef.current === token && event.error !== "canceled" && event.error !== "interrupted") {
        setSpeechMessage("Suara tidak dapat diputar. Coba tekan tombol audio sekali lagi.");
      }
    };

    // A short delay after cancel helps Chromium browsers restart speech cleanly.
    window.setTimeout(() => {
      if (speechTokenRef.current !== token) return;
      synth.speak(utterance);
      speechTimerRef.current = window.setTimeout(() => {
        if (speechTokenRef.current !== token) return;
        synth.cancel();
        setIsSpeaking(false);
        setSpeechMessage("Audio dihentikan otomatis agar latihan tidak macet. Tekan dengarkan untuk mengulang.");
      }, Math.min(24000, Math.max(5000, text.length * 170)));
    }, 90);
  }

  const question = queue[index];
  const progress = Math.min(100, Math.round(((index + (feedback ? 1 : 0)) / Math.max(queue.length, 1)) * 100));
  const score = useMemo(() => Math.round((firstTryCorrect / Math.max(questions.length, 1)) * 100), [firstTryCorrect, questions.length]);
  const modeLabel = mode === "listening" ? "Menyimak" : mode === "reading" ? "Membaca" : mode === "conversation" ? "Percakapan" : "Campuran 4 Maharah";
  const currentSkill = question ? (skillMeta[question.skill] || skillMeta.reading) : skillMeta.reading;
  const SkillIcon = currentSkill.icon;
  const dialogueLines = question ? getDialogueLines(question) : null;
  const promptLabel = question && dialogueLines && question.prompt.includes(":")
    ? question.prompt.slice(0, question.prompt.indexOf(":") + 1)
    : question?.prompt;

  async function verifyAnswer() {
    if (!question || feedback || !selected || verifying || gameOver) return;
    setVerifying(true);
    setBuyMessage("");
    const correct = normalizeArabic(selected) === normalizeArabic(question.correct_answer);

    if (correct) {
      playAnswerChime(true);
      const praise = ["Bagus!", "Mumtaz!", "Keren!"][Math.floor(Math.random() * 3)];
      speakText(praise, "id-ID");
      if (!wrongIds.includes(question.id)) setFirstTryCorrect((value) => value + 1);
      setWrongIds((items) => items.filter((id) => id !== question.id));
      setFeedback({ correct: true, message: "Mumtaz! Jawabanmu tepat.", answer: question.correct_answer });
    } else {
      playAnswerChime(false);
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
      setFeedback({ correct: false, message: "Belum tepat. Tidak apa-apa, kita coba lagi!", answer: question.correct_answer });
      if (remainingHearts <= 0) setGameOver(true);
    }
    setVerifying(false);
  }

  async function nextQuestion() {
    if (gameOver) return;
    stopSpeech();
    setSelected(null);
    setFeedback(null);
    setVoiceMessage("");
    setSpeechMessage("");
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
    const earnedStars = starsForScore(finalScore);
    setBestStars(Math.max(initialBestStars, earnedStars));
    const diamondsEarned = Math.max(1, Math.round(finalScore / 10));
    const xpEarned = Math.min(1000, questions.length * 10 + Math.round(finalScore / 5));
    let result: Awaited<ReturnType<typeof saveQuizResult>>;
    try {
      result = await saveQuizResult({
        lessonSlug,
        levelNo: level,
        score: finalScore,
        correctCount: firstTryCorrect,
        questionCount: questions.length,
        xpEarned,
        diamondsEarned
      });
    } catch {
      result = { ok: false, error: "Koneksi belum stabil. Sesi selesai, tetapi progres belum tersimpan." };
    }
    if (result.ok) {
      const savedBestStars = Math.max(initialBestStars, earnedStars, result.bestStars || 0);
      setBestStars(savedBestStars);
      setSavedMessage(`Progres tersimpan. +${xpEarned} XP dan +${diamondsEarned} berlian. Bintang terbaikmu: ${savedBestStars} dari 3.`);
    } else {
      setSavedMessage(result.error || "Sesi selesai, tetapi progres belum tersimpan.");
    }
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
    const finalScore = score;
    const diamondsEarned = Math.max(1, Math.round(finalScore / 10));
    const xpEarned = Math.min(1000, questions.length * 10 + Math.round(finalScore / 5));
    return (
      <div className="finish-card pop-in mx-auto max-w-2xl surface p-6 text-center md:p-10">
        <div className="finish-celebration">
          <span className="finish-sparkle finish-sparkle-one">✦</span>
          <span className="finish-sparkle finish-sparkle-two">✧</span>
          <CatMascot mood="celebrate" size={112} className="mascot-celebrate" />
        </div>
        <p className="mt-2 text-xs font-black uppercase tracking-[.18em] text-[#827148]">LEVEL {level} SELESAI</p>
        <h1 className="mt-2 text-3xl font-black">مُمْتَازٌ! Hebat!</h1>
        <p className="mt-2 text-sm text-[#718078]">Kamu telah menuntaskan 15 soal pada {lessonTitle}.</p>
        <div className="finish-star-row" aria-label={`${bestStars} dari 3 bintang terbaik`}>
          {[1, 2, 3].map((star) => <Star key={star} size={38} className={star <= bestStars ? "finish-star earned" : "finish-star"} fill={star <= bestStars ? "currentColor" : "none"} />)}
        </div>
        <p className="mt-2 text-sm font-extrabold text-[#9b7a2e]">{bestStars} dari 3 bintang terbaik</p>
        <div className="my-7 grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-[#fffaf3] p-4"><div className="text-2xl font-black">{finalScore}</div><div className="text-xs font-bold text-[#718078]">Skor / 100</div></div>
          <div className="rounded-2xl bg-[#fffaf3] p-4"><div className="flex items-center justify-center gap-1 text-2xl font-black text-sky-600"><Gem size={19} />{diamondsEarned}</div><div className="text-xs font-bold text-[#718078]">Berlian</div></div>
          <div className="rounded-2xl bg-[#fffaf3] p-4"><div className="text-2xl font-black text-[#bd795a]">+{xpEarned}</div><div className="text-xs font-bold text-[#718078]">XP</div></div>
        </div>
        <p className="rounded-xl bg-[#eaf2df] p-3 text-sm font-bold text-[#657449]">{saving ? "Menyimpan progres..." : savedMessage}</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link className="btn-secondary" href={`/practice/${lessonSlug}?mode=mixed&level=${level}`}>Ulangi tahap</Link>
          {level < 7 ? <Link className="btn-primary" href={`/practice/${lessonSlug}?mode=mixed&level=${level + 1}`}>Tahap berikutnya <ArrowRight size={17} /></Link> : <Link className="btn-primary" href="/dashboard">Kembali ke beranda</Link>}
        </div>
      </div>
    );
  }

  if (!question) return <div className="surface p-8 text-center">Soal belum tersedia. Jalankan migration 003 di Supabase terlebih dahulu.</div>;

  return (
    <div className={`practice-page mx-auto max-w-3xl ${feedback ? "has-feedback" : ""}`}>
      <div className="mb-6 flex items-center gap-4">
        <Link href="/dashboard" aria-label="Kembali" className="practice-back rounded-full bg-white p-2 text-[#827148] shadow-sm"><ArrowLeft size={22} /></Link>
        <div className="flex-1">
          <div className="progress-track practice-progress"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
          <p className="mt-1 text-[10px] font-extrabold tracking-wide text-[#9a9b8d]">TAHAP {level} · SOAL {Math.min(index + 1, questions.length)} / 15</p>
        </div>
        <span className="flex items-center gap-1 font-black text-rose-500"><Heart size={19} fill="currentColor" />{hearts}</span>
      </div>

      <div className="practice-card surface p-5 md:p-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full bg-[#fff0d9] px-3 py-1.5 text-xs font-black text-[#a76d50]">Tahap {level} · Materi 1</span>
          <span className="rounded-full bg-[#f1eadb] px-3 py-1.5 text-xs font-black text-[#827148]">{modeLabel}</span>
          <span className="text-xs font-bold text-[#8a9890]">{lessonTitle}</span>
        </div>

        <div className="mascot-coach mb-5 flex items-center gap-3 rounded-2xl p-3">
          <CatMascot mood={feedback ? (feedback.correct ? "celebrate" : "thinking") : "happy"} size={76} className="mascot-float shrink-0" />
          <div className="mascot-speech-bubble">
            <p className="text-[10px] font-black tracking-[.12em] text-[#a76d50]">ARABEEZA MENEMANIMU</p>
            <p className="mt-1 text-sm font-bold leading-5 text-[#6d604c]">{feedback ? (feedback.correct ? "Yeay! Kamu berhasil. Pertahankan semangatmu!" : "Tidak apa-apa. Yuk, perhatikan petunjuknya.") : "Ayo pikirkan jawabannya. Kamu pasti bisa!"}</p>
          </div>
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-black ${currentSkill.color}`}><SkillIcon size={15} />{currentSkill.label}</span>
          <span className="text-xs font-semibold text-[#89968f]">Jawaban salah mengurangi 1 nyawa</span>
        </div>
        <h1 className="text-xl font-black leading-8 md:text-2xl">{promptLabel}</h1>

        {dialogueLines ? (
          <div className="dialogue-list mt-5" aria-label="Dialog percakapan">
            {dialogueLines.map((line, lineIndex) => (
              <div className="dialogue-line" key={`${line.speaker}-${lineIndex}`}>
                <span className="dialogue-speaker">{line.speaker}</span>
                <p className="arabic text-right text-2xl font-bold">{line.text}</p>
              </div>
            ))}
          </div>
        ) : question.prompt_arabic && (
          <p className="arabic mt-5 rounded-2xl bg-[#fffaf3] px-4 py-5 text-center text-3xl font-bold">{question.prompt_arabic}</p>
        )}

        {question.skill === "listening" && question.audio_text && (
          <div className="audio-card mt-4">
            <div className="audio-card-icon"><Volume2 size={21} /></div>
            <div className="min-w-0 flex-1"><p className="text-sm font-black text-[#705b3c]">Dengarkan suara Maryam</p><p className="mt-0.5 text-xs text-[#9a8a70]">Pelafalan Bahasa Arab dengan intonasi lebih lembut</p></div>
            <button type="button" onClick={() => isSpeaking ? stopSpeech() : speakText(question.audio_text || "", "ar-SA")} className="audio-play-button" aria-label={isSpeaking ? "Hentikan audio" : "Putar audio"}>
              {isSpeaking ? <VolumeX size={19} /> : <Volume2 size={19} />}
            </button>
          </div>
        )}
        {question.skill === "reading" && question.prompt_arabic && (
          <button type="button" onClick={() => isSpeaking ? stopSpeech() : speakText(question.prompt_arabic || "", "ar-SA")} className="audio-read-button mt-3">
            {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}{isSpeaking ? "Hentikan audio" : "Dengarkan contoh bacaan"}
          </button>
        )}
        {speechMessage && <p className="mt-2 rounded-xl bg-[#fff6df] px-3 py-2 text-xs font-semibold text-[#98702b]" role="status">{speechMessage}</p>}

        {question.skill === "speaking" && (
          <div className="mt-4 rounded-2xl bg-[#f8e6dc] p-4">
            <p className="text-sm font-bold text-[#785a4a]">Coba ucapkan jawabanmu dalam Bahasa Arab sebelum memilih.</p>
            <button type="button" onClick={startVoicePractice} disabled={recording || !!feedback} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-extrabold text-[#a76d50] disabled:opacity-50"><Mic size={17} />{recording ? "Mendengarkan..." : "Latihan berbicara"}</button>
            {voiceMessage && <p className="mt-2 text-xs text-[#785a4a]">{voiceMessage}</p>}
          </div>
        )}

        <div className="mt-6 grid gap-3">
          {(question.options || []).map((option, optionIndex) => {
            const isCorrect = Boolean(feedback) && normalizeArabic(option) === normalizeArabic(question.correct_answer);
            const isWrong = Boolean(feedback) && selected === option && !feedback?.correct;
            return (
              <button key={option} type="button" dir="auto" disabled={!!feedback} onClick={() => setSelected(option)} className={`choice choice-animated ${selected === option ? "is-selected" : ""} ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`} style={{ animationDelay: `${optionIndex * 45}ms` }} aria-pressed={selected === option}>
                <span className="flex items-center justify-between gap-3"><span>{option}</span>{isCorrect ? <CheckCircle2 size={19} /> : isWrong ? <XCircle size={19} /> : null}</span>
              </button>
            );
          })}
        </div>

        {!feedback && (
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs font-bold text-[#8a9890]"><span>{selected ? "Sudah yakin? Periksa jawabanmu." : "Pilih satu jawaban terlebih dahulu."}</span><span className="flex items-center gap-1"><Gem size={14} className="text-sky-500" />{diamonds}</span></div>
            <button type="button" disabled={!selected || recording || verifying || gameOver} onClick={verifyAnswer} className="btn-primary practice-check-button mt-4 w-full disabled:cursor-not-allowed disabled:opacity-40">{verifying ? "Memeriksa..." : "Periksa jawaban"}</button>
          </div>
        )}
      </div>
      <div className="mt-4 text-center text-xs text-[#89968f]">Materi: {lessonTitle} · Tahap {level} · 15 soal</div>

      {feedback && (
        <div className={`feedback-dock ${feedback.correct ? "feedback-correct" : "feedback-try"}`} role="status" aria-live="polite">
          <div className="feedback-dock-inner">
            <div className="feedback-dock-top">
              <CatMascot mood={feedback.correct ? "celebrate" : "thinking"} size={66} className="mascot-feedback" />
              <div className="min-w-0 flex-1">
                <p className="feedback-eyebrow">{feedback.correct ? "✦ JAWABAN TEPAT ✦" : "YUK, COBA LAGI"}</p>
                <h2 className="text-xl font-black">{feedback.correct ? "Keren!" : "Belum tepat, tidak apa-apa!"}</h2>
                <p className="mt-1 text-sm leading-5">{feedback.message}</p>
              </div>
            </div>
            {!feedback.correct && <p className="feedback-answer">Jawaban yang tepat: <strong dir="auto">{feedback.answer}</strong></p>}
            {question.explanation && <p className="feedback-explanation">{question.explanation}</p>}
            <button type="button" onClick={nextQuestion} disabled={gameOver} className="feedback-next-button disabled:cursor-not-allowed disabled:opacity-40">Lanjutkan <ArrowRight size={18} /></button>
          </div>
        </div>
      )}

      {gameOver && (
        <div className="life-overlay" role="presentation">
          <section className="life-dialog pop-in" role="dialog" aria-modal="true" aria-labelledby="life-title">
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
