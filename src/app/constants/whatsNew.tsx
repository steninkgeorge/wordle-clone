'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useOnboardingState } from '../hooks/game-state';
import { useTheme } from '../hooks/theme';
import { MagicIcon } from './magic-icon';
import { ItemToDisplay } from './magic-items';
import { CheckmarkIcon } from 'react-hot-toast';

const milestones = [
  {
    title: 'Streak Guardian 🪽',
    image: ItemToDisplay['STREAK_GUARD'].img,
    bgClassname: ItemToDisplay['STREAK_GUARD'].bg,
    bulletPoints: [
      'Shield your streak from unexpected losses 💪',
      'Life happens — we’ve got your back 🎯',
      'Protects your streak even if you lose the game ❤️‍🔥',
    ],
  },
  {
    title: 'Streak Saver 🛡️',
    image: '/StreakSaver.png',
    bgClassname:
      'bg-gradient-to-br from-fuchsia-200 via-purple-300 to-indigo-300 dark:from-purple-800 dark:via-purple-900 dark:to-indigo-900',
    bulletPoints: [
      'Missed a day? Your streak is safe ⏳',
      'Play when you can , we’ll keep the streak alive 💫',
      'Your perfect record stays untouched, even on busy days',
    ],
  },
  {
    separator: true,
    label: 'Previous Release',
  },
  {
    title: 'Star Coins ⭐️',
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
    image: ItemToDisplay['EXTRA_GUESS'].img,
    bgClassname: ItemToDisplay['EXTRA_GUESS'].bg,
    bulletPoints: [
      'A Magical Feather that grants you an extra guess ✨',
      'Can be purchased using Star Coins ',
    ],
  },
];

export const WhatsNewDialog = () => {
  const { showChangeLogs, SetShowChangeLogs } = useOnboardingState();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Dialog open={showChangeLogs} onOpenChange={SetShowChangeLogs}>
      <DialogContent
        className={` max-h-[80vh] overflow-y-auto border-none sm:max-w-xl backdrop-blur-xl ${
          isDark
            ? 'dark:bg-neutral-900 text-neutral-300'
            : 'bg-white/70 text-neutral-700'
        }`}
      >
        <DialogHeader>
          <DialogTitle className="text-3xl text-center font-bold mb-4">
            {'What’s New?'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col space-y-6">
          {milestones.map((milestone, index) => {
            if (milestone.separator) {
              return (
                <div
                  key={index}
                  className="text-center text-lg font-bold text-muted-foreground"
                >
                  <Separator className="my-2" />
                  {milestone.label}
                  <Separator className="my-2" />
                </div>
              );
            }

            return (
              <div
                key={index}
                className={`rounded-xl p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${
                  isDark
                    ? 'bg-neutral-950/50 border border-neutral-700/50'
                    : 'bg-white/50 border border-neutral-200/50'
                }`}
              >
                <div className="flex flex-col items-center space-y-4 text-center">
                  {milestone.image && (
                    <div className="relative">
                      <MagicIcon
                        src={milestone.image}
                        alt={milestone.title}
                        bgClassname={milestone.bgClassname}
                        size={100}
                      />
                    </div>
                  )}
                  <h3
                    className={`text-xl font-semibold ${
                      isDark ? 'text-white' : 'text-neutral-800'
                    }`}
                  >
                    {milestone.title}
                  </h3>
                  <ul className="space-y-2 text-left text-sm md:text-base px-4 font-sans max-w-md">
                    {milestone.bulletPoints?.map((point, i) => (
                      <li
                        key={i}
                        className={`flex items-start gap-2 italic ${
                          isDark ? 'text-neutral-300' : 'text-neutral-600'
                        }`}
                      >
                        <span
                          className={`
                            w-1 h-1 rounded-full mt-2 flex-shrink-0
                            ${isDark ? 'bg-slate-400' : 'bg-slate-500'}
                          `}
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        <Separator className="my-6" />
        <div className="flex justify-center">
          <Button
            onClick={() => SetShowChangeLogs(false)}
            className={`shadow-lg font-semibold ${
              isDark
                ? 'bg-neutral-700 hover:bg-neutral-600 text-white'
                : 'bg-neutral-800 hover:bg-neutral-700 text-white'
            }`}
          >
            <CheckmarkIcon className="mr-2 h-4 w-4" /> Got it!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
