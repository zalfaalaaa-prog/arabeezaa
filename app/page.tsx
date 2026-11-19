import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import CatMascot from "@/components/CatMascot";

export default function HomePage() {
  return (
    <div className="arabeeza-landing min-h-[100svh] overflow-hidden bg-[#fffdf7]">
      <header className="page-wrap landing-header flex items-center justify-between">
        <Link href="/" className="landing-brand" aria-label="Arabeeza beranda">
          <span className="landing-brand-icon"><Image src="/logo.svg" alt="" width={48} height={48} priority /></span>
          <span>arabeeza<span className="landing-brand-dot">.</span></span>
        </Link>
        <nav aria-label="Akun" className="landing-nav flex items-center gap-3">
          <Link href="/login" className="landing-login">Masuk</Link>
          <Link href="/register" className="landing-register">Mulai belajar <ArrowRight size={17} /></Link>
        </nav>
      </header>

      <main id="main-content" tabIndex={-1} className="landing-main">
        <section className="page-wrap landing-hero">
          <div className="landing-copy">
            <span className="landing-eyebrow"><Sparkles size={16} /> HALO, TEMAN ARABEEZA!</span>
            <h1>Yuk, belajar Bahasa Arab dengan cara yang <span>seru!</span></h1>
            <p>Temukan kosakata baru, kenali percakapan, dan selesaikan tantangan belajar bersama teman kucing Arabeeza.</p>
            <div className="landing-actions">
              <Link href="/register" className="landing-primary">Mulai perjalanan <ArrowRight size={19} /></Link>
              <Link href="/login" className="landing-secondary">Saya sudah punya akun</Link>
            </div>
            <p className="landing-note">Untuk siswa kelas X Madrasah Aliyah <span aria-hidden="true">✦</span></p>
          </div>

          <div className="landing-mascot-stage" aria-label="Maskot Arabeeza menyambut siswa">
            <span className="landing-deco landing-deco-star" aria-hidden="true">✦</span>
            <span className="landing-deco landing-deco-heart" aria-hidden="true">♥</span>
            <span className="landing-deco landing-deco-spark" aria-hidden="true">✧</span>
            <div className="landing-speech-bubble">
              <span className="landing-speech-arabic" lang="ar" dir="rtl">مَرْحَبًا!</span>
              <span>Hai! Ayo belajar bareng aku!</span>
            </div>
            <div className="landing-mascot-card">
              <CatMascot mood="celebrate" size={230} className="landing-mascot" />
              <span className="landing-mascot-caption">Teman belajar Bahasa Arabmu</span>
            </div>
            <span className="landing-ground" aria-hidden="true" />
          </div>
        </section>
      </main>
    </div>
  );
}
