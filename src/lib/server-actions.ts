//TODO: make all server actions shown through toast

'use server';

import {
  BuyItemFromShop,
  createGuess,
  createStats,
  createUser,
  getInventoryItems,
  getShopItems,
  updateGameStatus,
  updateGuess,
  updateStats,
} from '@/lib/supabase-actions';
import prismadb from '../../lib/prismadb';
import { InventoryType } from '@prisma/client';
import { AllowExtraGuess } from './magical-items-supabase-actions';

export async function getUserStats(userId: string) {
  try {
    const stats = await prismadb.gameStats.findUnique({
      where: { userId: userId },
    });

    return stats;
  } catch (error) {
    throw new Error(`${error}`);
  }
}

export async function getGuessData(userId: string) {
  try {
    const guess = await prismadb.dailyGuesses.findUnique({
      where: { userId: userId },
    });
    return guess;
  } catch (error) {
    throw new Error(`${error}`);
  }
}

export const CreateUser = async () => {
  const user = await createUser();
  return user;
};

export const getStats = async (userId: string) => {
  const stats = await getUserStats(userId);
  return stats;
};

export const getGameData = async (userId: string) => {
  const gameData = await getGuessData(userId);
  return gameData;
};

export const postStats = async (userId: string) => {
  const stats = await createStats(userId);
  return stats;
};

export const postGuess = async (userId: string) => {
  const guess = await createGuess(userId);
  return guess;
};

export const updateguess = async (
  userId: string,
  guess: string[],
  currentLine: number
) => {
  await updateGuess(userId, guess, currentLine);
};

export const updatestats = async (userId: string, wonGame: boolean) => {
  await updateStats(userId, wonGame);
};

export const updateStatus = async (userId: string, status: string) => {
  await updateGameStatus(userId, status);
};

export const getInventoryItem = async (userId: string) => {
  const res = await getInventoryItems(userId);
  return res;
};

export const UseMagicalGuessItem = async (userId: string, quantity: number) => {
  const res = await AllowExtraGuess(userId, quantity);
  return res;
};

export const loadFromShop = async () => {
  const res = await getShopItems();
  return res;
};

export const buyItemFromShop = async (
  userId: string,
  itemType: InventoryType,
  amount: number
) => {
  const res = await BuyItemFromShop(userId, itemType, amount);
  return res;
};
