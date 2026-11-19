"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, CheckCircle2, Gem, Heart, Mic,
  Volume2, VolumeX, XCircle, Headphones, BookOpen,
  PencilLine, Star, MessageCircle
} from "lucide-react";
import { buyHearts, buyHeartsWithXp, loseHeart, saveQuizResult } from "@/app/actions";
import { normalizeArabic } from "@/lib/utils";
import type { Question } from "@/lib/types";
import CatMascot from "@/components/CatMascot";

type Feedback = { correct: boolean; message: string; answer: string; skipped?: boolean };
type DialogueLine = { speaker: string; text: string };

type MatchingPairOption = { id: string; arabic: string; meaning: string };
type ImageChoiceOption = { label: string; emoji: string };

function shuffleItems<T>(items: T[]): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }
  return result;
}

function isMatchingPair(option: unknown): option is MatchingPairOption {
  return Boolean(option && typeof option === "object" && "id" in option && "arabic" in option && "meaning" in option);
}

function isImageChoice(option: unknown): option is ImageChoiceOption {
  return Boolean(option && typeof option === "object" && "label" in option && "emoji" in option);
}

function starsForScore(score: number) {
  if (score >= 100) return 3;
  if (score >= 67) return 2;
  return 1;
}

function normalizeSpeechArabic(value: string) {
  return normalizeArabic(value)
    .toLowerCase()
    .replace(/[ة]/g, "ه")
    .replace(/[ؤ]/g, "و")
    .replace(/[ئ]/g, "ي")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function editDistance(a: string, b: string) {
  const previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= b.length; j += 1) {
      const insertion = current[j - 1] + 1;
      const deletion = previous[j] + 1;
      const substitution = previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1);
      current[j] = Math.min(insertion, deletion, substitution);
    }
    for (let j = 0; j <= b.length; j += 1) previous[j] = current[j];
  }
  return previous[b.length];
}

function speechMatchesAnswer(spoken: string, expected: string) {
  const a = normalizeSpeechArabic(spoken);
  const b = normalizeSpeechArabic(expected);
  if (!a || !b) return false;
  if (a === b) return true;
  if (a.length < 4 || b.length < 4) return false;
  const distance = editDistance(a, b);
  const similarity = 1 - distance / Math.max(a.length, b.length);
  return similarity >= (Math.min(a.length, b.length) <= 8 ? 0.78 : 0.72);
}

function findExpressiveVoice(voices: SpeechSynthesisVoice[], language: string) {
  const prefix = language.toLowerCase().split("-")[0];
  const matching = voices.filter((voice) => voice.lang.toLowerCase().startsWith(prefix));
  const feminineNames = /(female|woman|zira|sara|maryam|mariam|hoda|laila|layla|salma|noura|noor|farah|heba|maha|amira|amina|aisha|ayesha|reem|reema|lina|dalia|sanaa|nada|google.*female|microsoft.*(salma|hoda|amira|zira)|indonesia.*female|id.*female)/i;
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
  const speakerNames = "(?:أَحْمَدُ|أَحْمَد|أحمد|عَلِيٌّ|عَلِيّ|عَلِي|علي|فَاطِمَةُ|فَاطِمَة|فاطمة|عَائِشَةُ|عَائِشَة|عائشة|مَرْيَمُ|مَرْيَم|مريم|مُحَمَّدٌ|مُحَمَّد|محمد|سَارَةُ|سارة|خَالِدٌ|خالد|زَيْنَبُ|زينب|يُوسُفُ|يوسف|حَسَنٌ|حسن|فَارِسٌ|فَارِس|فارس|زَيْدٌ|زَيْد|زيد|عَبْدُاللَّهِ|عَبْدُ اللَّهِ|عبدالله)";
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
  writing: { label: "Menulis", icon: PencilLine, color: "bg-[#fff0d9] text-[#bd795a]" },
  vocabulary: { label: "Kosakata", icon: BookOpen, color: "bg-[#edf3fc] text-[#506b99]" },
  grammar: { label: "Tata bahasa", icon: PencilLine, color: "bg-[#f1eafa] text-[#8060a8]" },
  conversation: { label: "Percakapan", icon: MessageCircle, color: "bg-[#edf0fa] text-[#50638e]" }
};

export default function PracticeClient({
  lessonSlug,
  lessonTitle,
  mode,
  level = 1,
  questions,
  initialHearts,
  initialDiamonds,
  initialXp,
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
  initialXp: number;
  initialHeartsResetDate: string;
  initialBestStars?: number;
}) {
  const [queue, setQueue] = useState<Question[]>(questions);
  const [index, setIndex] = useState(0);
  const [hearts, setHearts] = useState(initialHearts);
  const [diamonds, setDiamonds] = useState(initialDiamonds);
  const [xp, setXp] = useState(initialXp);
  const [refilling, setRefilling] = useState(false);
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
  const [wordTokens, setWordTokens] = useState<string[]>([]);
  const [leftMatchChoice, setLeftMatchChoice] = useState<string | null>(null);
  const [rightMatchChoice, setRightMatchChoice] = useState<string | null>(null);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [wrongPairIds, setWrongPairIds] = useState<string[]>([]);
  const [matchingMistakes, setMatchingMistakes] = useState(0);
  const [speakingSkipped, setSpeakingSkipped] = useState(false);
  const [showAudioTranscript, setShowAudioTranscript] = useState(false);
  const [manualSpeakingAnswer, setManualSpeakingAnswer] = useState("");
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
    setXp(initialXp);
  }, [initialXp]);

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
    const isArabic = language.toLowerCase().startsWith("ar");
    const isPraise = /bagu|keren|mumtaz/i.test(text);
    utterance.rate = isPraise ? 0.72 : (isArabic ? 0.86 : 0.96);
    utterance.pitch = isPraise ? 1.3 : 1.18;
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

    // Jeda kecil setelah cancel membantu Chromium memulai suara tanpa menumpuk utterance.
    window.setTimeout(() => {
      if (speechTokenRef.current !== token) return;
      synth.speak(utterance);
      // Safety timeout dibuat cukup longgar agar suara Arab tidak terpotong saat pelafalan lambat.
      speechTimerRef.current = window.setTimeout(() => {
        if (speechTokenRef.current !== token) return;
        synth.cancel();
        setIsSpeaking(false);
        setSpeechMessage("Audio dihentikan otomatis setelah terlalu lama. Tekan dengarkan untuk mengulang.");
      }, Math.min(45000, Math.max(12000, text.length * 300)));
    }, 120);
  }

  const question = queue[index];
  const matchingPairs = useMemo(
    () => question?.question_type === "matching_pairs"
      ? question.options.filter(isMatchingPair)
      : [],
    [question?.id, question?.options]
  );
  const matchingRightOrder = useMemo(() => shuffleItems(matchingPairs), [question?.id, matchingPairs]);
  const imageOptions = question?.options.filter(isImageChoice) || [];
  const stringOptions = question?.options.filter((option): option is string => typeof option === "string") || [];

  useEffect(() => {
    setWordTokens([]);
    setLeftMatchChoice(null);
    setRightMatchChoice(null);
    setMatchedPairIds([]);
    setWrongPairIds([]);
    setMatchingMistakes(0);
    setSpeakingSkipped(false);
    setShowAudioTranscript(false);
    setManualSpeakingAnswer("");
    setSelected(null);
    setFeedback(null);
    setVoiceMessage("");
    setSpeechMessage("");
  }, [question?.id]);

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
    const isSkipped = question.question_type === "speaking_repeat" && selected === "__SPEAKING_SKIPPED__";
    const isWordOrder = question.question_type === "word_order" || question.question_type === "listen_word_order";
    const correct = isSkipped
      ? true
      : question.question_type === "matching_pairs"
        ? matchingPairs.length > 0 && matchedPairIds.length === matchingPairs.length
        : isWordOrder
          ? normalizeArabic(selected) === normalizeArabic(question.correct_answer)
          : question.skill === "speaking"
            ? speechMatchesAnswer(selected, question.correct_answer)
            : normalizeArabic(selected) === normalizeArabic(question.correct_answer);

    if (isSkipped) {
      setFeedback({
        correct: true,
        skipped: true,
        message: "Latihan berbicara dilewati tanpa mengurangi nyawa. Kamu bisa berlatih lagi kapan saja.",
        answer: question.correct_answer
      });
    } else if (correct) {
      playAnswerChime(true);
      const praise = ["Baguuuuus!", "Mumtaz! Baguuuuus!", "Kereeen!"][Math.floor(Math.random() * 3)];
      speakText(praise, "id-ID");
      const recoveredMatching = question.question_type === "matching_pairs" && matchingMistakes > 0;
      if (!wrongIds.includes(question.id) && !recoveredMatching) setFirstTryCorrect((value) => value + 1);
      setWrongIds((items) => items.filter((id) => id !== question.id));
      if (recoveredMatching) {
        // Satu kesalahan pada satu latihan matching mengurangi satu nyawa;
        // pasangan tetap dapat diperbaiki sampai seluruhnya berwarna hijau.
        let remainingHearts = Math.max(0, hearts - 1);
        try {
          const result = await loseHeart();
          if (result.ok) remainingHearts = result.hearts;
          else if (result.error) setBuyMessage(`Nyawa belum tersimpan ke akun: ${result.error}`);
        } catch {
          setBuyMessage("Koneksi belum stabil. Pengurangan nyawa hanya berlaku pada sesi ini.");
        }
        setHearts(remainingHearts);
        if (remainingHearts <= 0) setGameOver(true);
      }
      setFeedback({
        correct: true,
        message: recoveredMatching
          ? "Semua pasangan sudah tepat. Pasangan yang sempat keliru berhasil kamu perbaiki."
          : "Mumtaz! Jawabanmu tepat.",
        answer: question.correct_answer
      });
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
      setFeedback({
        correct: false,
        message: question.question_type === "matching_pairs"
          ? "Ada pasangan yang belum tepat. Perhatikan kembali pasangan kata dan artinya."
          : "Belum tepat. Tidak apa-apa, kita coba lagi!",
        answer: question.question_type === "matching_pairs" ? "Pasangkan semua kata Arab dengan arti yang benar." : question.correct_answer
      });
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
      setWordTokens([]);
      setLeftMatchChoice(null);
      setRightMatchChoice(null);
      setMatchedPairIds([]);
      setWrongPairIds([]);
      setMatchingMistakes(0);
      setSpeakingSkipped(false);
      setSelected(null);
      setFeedback(null);
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
    setRefilling(true);
    try {
      const result = await buyHearts();
      if (result.ok) {
        setHearts(result.hearts ?? 5);
        setDiamonds(result.diamonds ?? diamonds);
        setGameOver(false);
        setBuyMessage("Nyawa berhasil diisi menggunakan berlian. Lanjutkan pelajaranmu!");
      } else {
        setBuyMessage(result.error || "Berlian belum cukup untuk mengisi nyawa.");
      }
    } catch {
      setBuyMessage("Pengisian nyawa belum berhasil. Periksa koneksi lalu coba lagi.");
    } finally {
      setRefilling(false);
    }
  }

  async function refillHeartsWithXp() {
    setBuyMessage("");
    if (xp < 100) {
      setBuyMessage("XP belum cukup. Kamu membutuhkan 100 XP untuk mengisi nyawa.");
      return;
    }
    setRefilling(true);
    try {
      const result = await buyHeartsWithXp();
      if (result.ok) {
        setHearts(result.hearts ?? 5);
        setXp(result.xp ?? Math.max(0, xp - 100));
        setGameOver(false);
        setBuyMessage("Nyawa berhasil diisi menggunakan XP. Semangat belajar lagi!");
      } else {
        setBuyMessage(result.error || "XP belum cukup untuk mengisi nyawa.");
      }
    } catch {
      setBuyMessage("Pengisian nyawa dengan XP belum berhasil. Coba lagi setelah koneksi stabil.");
    } finally {
      setRefilling(false);
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
      const transcript = String(event.results?.[0]?.[0]?.transcript ?? "").trim();
      const textOptions = (question?.options || []).filter((option): option is string => typeof option === "string");
      const matchingOption = textOptions.find((option) => speechMatchesAnswer(transcript, option));
      const matchesSpeakingTarget = question?.question_type === "speaking_repeat"
        && speechMatchesAnswer(transcript, question.correct_answer);
      const accepted = matchingOption || (matchesSpeakingTarget ? question?.correct_answer : transcript);
      setSelected(accepted || null);
      setVoiceMessage(
        transcript
          ? matchingOption || matchesSpeakingTarget
            ? `Terdengar: ${transcript} · pelafalan cocok.`
            : `Terdengar: ${transcript}`
          : "Suara belum terbaca. Silakan coba lagi."
      );
    };
    recognition.start();
  }

  function chooseWordToken(token: string) {
    if (feedback || wordTokens.includes(token)) return;
    const next = [...wordTokens, token];
    setWordTokens(next);
    setSelected(next.join(" "));
  }

  function removeWordToken(tokenIndex: number) {
    if (feedback) return;
    const next = wordTokens.filter((_, indexValue) => indexValue !== tokenIndex);
    setWordTokens(next);
    setSelected(next.join(" ") || null);
  }

  function matchPair(leftId: string, rightId: string) {
    if (leftId === rightId) {
      const nextMatched = [...matchedPairIds, leftId];
      setMatchedPairIds(nextMatched);
      setLeftMatchChoice(null);
      setRightMatchChoice(null);
      if (nextMatched.length === matchingPairs.length && matchingPairs.length > 0) {
        setSelected(question?.correct_answer || "ALL_MATCHED");
      }
      return;
    }

    setWrongPairIds([`left:${leftId}`, `right:${rightId}`]);
    setMatchingMistakes((value) => value + 1);
    window.setTimeout(() => {
      setWrongPairIds([]);
      setLeftMatchChoice(null);
      setRightMatchChoice(null);
    }, 700);
  }

  function chooseLeftPair(id: string) {
    if (feedback || matchedPairIds.includes(id) || wrongPairIds.length > 0) return;
    if (rightMatchChoice) {
      matchPair(id, rightMatchChoice);
    } else {
      setLeftMatchChoice(id);
    }
  }

  function chooseRightPair(id: string) {
    if (feedback || matchedPairIds.includes(id) || wrongPairIds.length > 0) return;
    if (leftMatchChoice) {
      matchPair(leftMatchChoice, id);
    } else {
      setRightMatchChoice(id);
    }
  }

  function skipSpeakingPractice() {
    if (feedback || recording) return;
    setSpeakingSkipped(true);
    setSelected("__SPEAKING_SKIPPED__");
    setVoiceMessage("Latihan berbicara dilewati. Kamu tetap bisa melanjutkan ke soal berikutnya.");
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
        <div className="finish-star-row" role="img" aria-label={`${bestStars} dari 3 bintang terbaik`}>
          {[1, 2, 3].map((star) => <Star key={star} size={38} className={star <= bestStars ? "finish-star earned" : "finish-star"} fill={star <= bestStars ? "currentColor" : "none"} aria-hidden="true" />)}
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

  if (!question) return <div className="surface p-8 text-center">Soal atau percakapan belum tersedia. Pastikan migration 003, 006, dan 007 sudah dijalankan di Supabase.</div>;

  return (
    <div className={`practice-page mx-auto max-w-3xl ${feedback ? "has-feedback" : ""}`}>
      <div className="mb-6 flex items-center gap-4">
        <Link href="/dashboard" aria-label="Kembali" className="practice-back rounded-full bg-white p-2 text-[#827148] shadow-sm"><ArrowLeft size={22} /></Link>
        <div className="flex-1">
          <div className="progress-track practice-progress" role="progressbar" aria-label="Kemajuan latihan" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
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
          <CatMascot mood={feedback ? (feedback.skipped ? "happy" : feedback.correct ? "celebrate" : "thinking") : "happy"} size={76} className="mascot-float shrink-0" />
          <div className="mascot-speech-bubble">
            <p className="text-[10px] font-black tracking-[.12em] text-[#a76d50]">ARABEEZA MENEMANIMU</p>
            <p className="mt-1 text-sm font-bold leading-5 text-[#6d604c]">{feedback ? (feedback.skipped ? "Latihan ini bisa kamu coba lagi lain waktu." : feedback.correct ? "Yeay! Kamu berhasil. Pertahankan semangatmu!" : "Tidak apa-apa. Yuk, perhatikan petunjuknya.") : "Ayo pikirkan jawabannya. Kamu pasti bisa!"}</p>
          </div>
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-black ${currentSkill.color}`}><SkillIcon size={15} />{currentSkill.label}</span>
          <span className="text-xs font-semibold text-[#89968f]">Jawaban salah mengurangi 1 nyawa</span>
        </div>
        <h1 id="practice-question-title" aria-live="polite" aria-atomic="true" className="text-xl font-black leading-8 md:text-2xl">{promptLabel}</h1>

        {dialogueLines ? (
          <div className="dialogue-chat-list practice-dialogue mt-5" role="group" aria-label="Dialog percakapan sebagai konteks soal">
            {dialogueLines.map((line, lineIndex) => (
              <div className={`dialogue-chat-row ${lineIndex % 2 === 0 ? "is-left" : "is-right"}`} key={`${line.speaker}-${lineIndex}`}>
                <span className={`dialogue-chat-avatar ${lineIndex % 2 === 0 ? "avatar-mint" : "avatar-peach"}`} aria-hidden="true">{line.speaker.trim().slice(0, 1)}</span>
                <div className="dialogue-chat-bubble">
                  <div className="dialogue-chat-meta"><span>{line.speaker}</span><button type="button" className="dialogue-audio-button" onClick={() => isSpeaking ? stopSpeech() : speakText(line.text, "ar-SA")} aria-label={`Dengarkan dialog ${line.speaker}`}>{isSpeaking ? <VolumeX size={15}/> : <Volume2 size={15}/>}</button></div>
                  <p lang="ar" dir="rtl" className="arabic dialogue-chat-arabic">{line.text}</p>
                </div>
              </div>
            ))}
          </div>
        ) : question.prompt_arabic && (
          <p lang="ar" dir="rtl" className="arabic mt-5 rounded-2xl bg-[#fffaf3] px-4 py-5 text-center text-3xl font-bold">{question.prompt_arabic}</p>
        )}

        {question.skill === "listening" && question.audio_text && (
          <div className="audio-card mt-4">
            <div className="audio-card-icon"><Volume2 size={21} /></div>
            <div className="min-w-0 flex-1"><p className="text-sm font-black text-[#705b3c]">Dengarkan ungkapan berikut</p><p className="mt-0.5 text-xs text-[#9a8a70]">Putar audio, simak dengan saksama, lalu jawab pertanyaan.</p></div>
            <button type="button" onClick={() => isSpeaking ? stopSpeech() : speakText(question.audio_text || "", "ar-SA")} className="audio-play-button" aria-label={isSpeaking ? "Hentikan audio" : "Putar audio"}>
              {isSpeaking ? <VolumeX size={19} /> : <Volume2 size={19} />}
            </button>
          </div>
        )}
        {question.skill === "listening" && question.audio_text && (
          <div className="mt-3">
            <button
              type="button"
              className="audio-transcript-toggle"
              aria-expanded={showAudioTranscript}
              aria-controls="listening-transcript"
              onClick={() => setShowAudioTranscript((value) => !value)}
            >
              {showAudioTranscript ? "Sembunyikan transkrip audio" : "Tampilkan transkrip audio (alternatif aksesibilitas)"}
            </button>
            {showAudioTranscript && (
              <p id="listening-transcript" className="audio-transcript" lang={/[\u0600-\u06FF]/.test(question.audio_text) ? "ar" : "id"} dir="auto">{question.audio_text}</p>
            )}
          </div>
        )}
        {question.skill === "reading" && question.prompt_arabic && (
          <button type="button" onClick={() => isSpeaking ? stopSpeech() : speakText(question.prompt_arabic || "", "ar-SA")} className="audio-read-button mt-3">
            {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}{isSpeaking ? "Hentikan audio" : "Dengarkan contoh bacaan"}
          </button>
        )}
        {speechMessage && <p className="mt-2 rounded-xl bg-[#fff6df] px-3 py-2 text-xs font-semibold text-[#98702b]" role="status">{speechMessage}</p>}

        {question.question_type === "speaking_repeat" && (
          <div className="speaking-repeat-card mt-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black text-[#425579]">Dengarkan, lalu ulangi</p>
                <p className="mt-1 text-xs text-[#74819a]">Tekan mikrofon dan ucapkan kalimat dalam Bahasa Arab.</p>
              </div>
              <button
                type="button"
                onClick={() => isSpeaking ? stopSpeech() : speakText(question.audio_text || question.correct_answer, "ar-SA")}
                className="audio-play-button"
                aria-label={isSpeaking ? "Hentikan contoh audio" : "Putar contoh audio"}
              >
                {isSpeaking ? <VolumeX size={19} /> : <Volume2 size={19} />}
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={startVoicePractice} disabled={recording || !!feedback || speakingSkipped} className="inline-flex items-center gap-2 rounded-xl bg-[#3d5a91] px-4 py-3 text-sm font-extrabold text-white disabled:opacity-50">
                <Mic size={17} />{recording ? "Mendengarkan..." : "Mulai berbicara"}
              </button>
              <button type="button" onClick={skipSpeakingPractice} disabled={!!feedback || recording || speakingSkipped} className="rounded-xl border border-[#d7dfed] bg-white px-4 py-3 text-sm font-bold text-[#60708b] disabled:opacity-50">
                Tidak bisa bicara sekarang
              </button>
            </div>
            <div className="mt-4 rounded-xl border border-[#dce5f3] bg-white p-3">
              <label htmlFor="manual-speaking-answer" className="mb-2 block text-xs font-bold text-[#425579]">Alternatif: ketik jawaban jika tidak dapat menggunakan mikrofon</label>
              <input
                id="manual-speaking-answer"
                type="text"
                dir="auto"
                lang="ar"
                value={manualSpeakingAnswer}
                onChange={(event) => { setManualSpeakingAnswer(event.target.value); setSelected(event.target.value.trim() || null); }}
                disabled={!!feedback || speakingSkipped}
                className="input"
                placeholder="Ketik kalimat Bahasa Arab di sini"
                autoComplete="off"
              />
            </div>
            {voiceMessage && <p className="mt-3 text-xs font-semibold text-[#60708b]" role="status">{voiceMessage}</p>}
          </div>
        )}

        {question.skill === "speaking" && question.question_type !== "speaking_repeat" && (
          <div className="mt-4 rounded-2xl bg-[#f8e6dc] p-4">
            <p className="text-sm font-bold text-[#785a4a]">Coba ucapkan jawabanmu dalam Bahasa Arab sebelum memilih.</p>
            <button type="button" onClick={startVoicePractice} disabled={recording || !!feedback} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-extrabold text-[#a76d50] disabled:opacity-50"><Mic size={17} />{recording ? "Mendengarkan..." : "Latihan berbicara"}</button>
            {voiceMessage && <p className="mt-2 text-xs text-[#785a4a]" role="status" aria-live="polite">{voiceMessage}</p>}
          </div>
        )}

        {question.question_type === "matching_pairs" && (
          <div className="matching-game mt-6" role="group" aria-label="Latihan menjodohkan kata Arab dengan arti Bahasa Indonesia">
            <div className="mb-3 flex items-center justify-between gap-2 text-xs font-bold text-[#77849a]">
              <span>Pilih kata Arab, lalu pilih artinya.</span>
              <span aria-live="polite" aria-atomic="true">{matchedPairIds.length} dari {matchingPairs.length} pasangan cocok</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid content-start gap-2">
                <p className="text-center text-[11px] font-black uppercase tracking-wide text-[#7d8796]">Bahasa Arab</p>
                {matchingPairs.map((pair) => (
                  <button
                    key={`left-${pair.id}`}
                    type="button"
                    dir="rtl"
                    disabled={!!feedback || matchedPairIds.includes(pair.id) || wrongPairIds.length > 0}
                    onClick={() => chooseLeftPair(pair.id)}
                    className={`match-tile ${leftMatchChoice === pair.id ? "is-selected" : ""} ${matchedPairIds.includes(pair.id) ? "is-matched" : ""} ${wrongPairIds.includes(`left:${pair.id}`) ? "is-wrong" : ""}`}
                    aria-pressed={leftMatchChoice === pair.id || matchedPairIds.includes(pair.id)}
                    aria-label={`${pair.arabic}${matchedPairIds.includes(pair.id) ? ", sudah cocok" : wrongPairIds.includes(`left:${pair.id}`) ? ", pasangan belum tepat" : leftMatchChoice === pair.id ? ", dipilih" : ", pilih kata Arab"}`}
                    lang="ar"
                  >
                    <span>{pair.arabic}</span>
                    {matchedPairIds.includes(pair.id) ? <CheckCircle2 size={16} aria-hidden="true" /> : wrongPairIds.includes(`left:${pair.id}`) ? <XCircle size={16} aria-hidden="true" /> : null}
                  </button>
                ))}
              </div>
              <div className="grid content-start gap-2">
                <p className="text-center text-[11px] font-black uppercase tracking-wide text-[#7d8796]">Artinya</p>
                {matchingRightOrder.map((pair) => (
                  <button
                    key={`right-${pair.id}`}
                    type="button"
                    disabled={!!feedback || matchedPairIds.includes(pair.id) || wrongPairIds.length > 0}
                    onClick={() => chooseRightPair(pair.id)}
                    className={`match-tile match-tile-meaning ${rightMatchChoice === pair.id ? "is-selected" : ""} ${matchedPairIds.includes(pair.id) ? "is-matched" : ""} ${wrongPairIds.includes(`right:${pair.id}`) ? "is-wrong" : ""}`}
                    aria-pressed={rightMatchChoice === pair.id || matchedPairIds.includes(pair.id)}
                    aria-label={`${pair.meaning}${matchedPairIds.includes(pair.id) ? ", sudah cocok" : wrongPairIds.includes(`right:${pair.id}`) ? ", pasangan belum tepat" : rightMatchChoice === pair.id ? ", dipilih" : ", pilih arti"}`}
                  >
                    <span>{pair.meaning}</span>
                    {matchedPairIds.includes(pair.id) ? <CheckCircle2 size={16} aria-hidden="true" /> : wrongPairIds.includes(`right:${pair.id}`) ? <XCircle size={16} aria-hidden="true" /> : null}
                  </button>
                ))}
              </div>
            </div>
            {wrongPairIds.length > 0 && (
              <p className="mt-3 rounded-xl bg-[#fff0f0] px-3 py-2 text-center text-xs font-bold text-[#a33c45]" role="status" aria-live="assertive">Pasangan belum tepat. Coba pasangkan kembali.</p>
            )}
            {matchedPairIds.length === matchingPairs.length && matchingPairs.length > 0 && (
              <p className="mt-3 rounded-xl bg-[#e7f7e9] px-3 py-2 text-center text-xs font-bold text-[#26834c]" role="status" aria-live="polite">
                Semua pasangan sudah dipasangkan. Tekan Periksa jawaban.
              </p>
            )}
          </div>
        )}

        {(question.question_type === "word_order" || question.question_type === "listen_word_order") && (
          <div className="word-builder mt-6">
            <p className="mb-2 text-xs font-bold text-[#7c8796]">Susunan jawabanmu</p>
            <div className="word-answer-zone" dir="rtl" aria-live="polite" aria-label="Susunan jawaban saat ini">
              {wordTokens.length === 0 ? (
                <span className="text-xs font-semibold text-[#9aa4b2]">Ketuk keping kata di bawah untuk menyusun kalimat.</span>
              ) : wordTokens.map((token, tokenIndex) => (
                <button
                  key={`${token}-${tokenIndex}`}
                  type="button"
                  disabled={!!feedback}
                  onClick={() => removeWordToken(tokenIndex)}
                  className="word-token word-token-selected"
                  dir="auto"
                  aria-label={`Hapus kata ${token}`}
                >
                  {token}
                </button>
              ))}
            </div>
            <div className="word-bank" dir="rtl">
              {stringOptions.map((token, tokenIndex) => {
                const used = wordTokens.includes(token);
                return (
                  <button
                    key={`${token}-${tokenIndex}`}
                    type="button"
                    disabled={used || !!feedback}
                    onClick={() => chooseWordToken(token)}
                    className="word-token"
                    dir="auto"
                    aria-pressed={used}
                    aria-label={`Tambahkan kata ${token}`}
                  >
                    {token}
                  </button>
                );
              })}
            </div>
            <button type="button" onClick={() => { setWordTokens([]); setSelected(null); }} disabled={!wordTokens.length || !!feedback} className="mt-3 text-xs font-bold text-[#72809a] underline disabled:opacity-40">
              Ulangi susunan
            </button>
          </div>
        )}

        {question.question_type === "image_choice" && (
          <div className="image-choice-grid mt-6" role="group" aria-label="Pilih gambar yang sesuai dengan kosakata">
            {imageOptions.map((option, optionIndex) => {
              const isCorrect = Boolean(feedback) && normalizeArabic(option.label) === normalizeArabic(question.correct_answer);
              const isWrong = Boolean(feedback) && selected === option.label && !feedback?.correct;
              return (
                <button
                  key={option.label}
                  type="button"
                  disabled={!!feedback}
                  onClick={() => setSelected(option.label)}
                  className={`image-choice-card ${selected === option.label ? "is-selected" : ""} ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`}
                  style={{ animationDelay: `${optionIndex * 55}ms` }}
                  aria-pressed={selected === option.label}
                >
                  <span className="image-choice-emoji" aria-hidden="true">{option.emoji}</span>
                  <span className="image-choice-label">{option.label}</span>
                  {isCorrect ? <CheckCircle2 size={18} /> : isWrong ? <XCircle size={18} /> : null}
                </button>
              );
            })}
          </div>
        )}

        {!["matching_pairs", "word_order", "listen_word_order", "speaking_repeat", "image_choice"].includes(question.question_type) && (
          <div className="mt-6 grid gap-3" role="group" aria-labelledby="practice-question-title">
            {stringOptions.map((option, optionIndex) => {
              const isCorrect = Boolean(feedback) && normalizeArabic(option) === normalizeArabic(question.correct_answer);
              const isWrong = Boolean(feedback) && selected === option && !feedback?.correct;
              return (
                <button key={`${option}-${optionIndex}`} type="button" dir="auto" disabled={!!feedback} onClick={() => setSelected(option)} className={`choice choice-animated ${selected === option ? "is-selected" : ""} ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`} style={{ animationDelay: `${optionIndex * 45}ms` }} aria-pressed={selected === option}>
                  <span className="flex items-center justify-between gap-3" dir="ltr">
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="choice-letter" aria-hidden="true">{String.fromCharCode(65 + optionIndex)}</span>
                      <span className="min-w-0" dir="auto">{option}</span>
                    </span>
                    {isCorrect ? <CheckCircle2 size={19} /> : isWrong ? <XCircle size={19} /> : null}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {!feedback && (
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs font-bold text-[#8a9890]"><span>{selected ? "Sudah yakin? Periksa jawabanmu." : "Pilih satu jawaban terlebih dahulu."}</span><span className="flex items-center gap-1"><Gem size={14} className="text-sky-500" />{diamonds}</span></div>
            <button type="button" disabled={!selected || recording || verifying || gameOver} onClick={verifyAnswer} className="btn-primary practice-check-button mt-4 w-full disabled:cursor-not-allowed disabled:opacity-40">{verifying ? "Memeriksa..." : "Periksa jawaban"}</button>
          </div>
        )}
      </div>
      <div className="mt-4 text-center text-xs text-[#89968f]">Materi: {lessonTitle} · Tahap {level} · 15 soal</div>

      {feedback && (
        <div className={`feedback-dock ${feedback.correct ? "feedback-correct" : "feedback-try"} ${feedback.skipped ? "feedback-skip" : ""}`} role="status" aria-live="polite">
          <div className="feedback-dock-inner">
            <div className="feedback-dock-top">
              <CatMascot mood={feedback.correct ? "celebrate" : "thinking"} size={66} className="mascot-feedback" />
              <div className="min-w-0 flex-1">
                <p className="feedback-eyebrow">{feedback.skipped ? "LATIHAN DILEWATI" : feedback.correct ? "✦ JAWABAN TEPAT ✦" : "YUK, COBA LAGI"}</p>
                <h2 className="text-xl font-black">{feedback.skipped ? "Lanjutkan belajar!" : feedback.correct ? "Keren!" : "Belum tepat, tidak apa-apa!"}</h2>
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
              <button type="button" onClick={refillHearts} disabled={refilling} className="life-refill-option life-refill-diamond" aria-label="Isi ulang hingga lima nyawa dengan 25 berlian"><span className="flex items-center justify-between"><Heart className="text-rose-500" fill="currentColor" size={23} /><span className="rounded-full bg-[#fff0d9] px-2 py-1 text-xs font-black text-[#a76d50]">25 💎</span></span><strong className="mt-3 block text-sm">Isi dengan berlian</strong><span className="mt-1 block text-xs leading-5 text-[#718078]">Isi kembali hingga 5 nyawa menggunakan 25 berlian.</span></button>
              <button type="button" onClick={refillHeartsWithXp} disabled={refilling || xp < 100} className="life-refill-option life-refill-xp" aria-label="Isi ulang hingga lima nyawa dengan 100 XP"><span className="flex items-center justify-between"><span className="text-2xl font-black text-[#bd795a]">✦</span><span className="rounded-full bg-[#f8e6dc] px-2 py-1 text-xs font-black text-[#a76d50]">100 XP</span></span><strong className="mt-3 block text-sm">Isi dengan XP</strong><span className="mt-1 block text-xs leading-5 text-[#718078]">Tukarkan 100 XP untuk mengisi kembali hingga 5 nyawa.</span>{xp < 100 && <span className="mt-2 block text-[11px] font-bold text-[#a65d4b]">XP belum cukup</span>}</button>
              <Link href="/dashboard" className="rounded-2xl border-2 border-[#d9d3c3] bg-white p-4 text-left transition hover:bg-[#f1eadb] sm:col-span-2"><span className="flex h-[23px] items-center text-2xl">🏡</span><strong className="mt-3 block text-sm">Akhiri pelajaran</strong><span className="mt-1 block text-xs leading-5 text-[#718078]">Kembali ke beranda dan lanjutkan nanti.</span></Link>
            </div>
            {buyMessage && <p className="mt-4 rounded-xl bg-[#fff0e9] p-3 text-sm font-bold text-[#a65d4b]" role="status">{buyMessage}</p>}
            <p className="mt-4 text-center text-xs text-[#89968f]">Berlian tersedia: {diamonds} 💎 <span className="mx-1">·</span> XP tersedia: {xp} ✦</p>
          </section>
        </div>
      )}
    </div>
  );
}
