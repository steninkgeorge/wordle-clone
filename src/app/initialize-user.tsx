"use client";

import {  useEffect } from "react";
import { useGameState, useOnboardingState } from "./hooks/game-state";

export const UserInitializationComponent = () => {

  const {isInitialized, initializeUser } = useGameState();

  const {setOpen}=useOnboardingState()

  useEffect(() => {
    const data = localStorage.getItem("hasPlayed")
   if(data){
      setOpen(false)
   }

    if(!isInitialized){
      initializeUser()
    }
  }, [initializeUser, isInitialized]);

  return null;
};
