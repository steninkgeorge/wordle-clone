import { create } from 'zustand';
import { getStats } from '@/lib/server-actions';

interface GameStats {
  userId: string | undefined;
  GamesPlayed: number;
  GamesWon: number;
  MaxStreak: number;
  CurrentStreak: number;
  WinRatio: number;
  lastPlayedDate: Date | undefined;
  showGuardian: boolean;
  setShowGuardian: (showGuardian: boolean) => void;
  updateGameStat: () => Promise<void>;
  setUserId: (userId: string) => void;
  loading: boolean;
  setloading: (loading: boolean) => void;
}

export const useGameStats = create<GameStats>((set) => ({
  userId: undefined,
  GamesPlayed: 0,
  GamesWon: 0,
  MaxStreak: 0,
  CurrentStreak: 0,
  WinRatio: 0,
  lastPlayedDate: undefined,
  loading: false,
  showGuardian: false,
  setShowGuardian: (showGuardian) => {
    set({ showGuardian: showGuardian });
  },
  setUserId: (userId) => {
    set({ userId: userId });
  },
  setloading: (loading) => {
    set({ loading: loading });
  },
  updateGameStat: async () => {
    const state = useGameStats.getState();

    try {
      if (!state.userId) {
        throw new Error('User ID is not set');
      }
      const stats = await getStats(state.userId);
      if (!stats) {
        throw new Error('No stats found for user');
      }

      set({
        GamesPlayed: stats.gamesPlayed,
        GamesWon: stats.gamesWon,
        MaxStreak: stats.maxStreak,
        CurrentStreak: stats.currentStreak,
        WinRatio: Math.floor((stats.gamesWon / stats.gamesPlayed) * 100) || 0,
        lastPlayedDate: stats.lastPlayedDate || undefined,
      });
    } catch (error) {
      throw new Error('Error fetching game stats: ' + error);
    }
  },
}));
