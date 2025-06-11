import { isSameDay } from '@/app/constants/isSameDay';
import prismadb from '../../lib/prismadb';
import { GameStatus, InventoryType, TransactionType } from '@prisma/client';

export const createUser = async () => {
  try {
    const user = await prismadb.user.create({
      data: {
        isGuest: true,
      },
    });
    return user;
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const createStats = async (userId: string) => {
  try {
    const stats = await prismadb.gameStats.create({
      data: {
        userId: userId,
      },
    });
    return stats;
  } catch (error) {
    throw Error('error ' + error);
  }
};

export const createGuess = async (userId: string) => {
  try {
    const guess = await prismadb.dailyGuesses.create({
      data: {
        userId: userId,
      },
    });
    return guess;
  } catch (error) {
    throw Error('error ' + error);
  }
};

export const updateGuess = async (
  userId: string,
  guesses: string[],
  currentLine: number
) => {
  if (userId === null) {
    throw Error('error userId is null');
  }

  try {
    await prismadb.dailyGuesses.update({
      where: {
        userId: userId,
      },

      data: {
        guesses: guesses, // Updates the entire guesses array
        currentLine: currentLine, // Updates the current line number
        gameStatus: 'playing',
      },
    });
  } catch (error) {
    throw Error('error ' + error);
  }
};

export const updateStats = async (userId: string, wonGame: boolean) => {
  try {
    let guard = false;
    const stats = await prismadb.gameStats.findUnique({
      where: { userId },
    });

    const inventoryItem = await prismadb.inventory.findUnique({
      where: {
        userId_type: { userId, type: 'STREAK_GUARD' },
      },
      select: {
        lastUsedDate: true,
      },
    });

    if (inventoryItem && inventoryItem.lastUsedDate) {
      const IsSameDay = isSameDay(inventoryItem.lastUsedDate);
      if (IsSameDay) {
        guard = true;
      }
    }

    if (!stats) throw new Error('User stats not found');
    const updatedCurrentStreak = wonGame
      ? stats.currentStreak + 1
      : guard
        ? stats.currentStreak
        : 0;
    const shouldUpdateMaxStreak = updatedCurrentStreak > stats.maxStreak;

    await prismadb.gameStats.update({
      where: {
        userId,
      },
      data: {
        gamesPlayed: { increment: 1 }, // Always increment by 1
        gamesWon: wonGame ? { increment: 1 } : undefined, // Conditional increment
        currentStreak: wonGame
          ? { increment: 1 }
          : guard
            ? undefined
            : { set: 0 },

        maxStreak: shouldUpdateMaxStreak
          ? { set: updatedCurrentStreak }
          : undefined,
        hasPlayedToday: true,
        previousStreak: { set: updatedCurrentStreak },
      },
    });
  } catch (error) {
    throw Error('error ' + error);
  }
};

export const resetStats = async (userId: string) => {
  try {
    const stats = await prismadb.gameStats.findUnique({
      where: { userId },
    });

    if (!stats) {
      return { success: false, message: 'User stats not found' };
    }

    await prismadb.gameStats.update({
      where: {
        userId,
      },
      data: {
        currentStreak: { set: 0 },
      },
    });

    //TODO : add funny returning messages based on the time gap the user has took
    return { success: true, message: 'Hey welcome back 🤩' };
  } catch (error) {
    return { success: false, message: 'error:' + error };
  }
};

export const updateGameStatus = async (userId: string, status: string) => {
  try {
    await prismadb.dailyGuesses.update({
      where: {
        userId: userId,
      },

      data: {
        gameStatus: (status as GameStatus) ?? 'playing',
      },
      include: {
        user: true, // Optional: includes the related user in the response
      },
    });
  } catch (error) {
    throw Error('error ' + error);
  }
};

export const getInventoryItems = async (userId: string) => {
  try {
    const res = await prismadb.inventory.findMany({
      where: { userId: userId },
      select: { type: true, quantity: true },
    });
    return res;
  } catch (error) {
    throw Error('error ' + error);
  }
};

export const getShopItems = async () => {
  try {
    const items = await prismadb.shop.findMany({
      select: {
        name: true,
        description: true,
        inventoryType: true,
        price: true,
      },
    });
    return {
      success: true,
      items: items,
      message: 'items fetched successfully',
    };
  } catch (error) {
    return { success: false, items: [], message: 'error' + error };
  }
};

export const BuyItemFromShop = async (
  userId: string,
  itemType: InventoryType,
  amount: number
) => {
  try {
    const item = await prismadb.inventory.findUnique({
      where: { userId_type: { userId, type: itemType } },
      select: { quantity: true },
    });
    if (item && item.quantity >= 5) {
      return {
        success: false,
        message: 'You can only own 5 of these magical item',
      };
    }
    if (item) {
      await prismadb.inventory
        .update({
          where: { userId_type: { userId, type: itemType } },
          data: { quantity: { increment: 1 }, lastPurchaseDate: new Date() },
        })
        .then(async () => {
          await prismadb.transaction.update({
            where: { userId: userId },
            data: {
              amount: { decrement: amount },
              type: TransactionType.SHOP_ITEM,
            },
          });
        });
    } else {
      await prismadb.inventory
        .create({
          data: {
            userId: userId,
            type: itemType,
            quantity: 1,
            lastPurchaseDate: new Date(),
          },
        })
        .then(async () => {
          await prismadb.transaction.update({
            where: { userId: userId },
            data: {
              amount: { decrement: amount },
              type: TransactionType.SHOP_ITEM,
            },
          });
        });
    }

    return { success: true, message: 'Item added to inventory.' };
  } catch (error) {
    return { success: false, message: 'error' + error };
  }
};

export const LimitedBuyItemFromShop = async (
  userId: string,
  itemType: InventoryType
) => {
  try {
    await prismadb.inventory.create({
      data: {
        userId: userId,
        type: itemType,
        quantity: 1,
        lastPurchaseDate: new Date(),
      },
    });
    return { success: true, message: 'Item added to inventory.' };
  } catch (error) {
    return { success: false, message: 'error' + error };
  }
};
