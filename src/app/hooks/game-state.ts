import {
  CreateUser,
  getGameData,
  getInventoryItem,
  limitedbuyItemFromShop,
  postGuess,
  postStats,
  resetUserStats,
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
import { toast } from 'sonner';
import { isSameDay, isStreakBroken } from '../constants/isSameDay';
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

        //init coins
        const coins = await getTransactionData(parsedUser);
        useGameItems.getState().setCoins(coins);

        //stats
        gameStats.setUserId(parsedUser);
        await useGameStats
          .getState()
          .updateGameStat()
          .then(async () => {
            //final loading

            await get().loadGameState();
          });

        //limited
        const oneTime = localStorage.getItem('oneTime');

        //LIMITED
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

          //LIMITED: one week limited buy item
          limitedbuyItemFromShop(newUser.id, 'EXTRA_GUESS').then((res) => {
            if (res.success) {
              useInventory.getState().loadItems();
              setTimeout(() => {
                showMagicItemToast('Magical Feather');
              }, 3000);
            }
          });
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
    const gameStats = useGameStats.getState();

    if (!userId) return;
    try {
      const gameData = await getGameData(userId);
      if (!gameData) {
        toast.error(
          'No game data found for the user. Please start a new game.'
        );
        return;
      }

      const isSameDate = isSameDay(gameData.date);

      if (!isSameDate) {
        // reset the guess
        await updateguess(userId, Array(6).fill(''), 0).then(() => {
          const guardian = localStorage.getItem('guardian');
          if (guardian) {
            localStorage.removeItem('guardian');
          }
          if (gameStats.lastPlayedDate) {
            const IsStreakBroken = isStreakBroken(
              gameStats.lastPlayedDate,
              gameData.gameStatus
            );
            if (IsStreakBroken) {
              resetUserStats(userId).then((res) => {
                if (res.success) {
                  toast.success(res.message, { duration: 3000 });
                }
                gameStats.updateGameStat();
              });
            }
          }
        });
      } else {
        set({
          guesses: gameData.guesses,
          guessLength: gameData.guesses.length,
          currentLine: gameData.currentLine,
          currentGuess: gameData.currentGuess,
          gameStatus: gameData.gameStatus,
        });
      }
      // loading inventory items
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
