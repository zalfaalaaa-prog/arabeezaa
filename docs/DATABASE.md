# Database overview — ARABEEZA

- `profiles`: role, XP, diamonds, hearts, streak, avatar.
- `lessons`: learning units (initially At-Ta‘āruf).
- `vocabulary`: Arabic vocabulary with harakat and Indonesian meanings.
- `dialogues`: short Arabic conversations and translations.
- `questions`: 105 mixed questions for Materi 1 (7 levels × 15 questions), plus focused practice modes.
- `lesson_progress`: session count and best score per lesson.
- `quiz_attempts`: score and reward history.
- `teacher_notes`: teacher feedback attached to a student and lesson.

The SQL migrations enable Row Level Security (RLS) and add `record_quiz_result`, `buy_hearts`, `update_my_avatar`, `update_my_avatar_v2`, and `consume_heart` RPC functions.

Run migrations in order:
1. `001_init.sql`
2. `002_arabeeza_revision.sql`
3. `seed.sql` (initial content)
4. `003_materi1_105_questions_and_lives.sql` (105-question bank and persistent heart deduction)

For an existing project, do not recreate the database. Run only migration `003_materi1_105_questions_and_lives.sql` after the earlier migrations and seed are already present.
