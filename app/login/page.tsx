import Link from "next/link";
import { login } from "@/app/actions";
import SubmitButton from "@/components/SubmitButton";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; registered?: string }> }) {
  const params = await searchParams;
  return (
    <main id="main-content" tabIndex={-1} className="flex min-h-screen items-center justify-center bg-[#f7faf6] px-4 py-10">
      <div className="surface w-full max-w-md p-7 md:p-9">
        <Link href="/" className="text-2xl font-black">arabeeza<span className="text-[#f39a32]">.</span></Link>
        <p className="mt-7 text-xs font-black tracking-[.18em] text-[#2e8b62]">SELAMAT DATANG KEMBALI</p>
        <h1 className="mt-2 text-3xl font-black">Masuk ke Arabeeza</h1>
        <p className="mt-2 text-sm text-[#718078]">Lanjutkan perjalanan belajar Bahasa Arabmu.</p>
        {params.registered && <p role="status" className="mt-5 rounded-xl bg-[#eaf7ef] p-3 text-sm font-bold text-[#2e8b62]">Akun berhasil dibuat. Silakan masuk setelah verifikasi email jika diminta.</p>}
        {params.error && <p role="alert" className="mt-5 rounded-xl bg-[#fff0f0] p-3 text-sm text-[#a33c45]">{params.error}</p>}
        <form action={login} className="mt-6 space-y-4">
          <div><label htmlFor="login-email" className="mb-2 block text-sm font-bold">Email</label><input id="login-email" className="input" type="email" name="email" autoComplete="email" required placeholder="nama@email.com"/></div>
          <div><label htmlFor="login-password" className="mb-2 block text-sm font-bold">Kata sandi</label><input id="login-password" className="input" type="password" name="password" autoComplete="current-password" required placeholder="Masukkan kata sandi"/></div>
          <SubmitButton pendingLabel="Memeriksa akun...">Masuk</SubmitButton>
        </form>
        <p className="mt-6 text-center text-sm text-[#718078]">Belum punya akun? <Link className="font-black text-[#2e8b62]" href="/register">Daftar sekarang</Link></p>
      </div>
    </main>
  );
}
