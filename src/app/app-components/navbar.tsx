'use client';

import { HelpCircleIcon, LightbulbIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useState } from 'react';
import { useOnboardingState } from '../hooks/game-state';
import { StatsCard } from './stats';
import { useTheme } from '../hooks/theme';

interface NavbarProps {
  scrollToHint?: () => void;
}

export const Navbar = ({ scrollToHint }: NavbarProps) => {
  const { setOpen } = useOnboardingState();
  const { theme, setTheme } = useTheme();
  const [isDark, setDark] = useState(theme === 'dark');
  const toggleTheme = () => {
    const darkmode = !isDark;
    setDark(darkmode);
    localStorage.setItem('theme', darkmode ? 'dark' : 'light');
    setTheme(darkmode ? 'dark' : 'light');
  };

  return (
    <div className="flex justify-around items-center pt-6  border-neutral-300 dark:border-neutral-600 pb-4 shadow-md ">
      <div className="flex gap-x-8">
        <button onClick={toggleTheme} className="focus:outline-none">
          {theme === 'light' ? (
            <SunIcon className="w-8 h-8 cursor-pointer" />
          ) : (
            <MoonIcon className="w-8 h-8 cursor-pointer" />
          )}
        </button>
        <HelpCircleIcon
          onClick={() => setOpen(true)}
          className="w-8 h-8 cursor-pointer "
        />
        <LightbulbIcon
          onClick={scrollToHint}
          className="w-8 h-8 cursor-pointer md:hidden"
        />
        <StatsCard />
      </div>
    </div>
  );
};
