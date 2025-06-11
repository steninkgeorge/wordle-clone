import { isSameDay } from '@/app/constants/isSameDay';
import prismadb from '../../lib/prismadb';
import { DateTime } from 'luxon';

//TODO: also make a check that its not used twice, it can only be used once per day!

export const AllowExtraGuess = async (userId: string, quantity: number) => {
  let success = false;
  try {
    // First get the current daily guesses to preserve existing data
    const dailyGuesses = await prismadb.dailyGuesses.findUnique({
      where: { userId },
    });

    if (!dailyGuesses) {
      return {
        success: false,
        guesses: [],
        message: 'No daily guesses found for user.',
      };
    }

    if (
      dailyGuesses &&
      (dailyGuesses.gameStatus === 'won' || dailyGuesses.gameStatus === 'lost')
    ) {
      return {
        success: false,
        guesses: [],
        message: 'Game already finished for today.',
      };
    }

    // Add an empty string to the guesses array for the extra guess
    const updatedGuesses = [...dailyGuesses.guesses, ''];

    // Update the daily guesses with the extended array
    const inventoryItem = await prismadb.inventory.findUnique({
      where: {
        userId_type: {
          userId,
          type: 'EXTRA_GUESS',
        },
      },
      select: {
        lastUsedDate: true,
      },
    });

    if (inventoryItem && inventoryItem.lastUsedDate) {
      const IsSameDay = isSameDay(inventoryItem.lastUsedDate);
      if (IsSameDay) {
        return {
          success: false,
          guesses: [],
          message: 'cannot use extra guess twice a day!',
        };
      }
    }

    await prismadb.$transaction([
      prismadb.dailyGuesses.update({
        where: { userId },
        data: {
          guesses: updatedGuesses,
        },
      }),
      quantity === 1
        ? prismadb.inventory.delete({
            where: {
              userId_type: {
                userId,
                type: 'EXTRA_GUESS',
              },
            },
          })
        : prismadb.inventory.update({
            where: {
              userId_type: {
                userId,
                type: 'EXTRA_GUESS',
              },
            },
            data: {
              quantity: {
                decrement: 1,
              },
              lastUsedDate: new Date(),
            },
          }),
    ]);

    success = true;
    return {
      success: success,
      guesses: updatedGuesses,
      message: 'Extra guess activated',
    };
  } catch (error) {
    return { success: false, guesses: [], message: `${error}` };
  }
};

/*
streak saver
 - override the currentStreak value with the previous streak value from game stats.
*/

export const StreakSaver = async (userId: string) => {
  try {
    const gameStats = await prismadb.gameStats.findUnique({
      where: { userId: userId },
      select: {
        currentStreak: true,
        previousStreak: true,
      },
    });

    if (!gameStats) {
      return { success: false, message: 'No game stats found for user.' };
    }

    if (gameStats.previousStreak === 0) {
      return { success: false, message: 'You had no streak to restore.' };
    }

    if (gameStats.currentStreak === gameStats.previousStreak) {
      return {
        success: false,
        message:
          'Your current streak is already the same as your previous streak',
      };
    }

    const inventoryItem = await prismadb.inventory.findUnique({
      where: {
        userId_type: {
          userId,
          type: 'STREAK_SAVER',
        },
      },
      select: {
        quantity: true,
      },
    });

    if (!inventoryItem) {
      return {
        success: false,
        message: 'No streak saver item found in inventory.',
      };
    }

    await prismadb.$transaction([
      prismadb.gameStats.update({
        where: { userId: userId },
        data: {
          currentStreak: gameStats.previousStreak,
        },
      }),
      inventoryItem?.quantity === 1
        ? prismadb.inventory.delete({
            where: {
              userId_type: {
                userId,
                type: 'STREAK_SAVER',
              },
            },
          })
        : prismadb.inventory.update({
            where: {
              userId_type: {
                userId,
                type: 'STREAK_SAVER',
              },
            },
            data: {
              quantity: {
                decrement: 1,
              },
              lastUsedDate: new Date(),
            },
          }),
    ]);

    return { success: true, message: 'Your streak is restored' };
  } catch (error) {
    return { success: false, message: `${error}` };
  }
};

/*
Streak Guard

  - guards the user's streak even if they lose the game
  - can only be used once 
*/

export const StreakGuard = async (userId: string, timeZone: string) => {
  try {
    //check if the user has already used it for today
    const inventoryItem = await prismadb.inventory.findUnique({
      where: {
        userId_type: {
          userId,
          type: 'STREAK_GUARD',
        },
      },
      select: {
        lastUsedDate: true,
        quantity: true,
      },
    });

    if (!inventoryItem || !inventoryItem.lastUsedDate) {
      return {
        success: false,
        message: 'No streak guard item found in inventory.',
      };
    }

    const dbDateLocal = DateTime.fromJSDate(inventoryItem.lastUsedDate, {
      zone: 'utc',
    }).setZone(timeZone);
    const nowLocal = DateTime.now().setZone(timeZone);
    const isSameDay =
      dbDateLocal.year === nowLocal.year &&
      dbDateLocal.month === nowLocal.month &&
      dbDateLocal.day === nowLocal.day;

    if (isSameDay) {
      return {
        success: false,
        message: 'You have already used the streak guard for today.',
      };
    }

    //deduct the quantity and update the time
    await prismadb.$transaction([
      prismadb.inventory.update({
        where: {
          userId_type: {
            userId,
            type: 'STREAK_GUARD',
          },
        },
        data: {
          quantity: {
            decrement: 1,
          },
          lastUsedDate: new Date(),
        },
      }),
    ]);

    return { success: true, message: 'Your streak is guarded for today!' };
  } catch (error) {
    return { success: false, message: `${error}` };
  }
};
