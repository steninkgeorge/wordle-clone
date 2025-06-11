import { GameStatus } from '@prisma/client';

export const isSameDay = (dbDate: Date) => {
  // Create Date objects (handles UTC conversion automatically)
  const inputDate = new Date(dbDate);
  const today = new Date();
  console.log(inputDate, today);
  // Compare date components directly
  return (
    inputDate.getFullYear() === today.getFullYear() &&
    inputDate.getMonth() === today.getMonth() &&
    inputDate.getDate() === today.getDate()
  );
};

export const isStreakBroken = (date: Date, status: GameStatus) => {
  // 1. Get yesterday's date (local time)
  console.log('status', status);

  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  console.log('date , yesterday , status', date, yesterday, status);
  if (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate() &&
    (status === GameStatus.won || status === GameStatus.lost)
  ) {
    console.log('Streak is not broken');
    return false;
  }
  console.log('Streak is broken');
  return true;
};
