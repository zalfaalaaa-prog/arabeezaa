import { redirect } from "next/navigation";
import { Gem, Heart, ShoppingBag } from "lucide-react";
import AppShell from "@/components/AppShell";
import { buyHeartsFromShop, buyHeartsWithXpFromShop } from "@/app/actions";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";


export default async function ShopPage({ searchParams }: { searchParams: Promise<{ success?: string; error?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  await supabase.rpc("refresh_daily_hearts");
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const p = profile || { role: "student", streak_count: 0, diamonds: 0, hearts: 5, xp: 0 };

  return (
    <AppShell active="/shop" role={p.role} stats={{ streak: p.streak_count, diamonds: p.diamonds, hearts: p.hearts }}>
      <div className="mb-6"><p className="text-xs font-black tracking-[.16em] text-[#2e8b62]">ARABEEZA STORE</p><h1 className="mt-1 text-3xl font-black">Toko hadiah</h1><p className="mt-2 text-sm text-[#718078]">Pulihkan nyawa menggunakan berlian atau XP yang sudah kamu kumpulkan.</p></div>
      {params.success && <p className="mb-4 rounded-xl bg-[#eaf7ef] p-3 text-sm font-bold text-[#2e8b62]">{params.success === "xp" ? "Nyawa berhasil diisi menggunakan XP." : "Nyawa berhasil diisi menggunakan berlian."}</p>}
      {params.error && <p className="mb-4 rounded-xl bg-[#fff0f0] p-3 text-sm text-[#a33c45]">{params.error}</p>}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <article className="surface p-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff0f0] text-[#f06b75]"><Heart size={30} fill="currentColor"/></div>
          <h2 className="mt-4 text-xl font-black">Isi ulang 5 nyawa</h2>
          <p className="mt-2 text-sm leading-6 text-[#718078]">Gunakan berlian untuk memulihkan energi belajar hingga lima nyawa.</p>
          <div className="my-5 flex items-center gap-2 text-lg font-black text-sky-600"><Gem size={21}/>25 berlian</div>
          <form action={buyHeartsFromShop}><button className="btn-primary w-full" type="submit" disabled={p.hearts >= 5 || p.diamonds < 25}>{p.hearts >= 5 ? "Nyawa sudah penuh" : p.diamonds < 25 ? "Berlian belum cukup" : "Tukar 25 berlian"}</button></form>
        </article>
        <article className="surface p-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f1e1e4] text-[#762b40]"><ShoppingBag size={28}/></div>
          <h2 className="mt-4 text-xl font-black">Isi ulang dengan XP</h2>
          <p className="mt-2 text-sm leading-6 text-[#718078]">Tukarkan XP yang kamu kumpulkan untuk mengisi kembali hingga lima nyawa.</p>
          <div className="my-5 flex items-center gap-2 text-lg font-black text-[#b18a43]">✦ 100 XP</div>
          <form action={buyHeartsWithXpFromShop}><button className="btn-primary w-full" type="submit" disabled={p.hearts >= 5 || p.xp < 100}>{p.hearts >= 5 ? "Nyawa sudah penuh" : p.xp < 100 ? "XP belum cukup" : "Tukar 100 XP"}</button></form>
        </article>
        <article className="surface flex flex-col justify-between bg-[#fcf8f4] p-6">
          <div><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#b18a43]"><Gem size={28}/></div><h2 className="mt-4 text-xl font-black">Saldo hadiahmu</h2><p className="mt-2 text-sm leading-6 text-[#806f73]">Kumpulkan XP dan berlian dengan menyelesaikan latihan. Pilih hadiah sesuai saldo yang tersedia.</p></div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white p-4"><p className="text-xs font-bold text-[#806f73]">BERLIAN</p><p className="mt-1 flex items-center gap-2 text-2xl font-black text-sky-600"><Gem size={21}/>{p.diamonds}</p></div>
            <div className="rounded-2xl bg-white p-4"><p className="text-xs font-bold text-[#806f73]">XP</p><p className="mt-1 text-2xl font-black text-[#b18a43]">✦ {p.xp}</p></div>
          </div>
        </article>
      </div>
    </AppShell>
  );
}
