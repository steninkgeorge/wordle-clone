/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "TransactionType" ADD VALUE 'FIRST_TIME';

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "amount" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_userId_key" ON "Transaction"("userId");
