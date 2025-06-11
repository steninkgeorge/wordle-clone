import prismadb from '../../lib/prismadb';

/* 
     creates intial transatcion with joining rewards  
*/
export const initializeCoins = async (
  firstTimeReward: number,
  userId: string
) => {
  try {
    await prismadb.transaction.create({
      data: {
        userId: userId,
        amount: firstTimeReward,
        type: 'FIRST_TIME',
      },
    });
  } catch (error) {
    throw new Error(`${error}`);
  }
};

/* 
     updates transatcion amount field  
*/

export const updateTransaction = async (amount: number, userId: string) => {
  try {
    await prismadb.transaction.update({
      where: {
        userId: userId,
      },
      data: {
        amount: { increment: amount },
        type: 'DAILY_LOGIN',
        createdAt: new Date(),
      },
    });
    return amount;
  } catch (error) {
    throw new Error(`${error}`);
  }
};
/* 
     get transaction for a given userId
    
*/

export const getTransactions = async (userId: string) => {
  try {
    const tr = await prismadb.transaction.findUnique({
      where: {
        userId: userId,
      },
    });
    if (!tr) {
      throw new Error('no data fetched');
    }
    return tr.amount;
  } catch (error) {
    throw new Error(`${error}`);
  }
};
