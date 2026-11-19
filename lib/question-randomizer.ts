import type { Question } from "@/lib/types";
import { normalizeArabic } from "@/lib/utils";

/** Mengacak urutan pilihan jawaban pada setiap soal untuk setiap sesi. */
function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }
  return result;
}

export function randomizeQuestionOptions(questions: Question[]): Question[] {
  return questions.map((question) => {
    const options = Array.isArray(question.options) ? question.options : [];
    if (options.length < 2) return { ...question, options: [...options] };

    const correctIndex = options.findIndex(
      (option) => normalizeArabic(option) === normalizeArabic(question.correct_answer)
    );

    // Jika data soal tidak menemukan jawaban benar di opsi, tetap acak opsinya
    // tanpa mengubah isi atau kunci jawaban yang tersimpan di database.
    if (correctIndex < 0) return { ...question, options: shuffle(options) };

    const correctOption = options[correctIndex];
    const distractors = shuffle(options.filter((_, index) => index !== correctIndex));
    const randomizedOptions = [...distractors];
    const targetPosition = Math.floor(Math.random() * options.length);
    randomizedOptions.splice(targetPosition, 0, correctOption);

    return { ...question, options: randomizedOptions };
  });
}
