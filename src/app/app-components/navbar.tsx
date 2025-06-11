'use client';

import { LightbulbIcon } from 'lucide-react';
import { useTheme } from '../hooks/theme';
import Image from 'next/image';
import { useGameItems } from '../hooks/game-assets';
import { Sidebar } from './sidebar';
import { useGameStats } from '../hooks/gameStats';
import { MagicIcon } from '../constants/magic-icon';
import { ItemToDisplay } from '../constants/magic-items';
import { useEffect } from 'react';
interface NavbarProps {
  scrollToHint?: () => void;
}

export const Navbar = ({ scrollToHint }: NavbarProps) => {
  const { theme } = useTheme();
  const { coins } = useGameItems();
  const { showGuardian, setShowGuardian } = useGameStats();
  const isDark = theme === 'dark';
  const config = ItemToDisplay['STREAK_GUARD'];

  useEffect(() => {
    const guardian = localStorage.getItem('guardian');
    if (guardian) {
      setShowGuardian(true);
    }
  }, [showGuardian]);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 md:px-[30%] ${isDark ? 'bg-neutral-900' : 'bg-white'} shadow-sm  flex justify-between items-center p-4`}
    >
      <Sidebar />
      {/* Coin Display */}
      <div className="flex items-center gap-x-2">
        {showGuardian && (
          <MagicIcon
            size={32}
            src={config.img}
            alt={config.name}
            bgClassname={config.bg}
          />
        )}
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
