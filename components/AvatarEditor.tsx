"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { updateAvatar } from "@/app/actions";
import CatAvatar, {
  getCatPresetFromAvatar,
  getCatPresetValues,
  type CatAvatarPreset
} from "@/components/CatAvatar";

const catOptions: Array<{ value: CatAvatarPreset; name: string; note: string }> = [
  { value: "moka", name: "Moka", note: "Pita kecil · ramah" },
  { value: "luna", name: "Luna", note: "Kacamata · ceria" },
  { value: "cici", name: "Cici", note: "Topi biru · aktif" },
  { value: "nala", name: "Nala", note: "Bunga · kalem" },
  { value: "mimi", name: "Mimi", note: "Syal pink · manis" },
  { value: "oyen", name: "Oyen", note: "Lonceng · playful" }
];

export default function AvatarEditor({
  skin,
  outfit,
  gender = "perempuan",
  hair = "panjang",
  hijab = "tidak",
  expression = "senyum"
}: {
  skin: string;
  outfit: string;
  gender?: string;
  hair?: string;
  hijab?: string;
  expression?: string;
}) {
  const initialPreset = useMemo(
    () => getCatPresetFromAvatar(skin, outfit, expression),
    [skin, outfit, expression]
  );
  const [preset, setPreset] = useState<CatAvatarPreset>(initialPreset);
  const [s, setS] = useState(skin);
  const [o, setO] = useState(outfit);
  const [g] = useState(gender);
  const [h] = useState(hair);
  const [v] = useState(hijab);
  const [e, setE] = useState(expression);

  function choosePreset(next: CatAvatarPreset) {
    const values = getCatPresetValues(next);
    setPreset(next);
    setS(values.skin);
    setO(values.outfit);
    setE(values.expression);
  }

  return (
    <form action={updateAvatar} className="surface p-5 md:p-6">
      <div className="mb-5 rounded-[24px] bg-[#f7faf6] p-5 text-center">
        <CatAvatar preset={preset} size={160} className="mx-auto cat-avatar-preview" />
        <p className="mt-2 text-xs font-black tracking-[.14em] text-[#7e9d7b]">KARAKTER ARABEEZA</p>
        <h3 className="mt-1 text-xl font-black">{catOptions.find((item) => item.value === preset)?.name}</h3>
        <p className="mt-1 text-sm text-[#718078]">{catOptions.find((item) => item.value === preset)?.note}</p>
      </div>

      <div>
        <div className="mb-3">
          <p className="text-sm font-black">Pilih teman belajarmu</p>
          <p className="mt-1 text-xs leading-5 text-[#89968f]">Semua karakter memakai gaya kucing Arabeeza, tetapi warna, ekspresi, dan aksesorinya berbeda.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {catOptions.map((item) => {
            const selected = preset === item.value;
            return (
              <button
                type="button"
                key={item.value}
                onClick={() => choosePreset(item.value)}
                className={`relative rounded-2xl border-2 p-3 text-center transition ${
                  selected
                    ? "border-[#7e9d7b] bg-[#edf4e8] shadow-sm"
                    : "border-[#e7eee8] bg-white hover:-translate-y-0.5 hover:border-[#b9cdb6]"
                }`}
                aria-pressed={selected}
              >
                {selected && (
                  <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#7e9d7b] text-white">
                    <Check size={14} strokeWidth={3} />
                  </span>
                )}
                <CatAvatar preset={item.value} size={88} className="mx-auto" />
                <p className="mt-1 text-sm font-black">{item.name}</p>
                <p className="mt-0.5 text-[10px] font-semibold text-[#89968f]">{item.note}</p>
              </button>
            );
          })}
        </div>
      </div>

      <input type="hidden" name="avatar_skin" value={s} />
      <input type="hidden" name="avatar_outfit" value={o} />
      <input type="hidden" name="avatar_gender" value={g} />
      <input type="hidden" name="avatar_hair" value={h} />
      <input type="hidden" name="avatar_hijab" value={v} />
      <input type="hidden" name="avatar_expression" value={e} />

      <button type="submit" className="btn-primary mt-6 w-full">Simpan karakter</button>
    </form>
  );
}
