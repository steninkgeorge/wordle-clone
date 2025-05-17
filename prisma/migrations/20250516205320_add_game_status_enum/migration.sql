-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('playing', 'won', 'lost', 'paused');

-- AlterTable
ALTER TABLE "DailyGuesses" ADD COLUMN     "gameStatus" "GameStatus" NOT NULL DEFAULT 'playing';
