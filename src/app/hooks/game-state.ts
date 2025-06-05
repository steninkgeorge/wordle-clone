import {
  CreateUser,
  getGameData,
  getInventoryItem,
  postGuess,
  postStats,
  updateguess,
  updateStatus,
} from '@/lib/server-actions';
import { create } from 'zustand';
import { useGameStats } from './gameStats';
import { getTransactionData, initTransaction } from '@/lib/star-coins';
import { FirstTimeReward } from '../constants/word-list';
import { useGameItems } from './game-assets';
import { useInventory } from './inventory-state';
import { showMagicItemToast, showRewardToast } from '@/lib/rewards-toast';
//maybe create an error state as well

interface GameState {
  userId: string | null;
  isInitialized: boolean;
  guesses: string[];
  guessLength: number;
  currentLine: number;
  currentGuess: string;
  gameStatus: 'playing' | 'won' | 'lost' | 'paused';
  setGuesses: (guesses: string[]) => void;
  setGuessLength: (value: number) => void;
  increaseCurrentLine: () => void;
  setCurrentGuess: (guess: string) => void;
  makeGuess: (guess: string) => Promise<void>;
  setGameStatus: (
    status: 'playing' | 'won' | 'lost' | 'paused'
  ) => Promise<void>;
  initializeUser: () => Promise<void>;
  loadGameState: () => Promise<void>;
  setUserId: (userId: string) => void;
}

export const useGameState = create<GameState>((set, get) => ({
  userId: null,
  isInitialized: false,
  guesses: Array(6).fill(''),
  guessLength: 6,
  currentLine: 0,
  currentGuess: '',
  gameStatus: 'playing',
  setGuesses: (guesses) => {
    console.log(guesses);
    set({ guesses: guesses });
  },
  setGuessLength: (value) => {
    set({ guessLength: value });
  },
  setUserId: (userId) => set({ userId }),
  increaseCurrentLine: () => {
    const state = get();
    set({ currentLine: state.currentLine + 1 });
  },
  setCurrentGuess: (guess) => set({ currentGuess: guess }),
  makeGuess: async (guess) => {
    const state = get();
    const newGuesses = [...state.guesses];
    newGuesses[state.currentLine] = guess;
    set({
      guesses: newGuesses,
      currentLine: state.currentLine + 1,
      currentGuess: '',
    });

    //update the db
    updateguess(state.userId!, newGuesses, state.currentLine + 1);
  },
  setGameStatus: async (status) => {
    const state = get();
    set({ gameStatus: status });

    if (status === 'lost' || status === 'won') {
      updateStatus(state.userId!, status);
    }
  },
  initializeUser: async () => {
    try {
      const user = localStorage.getItem('user');
      const gameStats = useGameStats.getState();

      if (user) {
        const parsedUser = JSON.parse(user);

        set({ userId: parsedUser });
        gameStats.setUserId(parsedUser);
        const coins = await getTransactionData(parsedUser);
        useGameItems.getState().setCoins(coins);
        useGameStats.getState().updateGameStat();
        await get().loadGameState();
        const oneTime = localStorage.getItem('oneTime');
        if (!oneTime) {
          setTimeout(() => {
            showMagicItemToast('Magical Feather');
          }, 5000);
          localStorage.setItem('oneTime', 'true');
        }
        return;
      }
      const newUser = await CreateUser();
      if (newUser) {
        localStorage.setItem('user', JSON.stringify(newUser.id));
        postGuess(newUser.id);
        postStats(newUser.id);
        initTransaction(newUser.id, FirstTimeReward).then(() => {
          useGameItems.getState().setCoins(FirstTimeReward);
          showRewardToast();
          setTimeout(() => {
            showMagicItemToast('Magical Feather');
          }, 5000);
        });
        set({ userId: newUser.id });
        gameStats.setUserId(newUser.id);
      }
    } catch (error) {
      throw new Error(`${error}`);
    } finally {
      set({ isInitialized: true });
    }
  },
  loadGameState: async () => {
    const { userId } = get();
    if (!userId) return;
    try {
      const gameData = await getGameData(userId);

      if (gameData) {
        set({
          guesses: gameData.guesses,
          guessLength: gameData.guesses.length,
          currentLine: gameData.currentLine,
          currentGuess: gameData.currentGuess,
          gameStatus: gameData.gameStatus,
        });
      }

      const item = await getInventoryItem(userId);
      if (item) {
        useInventory.getState().addItems(item);
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  },
}));

interface onboardingStateprops {
  open: boolean;
  showChangeLogs: boolean;
  setOpen: (value: boolean) => void;
  SetShowChangeLogs: (value: boolean) => void;
}

export const useOnboardingState = create<onboardingStateprops>((set) => ({
  open: false,
  showChangeLogs: false,
  setOpen: (value) => set({ open: value }),
  SetShowChangeLogs: (value) => set({ showChangeLogs: value }),
}));
