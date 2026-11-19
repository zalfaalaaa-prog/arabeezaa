import type { ImageChoiceOption, Question, QuestionOption } from "@/lib/types";
import { normalizeArabic } from "@/lib/utils";

/** Mengacak urutan pilihan tanpa mengubah kunci jawaban yang tersimpan. */
function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }
  return result;
}

function optionAnswerText(option: QuestionOption): string {
  if (typeof option === "string") return option;
  if ("label" in option) return (option as ImageChoiceOption).label;
  return "";
}

export function randomizeQuestionOptions(questions: Question[]): Question[] {
  return questions.map((question) => {
    const options = Array.isArray(question.options) ? question.options : [];
    if (options.length < 2) return { ...question, options: [...options] };

    // Bank pasangan dijadikan acak dari sisi kiri; sisi kanan diacak lagi di browser.
    if (question.question_type === "matching_pairs") {
      return { ...question, options: shuffle(options) };
    }

    const correctIndex = options.findIndex(
      (option) => normalizeArabic(optionAnswerText(option)) === normalizeArabic(question.correct_answer)
    );

    // Word bank tidak memuat jawaban sebagai satu opsi; seluruh keping kata diacak.
    if (correctIndex < 0) return { ...question, options: shuffle(options) };

    const correctOption = options[correctIndex];
    const distractors = shuffle(options.filter((_, index) => index !== correctIndex));
    const randomizedOptions = [...distractors];
    const targetPosition = Math.floor(Math.random() * options.length);
    randomizedOptions.splice(targetPosition, 0, correctOption);

    return { ...question, options: randomizedOptions };
  });
}
