# Database overview — ARABEEZA

- `profiles`: role, XP, diamonds, hearts, streak, avatar.
- `lessons`: learning units (initially At-Ta‘āruf).
- `vocabulary`: Arabic vocabulary with harakat and Indonesian meanings.
- `dialogues`: short Arabic conversations and translations.
- `questions`: 105 mixed questions for Materi 1 (7 levels × 15 questions), plus focused practice modes.
- `lesson_progress`: session count and best score per lesson.
- `quiz_attempts`: score and reward history.
- `teacher_notes`: teacher feedback attached to a student and lesson.

The SQL migrations enable Row Level Security (RLS) and add `record_quiz_result`, `buy_hearts`, `update_my_avatar`, `update_my_avatar_v2`, `consume_heart`, and `refresh_daily_hearts` RPC functions. Daily hearts are reset to 5 when a student first uses the app on a new calendar day in Asia/Jakarta (WIB). While the app remains open, the shared app shell also checks at midnight and refreshes the displayed balance.

Run migrations in order:
1. `001_init.sql`
2. `002_arabeeza_revision.sql`
3. `seed.sql` (initial content)
4. `003_materi1_105_questions_and_lives.sql` (105-question bank and persistent heart deduction)
5. `004_daily_hearts_reset.sql` (daily 00:00 WIB heart reset; answer sound is handled in the web app)

For an existing project that already has migrations 001–003 and the seed, do not recreate the database. Run only migration `004_daily_hearts_reset.sql` in Supabase SQL Editor.
