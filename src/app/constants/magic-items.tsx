import { InventoryType } from '@prisma/client';

export const ItemToDisplay: Record<
  InventoryType,
  { name: string; bg: string; img: string; text: string }
> = {
  EXTRA_GUESS: {
    name: 'Magical Guess',
    img: '/Magical Feather.png',
    bg: 'bg-purple-100 dark:bg-purple-900',
    text: 'text-purple-800 dark:text-purple-300',
  },
  LETTER_REVEAL: {
    name: 'Letter Reveal',
    img: '/Magical Wand.png',
    bg: 'bg-gradient-to-br from-fuchsia-200 via-purple-300 to-indigo-300 dark:from-purple-800 dark:via-purple-900 dark:to-indigo-900',
    text: 'text-purple-800 dark:text-purple-200',
  },
};
