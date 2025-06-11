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
import {
  UseMagicalGuessItem,
  UseStreakGuard,
  UseStreakSaver,
} from '@/lib/server-actions';
import { InventoryType } from '@prisma/client';
import { toast } from 'sonner';
import { MagicIcon } from '../constants/magic-icon';
import { ItemToDisplay } from '../constants/magic-items';
import { useGameStats } from '../hooks/gameStats';

const Inventory = () => {
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();
  const { items, loadItems } = useInventory();
  const { userId, setGuesses, guessLength, setGuessLength, gameStatus } =
    useGameState();
  const { updateGameStat, setShowGuardian } = useGameStats();
  const isDark = theme === 'dark';

  const handleClick = (item: InventoryType, quantity: number) => {
    switch (item) {
      case InventoryType.EXTRA_GUESS:
        if (guessLength === 7) {
          toast.error('You already have the maximum number of guesses');
          return;
        }
        UseMagicalGuessItem(userId!, quantity)
          .then((res) => {
            if (res.success) {
              setGuessLength(7);
              setGuesses(res.guesses);

              toast.success(res.message);
              loadItems();
            } else if (res.message) {
              toast.error(res.message);
            }
          })
          .finally(() => setOpen(false));
        break;

      case InventoryType.STREAK_SAVER:
        UseStreakSaver(userId!).then((res) => {
          if (res.success) {
            loadItems()
              .then(() => {
                updateGameStat();
              })
              .finally(() => toast.success(res.message));
          } else {
            toast.error(res.message);
          }
        });

      case InventoryType.STREAK_GUARD:
        if (gameStatus !== 'playing') {
          toast.error('You can only use Streak Guard while playing the game');
          return;
        }
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        UseStreakGuard(userId!, timeZone).then((res) => {
          if (res.success) {
            loadItems();
            const guardian = localStorage.getItem('guardian');
            if (!guardian) {
              localStorage.setItem('guardian', '1');
            }
            setShowGuardian(true);
            toast.success(res.message);
          } else {
            toast.error(res.message);
          }
        });
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
            {items
              .filter((item) => item.quantity > 0)
              .map((item, index) => {
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
                      <MagicIcon
                        src={config.img}
                        alt={config.name}
                        bgClassname={config.bg}
                      />

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
