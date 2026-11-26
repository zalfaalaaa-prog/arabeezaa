"use client";

import { Children, useEffect, useRef, useState, type ReactNode, type TouchEvent } from "react";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";

/**
 * Komponen ini mengubah bagian materi inti menjadi presentasi sederhana.
 * Siswa dapat berpindah slide dengan tombol atau menggeser layar ponsel.
 * Tujuan pembelajaran dan pertanyaan pemantik tetap berada di luar komponen ini.
 */
export default function LessonSlides({ children, title = "Materi inti" }: { children: ReactNode; title?: string }) {
  const slides = Children.toArray(children);
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const total = slides.length;

  useEffect(() => {
    if (viewportRef.current) viewportRef.current.scrollTop = 0;
  }, [activeIndex]);

  function previous() {
    setActiveIndex((current) => Math.max(0, current - 1));
  }

  function next() {
    setActiveIndex((current) => Math.min(total - 1, current + 1));
  }

  function onTouchStart(event: TouchEvent<HTMLDivElement>) {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  }

  function onTouchEnd(event: TouchEvent<HTMLDivElement>) {
    if (touchStartX.current === null) return;
    const endX = event.changedTouches[0]?.clientX;
    if (endX === undefined) return;
    const delta = endX - touchStartX.current;
    if (Math.abs(delta) > 55) {
      if (delta < 0) next();
      else previous();
    }
    touchStartX.current = null;
  }

  if (!total) return null;

  return (
    <section className="lesson-slides-wrap mt-7" aria-label={title}>
      <div className="lesson-slides-heading">
        <div className="lesson-slides-icon" aria-hidden="true"><BookOpen size={21} /></div>
        <div>
          <p className="material-kicker">PRESENTASI MATERI</p>
          <h2 className="text-xl font-black">{title}</h2>
        </div>
        <span className="lesson-slide-count">{activeIndex + 1} / {total}</span>
      </div>

      <div ref={viewportRef} className="lesson-slide-viewport" tabIndex={0} aria-label="Area materi yang dapat digulir" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="lesson-slide-content" key={activeIndex} aria-live="polite">
          {slides[activeIndex]}
        </div>
      </div>

      <div className="lesson-slide-footer">
        <button type="button" className="lesson-slide-button secondary" onClick={previous} disabled={activeIndex === 0}>
          <ArrowLeft size={17} /> Sebelumnya
        </button>
        <div className="lesson-slide-dots" role="group" aria-label="Pilih slide materi">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`lesson-slide-dot ${activeIndex === index ? "active" : ""}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Buka slide ${index + 1}`}
              aria-current={activeIndex === index ? "step" : undefined}
            />
          ))}
        </div>
        <button type="button" className="lesson-slide-button primary" onClick={next} disabled={activeIndex === total - 1}>
          Berikutnya <ArrowRight size={17} />
        </button>
      </div>
      <p className="lesson-slide-hint">Geser ke kiri atau kanan untuk berpindah slide.</p>
    </section>
  );
}
