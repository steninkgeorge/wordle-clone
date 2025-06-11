import { InventoryType } from '@prisma/client';

export const ItemToDisplay: Record<
  InventoryType,
  { name: string; bg: string; img: string; text: string }
> = {
  EXTRA_GUESS: {
    name: 'Magical Guess',
    img: '/Magical Feather.png',
    bg: ' bg-gradient-to-br from-blue-200 to-blue-500 dark:from-blue-800 dark:to-blue-600',
    text: 'text-purple-800 dark:text-purple-300',
  },
  LETTER_REVEAL: {
    name: 'Letter Reveal',
    img: '/Magical Wand.png',
    bg: 'bg-gradient-to-br from-fuchsia-200 via-purple-300 to-indigo-300 dark:from-purple-800 dark:via-purple-900 dark:to-indigo-900',
    text: 'text-purple-800 dark:text-purple-200',
  },
  STREAK_SAVER: {
    name: 'Streak Saver',
    img: '/StreakSaver.png',
    bg: 'bg-gradient-to-br from-pink-200 via-orange-200 to-yellow-100 dark:from-pink-700 dark:via-rose-800 dark:to-amber-900',
    text: 'text-purple-800 dark:text-purple-200',
  },
  STREAK_GUARD: {
    name: 'Streak Guardian',
    img: '/StreakGuardian.png',
    bg: 'bg-gradient-to-br from-blue-100 via-yellow-200 to-amber-100 dark:from-blue-800 dark:via-indigo-700 dark:to-yellow-600',
    text: 'text-purple-800 dark:text-purple-200',
  },
};
