import { toast } from 'sonner';
import Image from 'next/image';
import { StreakBonus } from '@/app/constants/word-list';

const dailyRewardToast = () => {
  return (
    <div className="flex items-center gap-2">
      <Image
        src="/coin.png"
        alt="Coin"
        width={24}
        height={24}
        className="h-6 w-6"
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
  if (currentStreak > 0) {
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
