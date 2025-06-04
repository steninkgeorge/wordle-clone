import { create } from 'zustand';

interface GameItemProps {
  coins: number;
  setCoins: (value: number) => Promise<void>;
}

export const useGameItems = create<GameItemProps>((set) => ({
  coins: 0,
  setCoins: async (value) => {
    //send an update to db
    set({ coins: value });
  },
}));
