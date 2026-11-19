"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { updateAvatar } from "@/app/actions";
import CatAvatar, {
  getCatPresetFromAvatar,
  getCatPresetValues,
  type CatAvatarPreset
} from "@/components/CatAvatar";

const catOptions: CatAvatarPreset[] = [
  "moka", "luna", "cici", "nala", "mimi", "oyen", "bimo", "leo", "kiko", "raka"
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
  const [g, setG] = useState(gender);
  const [h] = useState(hair);
  const [v] = useState(hijab);
  const [e, setE] = useState(expression);

  function choosePreset(next: CatAvatarPreset) {
    const values = getCatPresetValues(next);
    setPreset(next);
    setS(values.skin);
    setO(values.outfit);
    setE(values.expression);
    setG(values.gender);
  }

  return (
    <form action={updateAvatar} className="surface avatar-editor p-5 md:p-6">
      <div className="avatar-preview-panel mb-5 rounded-[24px] p-5 text-center">
        <CatAvatar key={preset} preset={preset} size={160} className="mx-auto cat-avatar-preview avatar-preview-pop" />
        <p className="mt-2 text-xs font-black tracking-[.14em] text-[#348f68]">KARAKTER PILIHANMU</p>
        <p className="mt-1 text-sm font-bold text-[#536b5e]">Siap menemanimu belajar!</p>
      </div>

      <div>
        <div className="mb-3">
          <p className="text-sm font-black">Pilih teman belajarmu</p>
          <p className="mt-1 text-xs leading-5 text-[#6f8177]">Pilih kucing dengan warna bulu, ekspresi, dan aksesori yang paling kamu suka.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {catOptions.map((item, index) => {
            const selected = preset === item;
            return (
              <button
                type="button"
                key={item}
                onClick={() => choosePreset(item)}
                className={`cat-choice-card relative rounded-2xl border-2 p-3 text-center transition ${selected ? "selected avatar-choice-pop" : ""}`}
                aria-label={`Pilih karakter kucing ${index + 1}`}
                aria-pressed={selected}
                title={`Pilih karakter kucing ${index + 1}`}
              >
                {selected && (
                  <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#329a6a] text-white shadow-sm">
                    <Check size={14} strokeWidth={3} />
                  </span>
                )}
                <CatAvatar preset={item} size={96} className="mx-auto" />
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
