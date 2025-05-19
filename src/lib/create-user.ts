import prismadb from "../../lib/prismadb";
import { GameStatus } from "@prisma/client";

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
    throw Error("error " + error);
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
    throw Error("error " + error);
  }
};

export const updateGuess = async (
  userId: string,
  guesses: string[],
  currentLine: number,
) => {
  if (userId === null) {
    throw Error("error userId is null");
  }

  try {
    await prismadb.dailyGuesses.update({
      where: {
        userId: userId,
      },

      data: {
        guesses: guesses, // Updates the entire guesses array
        currentLine: currentLine, // Updates the current line number
      },
      include: {
        user: true, // Optional: includes the related user in the response
      },
    });
  } catch (error) {
    throw Error("error " + error);
  }
};

export const updateStats= async(userId : string, wonGame: boolean)=>{
  try
{ 
  await prismadb.gameStats.update({
    where: {
      userId,
    },
    data: {
      gamesPlayed: { increment: 1 }, // Always increment by 1
      gamesWon: wonGame ? { increment: 1 } : undefined, // Conditional increment
      currentStreak: wonGame ? { increment: 1 } : { set: 0 }, // Reset streak if lost
      maxStreak: {
        // Update maxStreak only if currentStreak (after increment) exceeds it
        increment: wonGame ? 1 : 0,
      },
      lastPlayedDate: new Date(),
      hasPlayedToday: true,
    },
  });

}catch(error){
      throw Error("error " + error);

}
}

export const updateGameStatus=async( userId: string, status: string)=>{
   try {
     await prismadb.dailyGuesses.update({
       where: {
         userId: userId,
       },

       data: {

         gameStatus: (status as GameStatus) ?? "playing",
       },
       include: {
         user: true, // Optional: includes the related user in the response
       },
     });
   } catch (error) {
     throw Error("error " + error);
   }
}
