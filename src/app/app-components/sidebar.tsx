'use client';

import {
  HelpCircleIcon,
  MoonIcon,
  SunIcon,
  MenuIcon,
  StarIcon,
} from 'lucide-react';
import { useState } from 'react';
import { useOnboardingState } from '../hooks/game-state';
import { useTheme } from '../hooks/theme';
import Inventory from './inventory';
import { Shop } from './shop';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { StatsCard } from './stats';

export const Sidebar = () => {
  const { theme, setTheme } = useTheme();
  const { setOpen, SetShowChangeLogs } = useOnboardingState();
  const [dark, setDark] = useState(theme === 'dark');
  const isDark = theme === 'dark';
  const toggleTheme = () => {
    const darkmode = !dark;
    setDark(darkmode);
    localStorage.setItem('theme', darkmode ? 'dark' : 'light');
    setTheme(darkmode ? 'dark' : 'light');
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="p-2 ">
          <MenuIcon className="w-7 h-7" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className={`border-none w-[200px] sm:w-[300px] backdrop-blur-md ${
          isDark
            ? 'text-neutral-200 bg-gradient-to-b from-neutral-800 via-neutral-900 to-black'
            : 'text-neutral-700 bg-gradient-to-b from-white via-neutral-100 to-neutral-200'
        }`}
      >
        <SheetHeader>
          <SheetTitle className="text-2xl font-semibold">Hey 👋🏻</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-6 mt-8 px-5">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 text-sm font-medium"
          >
            {isDark ? (
              <MoonIcon className="w-8 h-6" />
            ) : (
              <SunIcon className="w-8 h-6" />
            )}
            Toggle Theme
          </button>

          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-3 text-sm font-medium"
          >
            <HelpCircleIcon className="w-8 h-6" />
            How to Play ?
          </button>

          <div className="flex items-center gap-3 text-sm font-medium">
            <StatsCard />
          </div>

          <div className="flex items-center gap-3 text-sm font-medium">
            <Inventory />
          </div>

          <div className="flex items-center gap-3 text-sm font-medium">
            <Shop />
          </div>

          <button
            onClick={() => SetShowChangeLogs(true)}
            className="flex items-center gap-3 text-sm font-medium "
          >
            <StarIcon className="w-8 h-6 text-amber-200" />
            <span>{"What's New ?"}</span>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
