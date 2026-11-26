/**
 * Nama tokoh tetap ditulis dengan ejaan Arab yang benar pada materi.
 * Untuk audio dialog, akhiran i'rab pada nama dinetralkan agar pembacaan
 * mengikuti panggilan nama yang lazim dipakai siswa Indonesia.
 */
export function normalizeDialogueNamesForSpeech(text: string): string {
  return text
    // Faris dibaca tanpa akhiran tanwin atau vokal kasus.
    .replace(/فَارِس(?:ٌ|ُ|َ|ِ|ْ)?/gu, "فَارِسْ")
    .replace(/فارس(?:ٌ|ُ|َ|ِ|ْ)?/gu, "فَارِسْ")
    // Nadia memakai bunyi akhir "a", bukan ta marbuthah yang tersambung.
    .replace(/نَادِيَة(?:ٌ|ُ|َ|ِ|ْ)?/gu, "نَادِيَا")
    .replace(/نادية(?:ٌ|ُ|َ|ِ|ْ)?/gu, "نَادِيَا")
    // Hana diucapkan sebagai nama Indonesia, tanpa bunyi hamzah/akhiran u.
    .replace(/هَنَاء(?:ٌ|ُ|َ|ِ|ْ)?/gu, "هَنَا")
    .replace(/هناء(?:ٌ|ُ|َ|ِ|ْ)?/gu, "هَنَا");
}
