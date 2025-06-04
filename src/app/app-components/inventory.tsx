import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useTheme } from '../hooks/theme';
import { ShoppingBagIcon } from 'lucide-react';
import { useInventory } from '../hooks/inventory-state';
import { useGameState } from '../hooks/game-state';
import { UseMagicalGuessItem } from '@/lib/server-actions';
import { InventoryType } from '@prisma/client';
import { toast } from 'sonner';
import { MagicIcon } from '../constants/magic-icon';
import { ItemToDisplay } from '../constants/magic-items';

const Inventory = () => {
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();
  const { items, loadItems } = useInventory();
  const { setGuessLength } = useGameState();
  const { userId } = useGameState();
  const isDark = theme === 'dark';

  const handleClick = (item: InventoryType, quantity: number) => {
    switch (item) {
      case InventoryType.EXTRA_GUESS:
        console.log('now remove the item and add a 7th guess');
        UseMagicalGuessItem(userId!, quantity)
          .then((res) => {
            if (res.success) {
              setGuessLength(7);
              //add a new element to the DOM
              const parent = document.querySelector('.board-container');
              const tiles = Array.from({ length: 5 }, () => {
                const tile = document.createElement('div');
                tile.className = 'tile rounded-sm empty absent';
                return tile;
              });

              const newLine = document.createElement('div');
              newLine.className = 'line';
              newLine.append(...tiles);

              parent!.appendChild(newLine);
              // Trigger animation
              setTimeout(() => {
                newLine.classList.add('animate-in');
              }, 10);
              toast.success(res.message);
              loadItems();
            } else if (res.message) {
              toast.error(res.message);
            }
          })
          .finally(() => setOpen(false));
        break;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className=" flex item-center justify-center gap-x-2">
          <ShoppingBagIcon className="w-8 h-6 cursor-pointer" />
          <span className="flex items-center font-medium">Inventory</span>
        </button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px] border-none"
        style={{
          background: isDark ? '#171717' : '#ffffff',
          color: isDark ? '#d4d4d4' : '#737373',
        }}
      >
        <DialogHeader>
          <DialogTitle className="justify-start flex">Inventory</DialogTitle>
        </DialogHeader>
        {items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 px-2 py-4">
            {items.map((item, index) => {
              const config = ItemToDisplay[item.type];
              return (
                <div
                  key={index}
                  className={` p-3 backdrop-blur-md hover:shadow-md transition ${
                    isDark
                      ? 'border-neutral-700 bg-neutral-900/50'
                      : 'border-neutral-200 bg-white'
                  }`}
                >
                  <div className="flex flex-col items-center justify-between gap-2">
                    <MagicIcon src={config.img} alt={config.name} />

                    <div className="text-center">
                      <p className="font-semibold text-sm">{config.name}</p>
                      <p className="text-xs  text-neutral-500 dark:text-neutral-400">
                        x{item.quantity}
                      </p>
                    </div>

                    <button
                      onClick={() => handleClick(item.type, item.quantity)}
                      className="px-4 py-1.5 text-sm rounded-full font-semibold bg-gradient-to-r from-indigo-400 to-purple-500 hover:scale-105 transition text-white shadow-md"
                    >
                      Use ✨
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center py-4">
            You don’t own any magical items. Visit the shop!
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Inventory;
