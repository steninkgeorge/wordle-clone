'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useOnboardingState } from '../hooks/game-state';
import { useEffect } from 'react';

export const HowToPlay = () => {
  const { open, setOpen } = useOnboardingState();

  const isDark = document.documentElement.classList.contains('dark');

  useEffect(() => {
    const hasPlayed = localStorage.getItem('hasPlayed');
    if (!hasPlayed) {
      localStorage.setItem('hasPlayed', '1');
    }
  }, []);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={`border-none sm:max-w-[425px] ${
          isDark
            ? 'shadow-[0_0_15px_0_rgba(110,231,183,0.5)] dark:bg-neutral-900'
            : 'shadow-[0_0_15px_0_rgba(59,130,246,0.5)] bg-white'
        }`}
      >
        <DialogHeader>
          <DialogTitle>How to Play</DialogTitle>
          <DialogDescription>
            Guess the <span className="font-bold">5-letter</span> word in{' '}
            <span className="font-bold">6 tries 🤩</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
            <li>Each guess must be a valid 5-letter word</li>
            <li>
              The color of the tiles will change to show how close your guess
              was
            </li>
            <li>
              ⏎ Finally, press <span className="font-semibold">ENTER</span> to
              check your guess! 🎉
            </li>
          </ul>

          <div className="space-y-2">
            <p className="text-sm font-medium">Examples</p>

            {/* Correct Example */}
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                Correct letter in correct spot
              </p>
              <div className="flex gap-1">
                {['W', 'O', 'O', 'D', 'Y'].map((letter, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-center w-10 h-10 text-lg font-bold uppercase
                      ${
                        i === 0
                          ? 'bg-green-600 text-white'
                          : 'border border-gray-300 dark:border-gray-600'
                      }`}
                  >
                    {letter}
                  </div>
                ))}
              </div>
            </div>

            {/* Present Example */}
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                Correct letter in wrong spot
              </p>
              <div className="flex gap-1">
                {['N', 'O', 'U', 'N', 'S'].map((letter, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-center w-10 h-10 text-lg font-bold uppercase
                      ${
                        i === 2
                          ? 'bg-yellow-500 text-white'
                          : 'border border-gray-300 dark:border-gray-600'
                      }`}
                  >
                    {letter}
                  </div>
                ))}
              </div>
            </div>

            {/* Absent Example */}
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                Letter not in word
              </p>
              <div className="flex gap-1">
                {['W', 'H', 'A', 'T', 'S'].map((letter, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-center w-10 h-10 text-lg font-bold uppercase
                      ${
                        i === 1
                          ? 'bg-gray-500 text-white'
                          : 'border border-gray-300 dark:border-gray-600'
                      }`}
                  >
                    {letter}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Button
          onClick={() => setOpen(false)}
          className="w-full cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700 bg-neutral-50 dark:bg-neutral-800 dark:text-white"
        >
          Got it!
        </Button>
      </DialogContent>
    </Dialog>
  );
};
