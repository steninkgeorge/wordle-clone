'use server';

import {
  getTransactions,
  initializeCoins,
  updateTransaction,
} from './start-coins-supabase';

export const initTransaction = async (
  userId: string,
  firstTimeReward: number
) => {
  await initializeCoins(firstTimeReward, userId);
};

export const getTransactionData = async (userId: string) => {
  const coins = await getTransactions(userId);
  return coins;
};

//update coins
export const updateTransactionData = async (amount: number, userId: string) => {
  const coins = await updateTransaction(amount, userId);
  return coins;
};
