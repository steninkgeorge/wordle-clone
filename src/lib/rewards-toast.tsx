import { toast } from 'sonner';
import Image from 'next/image';
import { StreakBonus } from '@/app/constants/word-list';
import { MagicIcon } from '@/app/constants/magic-icon';

const dailyRewardToast = () => {
  return (
    <div className="flex items-center gap-2">
      <Image
        src="/coin.png"
        alt="Coin"
        width={24}
        height={24}
        className="h-6 w-6"
        priority
      />
      <span>+5 Star Coins</span>
    </div>
  );
};

export const showDailyRewardToast = (delay = 3500) => {
  setTimeout(() => {
    toast.success('Daily Reward', {
      description: dailyRewardToast,
      className: '!bg-amber-50 !text-amber-900',
      duration: 3000,
    });
  }, delay);
};

export const showStreakBonusToast = (currentStreak: number, delay = 7000) => {
  if (currentStreak > 1) {
    setTimeout(() => {
      toast.success('Streak Bonus', {
        description: (
          <div className="flex items-center gap-2">
            <Image
              src="/coin.png"
              alt="Coin"
              width={24}
              height={24}
              className="h-6 w-6"
              priority
            />
            <span>
              +{StreakBonus} Bonus Coins ({currentStreak} day streak)
            </span>
          </div>
        ),
        className: '!bg-purple-50 !text-purple-900',
        duration: 3000,
      });
    }, delay);
  }
};

export const showRewardToast = () => {
  return toast.success('', {
    description: (
      <div className="flex items-center gap-2">
        <Image
          src="/coin.png"
          alt="Coin"
          width={28}
          height={28}
          className="h-7 w-7"
          priority
        />
        <span className="text-md font-semibold text-yellow-800">
          You have recieved 10 star coins
        </span>
      </div>
    ),
    duration: 4000,
    className:
      '!bg-gradient-to-br !from-yellow-50 !via-orange-100 !to-pink-100 !text-yellow-900 !border !border-yellow-200 !shadow-md',
    style: {
      borderRadius: '12px',
      padding: '14px 16px',
    },
    closeButton: false,
  });
};

export const showMagicItemToast = (itemName: string) => {
  return toast.success('', {
    description: (
      <div className="flex items-center gap-x-2">
        <span className="text-md font-semibold text-purple-900">
          Magical Item added to Inventory
        </span>
        <MagicIcon
          src={`/${itemName}.png`}
          alt={itemName}
          bgClassname={''}
          size={28}
        />
      </div>
    ),
    duration: 3000,
    className:
      '!bg-gradient-to-br !from-fuchsia-100 !via-pink-200 !to-violet-300 !text-purple-900 !border !border-pink-200 !shadow-lg',
    style: {
      borderRadius: '12px',
      padding: '14px 16px',
    },

    closeButton: false,
  });
};
