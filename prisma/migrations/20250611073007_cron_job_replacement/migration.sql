/*
  Warnings:

  - Made the column `lastPlayedDate` on table `GameStats` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastPurchaseDate` on table `Inventory` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "InventoryType" ADD VALUE 'STREAK_SAVER';
ALTER TYPE "InventoryType" ADD VALUE 'STREAK_GUARD';

-- AlterEnum
ALTER TYPE "TransactionType" ADD VALUE 'SHOP_ITEM';

-- AlterTable
ALTER TABLE "DailyGuesses" ALTER COLUMN "date" DROP DEFAULT,
ALTER COLUMN "date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "GameStats" ADD COLUMN "previousStreak" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "lastPlayedDate" SET DEFAULT NOW(),
ALTER COLUMN "lastPlayedDate" SET NOT NULL;

-- AlterTable
ALTER TABLE "Inventory" 
ALTER COLUMN "lastPurchaseDate" SET DEFAULT NOW(),
ALTER COLUMN "lastPurchaseDate" SET NOT NULL;

