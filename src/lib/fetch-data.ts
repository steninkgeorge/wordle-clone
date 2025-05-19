"use server";
import {
  createGuess,
  createStats,
  createUser,
  updateGameStatus,
  updateGuess,
  updateStats,
} from "@/lib/create-user";
import prismadb from "../../lib/prismadb";

export async function getUserStats(userId: string) {
  try {
    const user = await prismadb.user.findUnique({
      where: { id: userId },
      include: {
        dailyGuesses: true,
      },
    });

    return user;
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
  const user = await getUserStats(userId);
  return user;
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
