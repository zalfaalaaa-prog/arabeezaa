import Link from "next/link";
import Image from "next/image";
import { login } from "@/app/actions";
import SubmitButton from "@/components/SubmitButton";
import CatMascot from "@/components/CatMascot";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; registered?: string }> }) {
  const params = await searchParams;
  return (
    <main id="main-content" tabIndex={-1} className="login-page min-h-screen px-4 py-8 md:px-8">
      <div className="login-layout mx-auto grid min-h-[calc(100svh-4rem)] w-full max-w-6xl items-center gap-7 lg:grid-cols-[1.05fr_.95fr]">
        <section className="login-welcome-panel order-1">
          <Link href="/" className="login-brand" aria-label="Kembali ke beranda Arabeeza">
            <span className="login-brand-icon"><Image src="/logo.svg" alt="" width={48} height={48} priority /></span>
            <span>arabeeza<span>.</span></span>
          </Link>
          <div className="login-welcome-copy">
            <span className="login-welcome-kicker">HALO LAGI, TEMAN ARABEEZA!</span>
            <h1>Yuk, belajar Bahasa Arab dengan cara yang <span>seru!</span></h1>
            <p>Masuk kembali dan lanjutkan petualangan belajarmu bersama teman kucing Arabeeza.</p>
          </div>
          <div className="login-cat-scene" aria-label="Maskot kucing Arabeeza menyambut siswa">
            <span className="login-cat-star star-one" aria-hidden="true">✦</span>
            <span className="login-cat-star star-two" aria-hidden="true">✧</span>
            <div className="login-cat-bubble"><span lang="ar" dir="rtl">مَرْحَبًا!</span><small>Senang bertemu kamu lagi!</small></div>
            <CatMascot mood="celebrate" size={230} className="login-cat-mascot" />
            <span className="login-cat-caption">Teman belajar Bahasa Arabmu</span>
          </div>
        </section>

        <section className="login-form-column order-2">
          <div className="login-card surface w-full p-6 sm:p-8 md:p-9">
            <p className="text-xs font-black tracking-[.18em] text-[#658d7b]">SELAMAT DATANG KEMBALI</p>
            <h2 className="mt-2 text-3xl font-black">Masuk ke Arabeeza</h2>
            <p className="mt-2 text-sm leading-6 text-[#718078]">Gunakan akunmu untuk melanjutkan belajar.</p>
            {params.registered && <p role="status" className="mt-5 rounded-xl bg-[#e8f2e8] p-3 text-sm font-bold text-[#365e4c]">Akun berhasil dibuat. Silakan masuk setelah verifikasi email jika diminta.</p>}
            {params.error && <p role="alert" className="mt-5 rounded-xl bg-[#fff0f0] p-3 text-sm text-[#a33c45]">{params.error}</p>}
            <form action={login} className="mt-6 space-y-4">
              <div><label htmlFor="login-email" className="mb-2 block text-sm font-bold">Email</label><input id="login-email" className="input" type="email" name="email" autoComplete="email" required placeholder="nama@email.com" /></div>
              <div><label htmlFor="login-password" className="mb-2 block text-sm font-bold">Kata sandi</label><input id="login-password" className="input" type="password" name="password" autoComplete="current-password" required placeholder="Masukkan kata sandi" /></div>
              <SubmitButton pendingLabel="Memeriksa akun...">Masuk</SubmitButton>
            </form>
            <p className="mt-6 text-center text-sm text-[#718078]">Belum punya akun? <Link className="font-black text-[#587e6d] underline decoration-[#c3d8ca] underline-offset-4" href="/register">Daftar sekarang</Link></p>
            <Link href="/" className="login-back-home">Kembali ke halaman utama</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
