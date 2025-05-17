"use client";

import {  useEffect } from "react";
import { useGameState } from "./hooks/game-state";

export const UserInitializationComponent = () => {
  const {isInitialized, initializeUser } = useGameState();

  useEffect(() => {
    if(!isInitialized){
      initializeUser()
    }
  }, [initializeUser, isInitialized]);

  return null;
};
