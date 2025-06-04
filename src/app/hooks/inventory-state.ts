import { create } from 'zustand';
import { InventoryType } from '@prisma/client';
import { useGameState } from './game-state';
import { getInventoryItem } from '@/lib/server-actions';

interface MagicalItems {
  type: InventoryType;
  quantity: number;
}

interface InventoryProps {
  items: MagicalItems[];
  addItems: (item: MagicalItems[]) => Promise<void>;
  removeItems: (item: string) => Promise<void>;
  loadItems: () => Promise<void>;
}

export const useInventory = create<InventoryProps>((set) => ({
  items: [],
  addItems: async (item) => {
    set({ items: [...useInventory.getState().items, ...item] });
  },
  removeItems: async () => {
    set({ items: [] });
  },
  loadItems: async () => {
    const userId = useGameState.getState().userId;
    if (!userId) {
      return console.error('User ID is not set');
    }
    const items = await getInventoryItem(userId);
    set({ items: items ? items : [] });
  },
}));
