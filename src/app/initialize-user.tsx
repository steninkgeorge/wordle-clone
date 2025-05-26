'use client';

import { useEffect } from 'react';
import { useGameState, useOnboardingState } from './hooks/game-state';
import { useTheme } from './hooks/theme';

export const UserInitializationComponent = () => {
  const { isInitialized, initializeUser } = useGameState();
  const { setOpen } = useOnboardingState();
  const initTheme = useTheme((state) => state.initTheme);

  useEffect(() => {
    initTheme();

    const data = localStorage.getItem('hasPlayed');
    if (data) {
      setOpen(false);
    }

    if (!isInitialized) {
      initializeUser();
    }
  }, [initializeUser, isInitialized]);

  return null;
};
