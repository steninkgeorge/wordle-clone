-- AlterTable
ALTER TABLE "DailyGuesses" ALTER COLUMN "guesses" SET DEFAULT ARRAY['', '', '', '', '', '']::TEXT[];
