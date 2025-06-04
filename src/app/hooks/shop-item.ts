import { loadFromShop } from '@/lib/server-actions';
import { InventoryType } from '@prisma/client';
import { create } from 'zustand';

interface ShopItem {
  name: string;
  description: string | null;
  price: number;
  inventoryType: InventoryType;
}

interface ShopProps {
  shopItems: ShopItem[];
  fetching: boolean;
  loadShopItems: () => Promise<void>;
}

export const useShopItem = create<ShopProps>((set) => ({
  shopItems: [],
  fetching: false,
  loadShopItems: async () => {
    set({ fetching: true });
    await loadFromShop().then((res) => {
      if (res.success) {
        set({ shopItems: res.items, fetching: false });
      }
    });
  },
}));
