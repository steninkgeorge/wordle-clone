'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MedalIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useGameStats } from '../hooks/gameStats';

export const StatsCard = () => {
  const [open, setOpen] = useState(false);
  const stat = useGameStats();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="">
          <MedalIcon className="w-8 h-8 cursor-pointer" />
        </button>
      </DialogTrigger>
      <DialogContent
        className={`sm:max-w-[425px  border-none  ${
          isDark
            ? 'dark:bg-neutral-900 text-neutral-300'
            : ' bg-white text-neutral-500'
        }`}
      >
        <DialogHeader>
          <DialogTitle>STATS</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col my-10 gap-y-8 text-lg ">
          <div className="flex justify-between px-20 ">
            <span>
              Games Played <span className="ml-1">🎮</span>
            </span>
            <span>{stat.GamesPlayed}</span>
          </div>
          <div className="flex justify-between px-20 ">
            <span>
              Games Won <span className="ml-1">🎯</span>
            </span>
            <span>{stat.GamesWon}</span>
          </div>
          <div className="flex justify-between px-20 ">
            <span>
              {' '}
              Streak <span className="ml-1">🔥</span>
            </span>
            <span>{stat.CurrentStreak}</span>
          </div>
          <div className="flex justify-between px-20 ">
            <span>
              Max Streak <span className="ml-1">🤓</span>
            </span>
            <span>{stat.MaxStreak}</span>
          </div>
          <div className="flex justify-between px-20 ">
            <span>
              Win Ratio <span className="ml-1">✅</span>
            </span>
            <span>{stat.WinRatio} %</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
