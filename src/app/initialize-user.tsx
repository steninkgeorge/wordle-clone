'use client';

import { useEffect } from 'react';
import { useGameState, useOnboardingState } from './hooks/game-state';
import { useTheme } from './hooks/theme';
import { useShopItem } from './hooks/shop-item';

export const UserInitializationComponent = () => {
  const { isInitialized, initializeUser } = useGameState();
  const { setOpen } = useOnboardingState();
  const initTheme = useTheme((state) => state.initTheme);

  const { loadShopItems } = useShopItem();
  useEffect(() => {
    initTheme();

    const data = localStorage.getItem('hasPlayed');
    if (data) {
      setOpen(false);
    }

    if (!isInitialized) {
      initializeUser();
    }
    loadShopItems();
  }, [initializeUser, isInitialized]);

  return null;
};
