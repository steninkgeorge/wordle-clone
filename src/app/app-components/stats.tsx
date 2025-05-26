import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MedalIcon } from 'lucide-react';
import { useState } from 'react';
import { useGameStats } from '../hooks/gameStats';
import { useTheme } from '../hooks/theme';

export const StatsCard = () => {
  const [open, setOpen] = useState(false);
  const stat = useGameStats();
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="">
          <MedalIcon className="w-8 h-8 cursor-pointer" />
        </button>
      </DialogTrigger>
      <DialogContent
        className={`sm:max-w-[425px  border-none`}
        style={{
          background: isDark ? '#171717' : '#ffffff',
          color: isDark ? '#d4d4d4' : '#737373',
        }}
      >
        <DialogHeader>
          <DialogTitle className="justify-start flex">STATS</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col my-10 sm:my-5 gap-y-8 text-lg sm:mx-5 md:mx-5">
          <div className="flex justify-between ">
            <span>
              Games Played <span className="ml-1">🎮</span>
            </span>
            <span>{stat.GamesPlayed}</span>
          </div>
          <div className="flex justify-between  ">
            <span>
              Games Won <span className="ml-1">🎯</span>
            </span>
            <span>{stat.GamesWon}</span>
          </div>
          <div className="flex justify-between  ">
            <span>
              {' '}
              Win Streak <span className="ml-1">🔥</span>
            </span>
            <span>{stat.CurrentStreak}</span>
          </div>
          <div className="flex justify-between  ">
            <span>
              Max Streak <span className="ml-1">🤓</span>
            </span>
            <span>{stat.MaxStreak}</span>
          </div>
          <div className="flex justify-between  ">
            <span>
              Win Ratio <span className="ml-1">✅</span>
            </span>
            <span>
              {stat.WinRatio} {stat.WinRatio > 0 && '%'}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
