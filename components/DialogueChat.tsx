"use client";

import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export type DialogueTurn = { speaker: string; arabic: string; translation: string };

export default function DialogueChat({ title, turns }: { title: string; turns: DialogueTurn[] }) {
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [notice, setNotice] = useState("");

  function speak(line: string, index: number) {
    if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
      setNotice("Audio tidak didukung browser ini. Teks percakapan tetap dapat dibaca.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(line);
    utterance.lang = "ar-SA";
    utterance.rate = 0.86;
    utterance.pitch = 1.08;
    utterance.onstart = () => { setActiveLine(index); setNotice(""); };
    utterance.onend = () => setActiveLine(null);
    utterance.onerror = () => { setActiveLine(null); setNotice("Audio belum dapat diputar. Coba tekan tombol suara lagi."); };
    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className="dialogue-chat-wrap">
      <h3 className="mb-3 font-black">{title}</h3>
      <div className="dialogue-chat-list" role="list" aria-label={title}>
        {turns.map((turn, index) => (
          <article key={`${turn.speaker}-${index}`} role="listitem" className={`dialogue-chat-row ${index % 2 === 0 ? "is-left" : "is-right"}`}>
            <span className={`dialogue-chat-avatar ${index % 2 === 0 ? "avatar-mint" : "avatar-peach"}`} aria-hidden="true">{turn.speaker.trim().slice(0, 1)}</span>
            <div className="dialogue-chat-bubble">
              <div className="dialogue-chat-meta"><span>{turn.speaker}</span><button type="button" className="dialogue-audio-button" onClick={() => speak(turn.arabic, index)} aria-label={`${activeLine === index ? "Putar ulang" : "Dengarkan"} dialog ${turn.speaker}`}>{activeLine === index ? <VolumeX size={16}/> : <Volume2 size={16}/>}</button></div>
              <p lang="ar" dir="rtl" className="arabic dialogue-chat-arabic">{turn.arabic}</p>
              {turn.translation && <p className="dialogue-chat-translation">{turn.translation}</p>}
            </div>
          </article>
        ))}
      </div>
      {notice && <p className="mt-2 text-xs font-semibold text-[#98702b]" role="status">{notice}</p>}
    </div>
  );
}
