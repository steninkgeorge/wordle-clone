import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useShopItem } from '../hooks/shop-item';
import { ItemToDisplay } from '../constants/magic-items';
import { MagicIcon } from '../constants/magic-icon';
import { useTheme } from '../hooks/theme';
import Image from 'next/image';
import { InventoryType } from '@prisma/client';
import { useGameState } from '../hooks/game-state';
import { useGameItems } from '../hooks/game-assets';
import { buyItemFromShop } from '@/lib/server-actions';
import { toast } from 'sonner';
import { useInventory } from '../hooks/inventory-state';

export const Shop = () => {
  const [open, setOpen] = useState(false);
  const { shopItems } = useShopItem();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { userId } = useGameState();
  const { coins, setCoins } = useGameItems();
  const { loadItems } = useInventory();
  const BuyItem = async (itemType: InventoryType, amount: number) => {
    //TODO: disable button if coin is insufficient
    //TODO : make functions to handle backend -> deduct amount , add item to user inventory , additional check for purchase limit and show toast
    if (!userId) {
      toast.error('User doesnt exist');
      setOpen(false);
      return;
    }
    if (coins < amount) {
      toast.error('Insufficient coins');
      setOpen(false);
      return;
    }
    await buyItemFromShop(userId, itemType, amount)
      .then((res) => {
        if (res.success) {
          toast.success(res.message);
          setCoins(coins - amount);
          loadItems();
        } else {
          toast.error(res.message);
        }
      })
      .finally(() => setOpen(false));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className=" flex item-center justify-center gap-x-2">
          <ShoppingCart className="w-8 h-6 cursor-pointer" />
          <span className="flex items-center font-medium">Shop</span>
        </button>
      </DialogTrigger>
      <DialogContent
        className={`sm:mx-20 border-none ${isDark ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-600'}`}
      >
        <DialogHeader>
          <DialogTitle className="justify-start flex">SHOP</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col my-4 sm:my-5  text-lg sm:mx-5 md:mx-5 ">
          {shopItems.length > 0 ? (
            <div>
              {shopItems.map((item) => {
                const config = ItemToDisplay[item.inventoryType];
                return (
                  <div
                    key={item.inventoryType}
                    className="flex p-2 gap-x-2 items-center my-10 justify-between  rounded-lg"
                  >
                    <div className="flex gap-x-2">
                      <MagicIcon
                        src={config.img}
                        alt={config.name}
                        bgClassname={config.bg}
                      />
                      <div className="flex flex-col gap-y-1 mx-1 justify-start">
                        <h2 className="text-lg font-semibold">{item.name}</h2>
                        <p className="text-sm opacity-80">{item.description}</p>
                      </div>
                    </div>
                    <div className=" flex flex-col items-center justify-center ">
                      <div className="flex items-center">
                        <span
                          className={`font-bold text-lg  ${coins > item.price ? 'text-green-400' : 'text-neutral-600'} `}
                        >
                          {item.price}
                        </span>
                        <div className="w-6 h-6 relative">
                          <Image
                            src="/coin.png"
                            alt="coin"
                            width={24}
                            height={24}
                            className="object-contain"
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => BuyItem(item.inventoryType, item.price)}
                        className={`p-2 cursor-pointer text-sm rounded-xl font-semibold bg-gradient-to-r ${coins > item.price ? 'from-green-500 to-emerald-600' : 'bg-neutral-700 text-neutral-200'} hover:scale-105 transition text-white shadow-md`}
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div>Nothing in shop</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
