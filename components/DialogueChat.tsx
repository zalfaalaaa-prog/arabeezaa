"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";

export type DialogueTurn = { speaker: string; arabic: string; translation: string };

function arabicVoices() {
  if (!("speechSynthesis" in window)) return [];
  return window.speechSynthesis.getVoices().filter((voice) => voice.lang.toLowerCase().startsWith("ar"));
}

export default function DialogueChat({ title, turns }: { title: string; turns: DialogueTurn[] }) {
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [playingAll, setPlayingAll] = useState(false);
  const [notice, setNotice] = useState("");
  const playbackTokenRef = useRef(0);

  useEffect(() => () => {
    playbackTokenRef.current += 1;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  function stop() {
    playbackTokenRef.current += 1;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setActiveLine(null);
    setPlayingAll(false);
  }

  function speak(line: string, index: number) {
    if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
      setNotice("Audio tidak didukung browser ini. Teks percakapan tetap dapat dibaca.");
      return;
    }
    stop();
    const token = playbackTokenRef.current + 1;
    playbackTokenRef.current = token;
    const voices = arabicVoices();
    const utterance = new SpeechSynthesisUtterance(line);
    utterance.lang = voices[0]?.lang || "ar-SA";
    if (voices[0]) utterance.voice = voices[0];
    utterance.rate = 0.88;
    utterance.pitch = index % 2 === 0 ? 0.94 : 1.12;
    utterance.onstart = () => { if (playbackTokenRef.current === token) { setActiveLine(index); setPlayingAll(false); setNotice(""); } };
    utterance.onend = () => { if (playbackTokenRef.current === token) setActiveLine(null); };
    utterance.onerror = (event) => { if (playbackTokenRef.current === token) { setActiveLine(null); if (event.error !== "canceled" && event.error !== "interrupted") setNotice("Audio belum dapat diputar. Coba tekan tombol suara lagi."); } };
    window.speechSynthesis.speak(utterance);
  }

  function speakAll() {
    if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
      setNotice("Audio tidak didukung browser ini. Teks percakapan tetap dapat dibaca.");
      return;
    }
    stop();
    const playbackToken = playbackTokenRef.current + 1;
    playbackTokenRef.current = playbackToken;
    const voices = arabicVoices();
    const dialogueVoices = voices.slice(0, 2);
    const dialogueTurns = turns.filter((turn) => turn.arabic.trim());
    if (!dialogueTurns.length) return;
    let current = 0;
    setPlayingAll(true);
    setNotice(dialogueVoices.length > 1 ? "Dialog diputar dengan dua suara pembicara." : "Dialog diputar dengan intonasi berbeda. Ketersediaan suara mengikuti browser.");

    const playNext = () => {
      if (playbackTokenRef.current !== playbackToken) return;
      if (current >= dialogueTurns.length) {
        setActiveLine(null);
        setPlayingAll(false);
        return;
      }
      const turn = dialogueTurns[current];
      const utterance = new SpeechSynthesisUtterance(turn.arabic);
      const selectedVoice = dialogueVoices.length > 1 ? dialogueVoices[current % 2] : dialogueVoices[0];
      utterance.lang = selectedVoice?.lang || "ar-SA";
      if (selectedVoice) utterance.voice = selectedVoice;
      utterance.rate = current % 2 === 0 ? 0.88 : 0.94;
      utterance.pitch = current % 2 === 0 ? 0.92 : 1.14;
      utterance.onstart = () => { if (playbackTokenRef.current === playbackToken) setActiveLine(current); };
      utterance.onend = () => {
        if (playbackTokenRef.current !== playbackToken) return;
        current += 1;
        window.setTimeout(playNext, 90);
      };
      utterance.onerror = (event) => {
        if (playbackTokenRef.current !== playbackToken) return;
        if (event.error !== "canceled" && event.error !== "interrupted") setNotice("Satu baris audio tidak dapat diputar. Dialog akan dilanjutkan.");
        current += 1;
        window.setTimeout(playNext, 120);
      };
      window.speechSynthesis.speak(utterance);
    };
    playNext();
  }

  return (
    <div className="dialogue-chat-wrap">
      <div className="dialogue-chat-heading">
        <h3 className="font-black">{title}</h3>
        <button type="button" className="dialogue-play-all" onClick={() => playingAll ? stop() : speakAll()}>
          {playingAll ? <VolumeX size={16} /> : <Play size={16} fill="currentColor" />}
          {playingAll ? "Hentikan dialog" : "Dengarkan dialog"}
        </button>
      </div>
      <div className="dialogue-chat-list" role="list" aria-label={title}>
        {turns.map((turn, index) => (
          <article key={`${turn.speaker}-${index}`} role="listitem" className={`dialogue-chat-row ${index % 2 === 0 ? "is-left" : "is-right"}`}>
            <span className={`dialogue-chat-avatar ${index % 2 === 0 ? "avatar-mint" : "avatar-peach"}`} aria-hidden="true">{turn.speaker.trim().slice(0, 1)}</span>
            <div className="dialogue-chat-bubble">
              <div className="dialogue-chat-meta"><span>{turn.speaker}</span><button type="button" className="dialogue-audio-button" onClick={() => activeLine === index ? stop() : speak(turn.arabic, index)} aria-label={`${activeLine === index ? "Hentikan" : "Dengarkan"} dialog ${turn.speaker}`}>{activeLine === index ? <VolumeX size={16}/> : <Volume2 size={16}/>}</button></div>
              <p lang="ar" dir="rtl" className="arabic dialogue-chat-arabic">{turn.arabic}</p>
              {turn.translation && <p className="dialogue-chat-translation">{turn.translation}</p>}
            </div>
          </article>
        ))}
      </div>
      {notice && <p className="mt-2 text-xs font-semibold text-[#65758d]" role="status">{notice}</p>}
    </div>
  );
}
