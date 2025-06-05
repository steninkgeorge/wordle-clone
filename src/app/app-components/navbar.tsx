'use client';

import { LightbulbIcon } from 'lucide-react';
import { useTheme } from '../hooks/theme';
import Image from 'next/image';
import { useGameItems } from '../hooks/game-assets';
import { Sidebar } from './sidebar';
interface NavbarProps {
  scrollToHint?: () => void;
}

export const Navbar = ({ scrollToHint }: NavbarProps) => {
  const { theme } = useTheme();
  const { coins } = useGameItems();
  const isDark = theme === 'dark';

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 md:px-[30%] ${isDark ? 'bg-neutral-900' : 'bg-white'} shadow-sm dark:border-neutral-700 flex justify-between items-center p-4`}
    >
      <Sidebar />
      {/* Coin Display */}
      <div className="flex items-center gap-x-2">
        <LightbulbIcon
          onClick={scrollToHint}
          className="w-8 h-8 cursor-pointer md:hidden"
        />
        <div
          className={`flex items-center gap-x-1 px-2 py-1  text-sm font-bold  rounded-full ${isDark ? 'bg-neutral-700 text-neutral-200' : 'bg-neutral-200 text-neutral-600'}`}
        >
          <Image
            src="/coin.png"
            alt="coin"
            width={24}
            height={24}
            className="object-contain"
            priority
          />
          <span>{coins}</span>
        </div>
      </div>
    </div>
  );
};
