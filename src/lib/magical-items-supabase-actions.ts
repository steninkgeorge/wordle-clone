import prismadb from '../../lib/prismadb';

//TODO: remove the item from the inventory or reduce the quantity
//TODO: also make a check that its not used twice, it can only be used once per day!

export const AllowExtraGuess = async (userId: string, quantity: number) => {
  let success = false;
  console.log('Allowing extra guess for user');
  try {
    // First get the current daily guesses to preserve existing data
    const dailGuesses = await prismadb.dailyGuesses.findUnique({
      where: { userId },
    });
    if (!dailGuesses) {
      return { success: false, message: 'No daily guesses found for user.' };
    }

    if (
      dailGuesses &&
      (dailGuesses.gameStatus === 'won' || dailGuesses.gameStatus === 'lost')
    ) {
      return { success: false, message: 'Game already finished for today.' };
    }

    // Add an empty string to the guesses array for the extra guess
    const updatedGuesses = [...dailGuesses.guesses, ''];

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
      const lastUsed = new Date(inventoryItem?.lastUsedDate);
      const now = new Date();
      const isSameDay =
        lastUsed.getUTCFullYear() === now.getUTCFullYear() &&
        lastUsed.getUTCMonth() === now.getUTCMonth() &&
        lastUsed.getUTCDate() === now.getUTCDate();
      if (isSameDay) {
        return {
          success: false,
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

    console.log('Extra guess allowed successfully');

    success = true;
    return { success: success, message: 'Extra guess activated' };
  } catch (error) {
    return { success: false, message: `${error}` };
  }
};
