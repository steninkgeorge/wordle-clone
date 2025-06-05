'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { useOnboardingState } from '../hooks/game-state';
import { useTheme } from '../hooks/theme';
import { MagicIcon } from './magic-icon';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CheckmarkIcon } from 'react-hot-toast';

const pages = [
  {
    title: 'Introducing Star Coins ⭐️',
    image: '/coin.png',
    bgClassname: 'bg-yellow-200',

    bulletPoints: [
      'Earned every time you play — win or lose 🎯',
      'Bonus coins for maintaining streaks 🔥',
      'Spend coins in the in-game shop 🛍️',
    ],
  },
  {
    title: 'The Magical 7th Guess 🪄',
    image: '/Magical Feather.png',
    bgClassname:
      'bg-gradient-to-br from-fuchsia-200 via-purple-300 to-indigo-300 dark:from-purple-800 dark:via-purple-900 dark:to-indigo-900',
    bulletPoints: [
      'A Magical Feather that grants you an extra guess ✨',
      'Can be purchased using Star Coins ',
    ],
  },
  {
    title: '🎉 You’re All Set!',
    lastPage: true,
    bulletPoints: [
      'Collect Star Coins and build your streak.',
      'Use magical items to boost your odds.',
      'Explore the shop for hidden wonders.',
    ],
  },
];

export const WhatsNewDialog = () => {
  const [page, setPage] = useState(0);
  const { showChangeLogs, SetShowChangeLogs } = useOnboardingState();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const handleSkip = () => setPage(pages.length - 1);
  const handleNext = () => setPage((p) => Math.min(p + 1, pages.length - 1));
  const handleBack = () => setPage((p) => Math.max(p - 1, 0));
  const handleClose = () => {
    setPage(0);
    SetShowChangeLogs(false);
  };

  const current = pages[page];

  return (
    <Dialog open={showChangeLogs} onOpenChange={SetShowChangeLogs}>
      <DialogContent
        className={`border-none sm:max-w-[425px] ${
          isDark
            ? 'dark:bg-neutral-900 text-neutral-300'
            : ' bg-white text-neutral-500'
        }`}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            {current.title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-6 pt-4">
          {current.lastPage ? (
            <div className="flex justify-center gap-10 pt-4 flex-wrap">
              <MagicIcon
                src="/coin.png"
                alt="Star Coins"
                bgClassname="bg-yellow-200"
                size={80}
              />
              <MagicIcon
                src="/Magical Feather.png"
                alt="7th Guess"
                bgClassname="bg-gradient-to-br from-fuchsia-200 via-purple-300 to-indigo-300 dark:from-purple-800 dark:via-purple-900 dark:to-indigo-900"
                size={80}
              />
            </div>
          ) : current.image ? (
            <div className="flex flex-col items-center space-y-6 pt-4">
              <MagicIcon
                src={current.image}
                alt={current.title}
                bgClassname={current.bgClassname}
                size={180}
              />
            </div>
          ) : null}

          <ul className="space-y-2 text-left text-sm md:text-base  font-sans leading-relaxed">
            {current.bulletPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-lg">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <Separator className="my-4" />

        <div className="flex justify-between items-center gap-2">
          <Button variant="ghost" onClick={handleBack} disabled={page === 0}>
            <ArrowLeft />
          </Button>
          <Button disabled={page === 2} variant="link" onClick={handleSkip}>
            Skip
          </Button>
          {page < pages.length - 1 ? (
            <Button onClick={handleNext}>
              <ArrowRight />
            </Button>
          ) : (
            <Button onClick={handleClose}>
              <CheckmarkIcon />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
