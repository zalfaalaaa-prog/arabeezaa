"use client";

import { Children, isValidElement, useEffect, useRef, useState, type ReactNode, type ReactElement, type TouchEvent } from "react";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";

/**
 * Komponen ini mengubah bagian materi inti menjadi presentasi sederhana.
 * Siswa dapat berpindah slide dengan tombol atau menggeser layar ponsel.
 * Tujuan pembelajaran dan pertanyaan pemantik tetap berada di luar komponen ini.
 */
export default function LessonSlides({ children, title = "Materi inti" }: { children: ReactNode; title?: string }) {
  const slides = Children.toArray(children);
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStart = useRef<{ x: number; y: number; ignored: boolean } | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const total = slides.length;
  const dialogSlideIndex = slides.findIndex((slide) =>
    isValidElement(slide) && (slide as ReactElement<{ id?: string }>).props.id === "dialog"
  );

  useEffect(() => {
    const syncHashToSlide = () => {
      if (window.location.hash === "#dialog" && dialogSlideIndex >= 0) {
        setActiveIndex(dialogSlideIndex);
      }
    };
    syncHashToSlide();
    window.addEventListener("hashchange", syncHashToSlide);
    return () => window.removeEventListener("hashchange", syncHashToSlide);
  }, [dialogSlideIndex]);

  useEffect(() => {
    if (viewportRef.current) viewportRef.current.scrollTop = 0;
    if (window.location.hash === "#dialog" && activeIndex === dialogSlideIndex) {
      document.getElementById("dialog")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeIndex, dialogSlideIndex]);

  function previous() {
    setActiveIndex((current) => Math.max(0, current - 1));
  }

  function next() {
    setActiveIndex((current) => Math.min(total - 1, current + 1));
  }

  function onTouchStart(event: TouchEvent<HTMLDivElement>) {
    const target = event.target;
    const interactiveOrScrollable = target instanceof Element
      ? target.closest("[data-no-slide-swipe], .lesson-table-scroll, table, button, a, input, select, textarea, [role='button'], [contenteditable='true']")
      : null;
    const touch = event.changedTouches[0];
    if (!touch) return;
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      ignored: Boolean(interactiveOrScrollable)
    };
  }

  function onTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || start.ignored) return;
    const touch = event.changedTouches[0];
    if (!touch) return;
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    // Navigasi slide hanya aktif untuk geseran mendatar yang jelas.
    // Gerakan vertikal tetap dipakai untuk scroll dan gerakan pada tabel diabaikan.
    if (Math.abs(deltaX) > 55 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25) {
      if (deltaX < 0) next();
      else previous();
    }
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
