"use client";

import { useEffect, useRef, useState } from "react";
import {
  Accessibility,
  Check,
  Contrast,
  RotateCcw,
  Type,
  Volume2,
  VolumeX,
  X
} from "lucide-react";

type TextScale = "normal" | "large" | "larger";
type AccessibilitySettings = {
  textScale: TextScale;
  highContrast: boolean;
  reduceMotion: boolean;
  readableFont: boolean;
  spaciousText: boolean;
  underlineLinks: boolean;
};

const STORAGE_KEY = "arabeeza-accessibility-v1";
const DEFAULT_SETTINGS: AccessibilitySettings = {
  textScale: "normal",
  highContrast: false,
  reduceMotion: false,
  readableFont: false,
  spaciousText: false,
  underlineLinks: false
};

function getTextScaleValue(scale: TextScale) {
  if (scale === "larger") return "1.25";
  if (scale === "large") return "1.12";
  return "1";
}

export default function AccessibilityTools({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [ready, setReady] = useState(false);
  const panelTitleRef = useRef<HTMLHeadingElement>(null);
  const menuOpenerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let initial = DEFAULT_SETTINGS;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<AccessibilitySettings>;
        initial = { ...DEFAULT_SETTINGS, ...parsed };
      } else if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
        initial = { ...DEFAULT_SETTINGS, reduceMotion: true };
      }
    } catch {
      // Pengaturan tetap dapat digunakan selama halaman terbuka jika penyimpanan lokal diblokir.
    }
    setSettings(initial);
    setReady(true);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.a11yContrast = settings.highContrast ? "high" : "normal";
    root.dataset.a11yMotion = settings.reduceMotion ? "reduced" : "full";
    root.dataset.a11yReadableFont = settings.readableFont ? "on" : "off";
    root.dataset.a11ySpacing = settings.spaciousText ? "wide" : "normal";
    root.dataset.a11yUnderline = settings.underlineLinks ? "on" : "off";
    root.style.setProperty("--a11y-font-scale", getTextScaleValue(settings.textScale));

    if (ready) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      } catch {
        setNotice("Pengaturan berlaku selama halaman terbuka, tetapi tidak dapat disimpan di perangkat ini.");
      }
    }
  }, [settings, ready]);

  useEffect(() => {
    const openFromMenu = () => {
      menuOpenerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setOpen(true);
    };
    window.addEventListener("arabeeza:open-accessibility", openFromMenu);
    return () => window.removeEventListener("arabeeza:open-accessibility", openFromMenu);
  }, []);

  useEffect(() => {
    if (!open) return;
    panelTitleRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuOpenerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  function updateSetting<K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) {
    setSettings((current) => ({ ...current, [key]: value }));
    setNotice("Pengaturan aksesibilitas diperbarui.");
  }

  function resetSettings() {
    const systemPrefersLessMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || false;
    setSettings({ ...DEFAULT_SETTINGS, reduceMotion: systemPrefersLessMotion });
    setNotice("Pengaturan dikembalikan ke kondisi awal.");
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeaking(false);
  }

  function readSelectedText() {
    const selectedText = window.getSelection()?.toString().trim() || "";
    if (!selectedText) {
      setNotice("Pilih atau sorot teks pada halaman terlebih dahulu, lalu tekan Bacakan teks.");
      return;
    }
    if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
      setNotice("Fitur pembaca suara belum didukung browser ini. Kamu tetap dapat menggunakan pembaca layar perangkat.");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(selectedText);
    const arabicCharacterCount = (selectedText.match(/[\u0600-\u06FF]/g) || []).length;
    const latinCharacterCount = (selectedText.match(/[A-Za-z]/g) || []).length;
    utterance.lang = arabicCharacterCount > latinCharacterCount ? "ar-SA" : "id-ID";
    utterance.rate = 0.9;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => {
      setSpeaking(false);
      setNotice("Teks tidak dapat dibacakan. Coba lagi atau gunakan pembaca layar perangkat.");
    };
    window.speechSynthesis.speak(utterance);
    setNotice("Pembacaan teks dimulai.");
  }

  function stopReading() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeaking(false);
    setNotice("Pembacaan suara dihentikan.");
  }

  return (
    <>
      <a className="skip-link" href="#main-content">Lewati ke konten utama</a>
      {children}

      <div className="a11y-tools-root">
        {open && (
          <section
            id="arabeeza-accessibility-panel"
            className="a11y-panel"
            role="dialog"
            aria-modal="false"
            aria-labelledby="a11y-panel-title"
          >
            <div className="a11y-panel-heading">
              <div className="flex min-w-0 items-center gap-3">
                <span className="a11y-panel-icon" aria-hidden="true"><Accessibility size={22} /></span>
                <div className="min-w-0">
                  <h2 id="a11y-panel-title" ref={panelTitleRef} tabIndex={-1} className="text-base font-black">Aksesibilitas ARABEEZA</h2>
                  <p className="text-xs a11y-muted">Atur tampilan dan cara belajar.</p>
                </div>
              </div>
              <button type="button" className="a11y-icon-button" onClick={() => { setOpen(false); menuOpenerRef.current?.focus(); }} aria-label="Tutup pengaturan aksesibilitas">
                <X size={19} />
              </button>
            </div>

            <div className="a11y-panel-content">
              <fieldset className="a11y-fieldset">
                <legend><Type size={16} aria-hidden="true" /> Ukuran tulisan</legend>
                <div className="a11y-scale-options" role="group" aria-label="Pilih ukuran tulisan">
                  {([
                    ["normal", "Normal", "A"] as const,
                    ["large", "Besar", "A+ "] as const,
                    ["larger", "Lebih besar", "A++"] as const
                  ]).map(([value, label, sample]) => (
                    <button
                      key={value}
                      type="button"
                      className={`a11y-scale-button ${settings.textScale === value ? "is-active" : ""}`}
                      aria-pressed={settings.textScale === value}
                      onClick={() => updateSetting("textScale", value)}
                    >
                      <strong>{sample}</strong><span>{label}</span>
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="a11y-fieldset">
                <legend><Contrast size={16} aria-hidden="true" /> Tampilan</legend>
                <label className="a11y-option-row">
                  <span><strong>Kontras tinggi</strong><small>Perjelas teks, batas, dan tombol.</small></span>
                  <input type="checkbox" checked={settings.highContrast} onChange={(event) => updateSetting("highContrast", event.target.checked)} />
                </label>
                <label className="a11y-option-row">
                  <span><strong>Teks lebih mudah dibaca</strong><small>Gunakan huruf sederhana dan jarak huruf lebih lega.</small></span>
                  <input type="checkbox" checked={settings.readableFont} onChange={(event) => updateSetting("readableFont", event.target.checked)} />
                </label>
                <label className="a11y-option-row">
                  <span><strong>Jarak teks lebih lega</strong><small>Tambah jarak antarbaris dan paragraf.</small></span>
                  <input type="checkbox" checked={settings.spaciousText} onChange={(event) => updateSetting("spaciousText", event.target.checked)} />
                </label>
                <label className="a11y-option-row">
                  <span><strong>Garis bawah tautan</strong><small>Bantu membedakan tautan dari teks biasa.</small></span>
                  <input type="checkbox" checked={settings.underlineLinks} onChange={(event) => updateSetting("underlineLinks", event.target.checked)} />
                </label>
              </fieldset>

              <fieldset className="a11y-fieldset">
                <legend><Accessibility size={16} aria-hidden="true" /> Gerakan dan suara</legend>
                <label className="a11y-option-row">
                  <span><strong>Kurangi animasi</strong><small>Hentikan gerakan dekoratif dan transisi.</small></span>
                  <input type="checkbox" checked={settings.reduceMotion} onChange={(event) => updateSetting("reduceMotion", event.target.checked)} />
                </label>
                <div className="a11y-speech-tools">
                  <div>
                    <strong>Bacakan teks yang dipilih</strong>
                    <small>Sorot teks terlebih dahulu. Suara mengikuti bahasa teks jika terdeteksi.</small>
                  </div>
                  {speaking ? (
                    <button type="button" className="a11y-speech-button" onClick={stopReading}><VolumeX size={16} /> Hentikan</button>
                  ) : (
                    <button type="button" className="a11y-speech-button" onClick={readSelectedText}><Volume2 size={16} /> Bacakan</button>
                  )}
                </div>
              </fieldset>

              <p className="a11y-storage-note">Pilihanmu disimpan di perangkat ini dan berlaku di halaman ARABEEZA berikutnya.</p>
              <div className="a11y-panel-actions">
                <button type="button" className="a11y-reset-button" onClick={resetSettings}><RotateCcw size={15} /> Atur ulang</button>
                <button type="button" className="a11y-done-button" onClick={() => { setOpen(false); menuOpenerRef.current?.focus(); }}><Check size={16} /> Selesai</button>
              </div>
              {notice && <p className="a11y-live-note" role="status" aria-live="polite">{notice}</p>}
            </div>
          </section>
        )}

      </div>
    </>
  );
}
