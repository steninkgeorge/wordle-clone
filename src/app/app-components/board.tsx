"use client";

//immediate : find and fix loopholes
//TODO: toast not showing in chrome
//TODO : artificial coins , streaks and many more
//TODO : add more games

//optimize
//TODO: reset guesses table every 24 hours
//TODO : migrate to realtime

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { getTodaysWord } from "../constants/word-list";
import { toast } from "sonner";
import { Grid, GridRef } from "./grid";
import {  updatestats } from "@/lib/fetch-data";
import { countFrequency, HintProps } from "@/lib/frequency-count";
import { useGameState } from "../hooks/game-state";
import { ShimmerGrid } from "./shimmer-grid";
import { HowToPlay } from "./onboarding";
import { useKeyboardState } from "../hooks/keyboard-state";



export interface BoardRef {
  scrollToHint: () => void;
}

export const Board =forwardRef<BoardRef>( (_,ref) => {
  const gridRef = useRef<GridRef>(null);

    useImperativeHandle(ref, () => ({
      scrollToHint: () => {
        gridRef.current?.scrollToHint();
      },
    }));

    const {updateKeyState, correct,absent}=useKeyboardState()
  const {
    userId,
    guesses,
    isInitialized,
    makeGuess,
    currentLine,
    currentGuess,
    setCurrentGuess,
    gameStatus,
    setGameStatus,
  } = useGameState();

  const [word, setWord] = useState("");
  const [frequencyMap, setFrequencyMap] = useState(new Map<string, number>());

  const [Hint, SetHint] = useState<HintProps>({
    vowel: undefined,
    consonant: undefined,
  });



  const handleEnter = useCallback(
    async (guess: string) => {
      if (gameStatus !== "playing" && gameStatus !== "paused") return;

      makeGuess(guess);
      updateKeyState(guess , word)
      setTimeout(() => {
        if (guess === word) {
          setGameStatus("won");
          toast.success("You guessed it! 🎉", {
            className: "!bg-green-100 !text-green-800",
          });
          updatestats(userId!, true);
        } else if (currentLine + 1 >= 6) {
          setGameStatus("lost");
          toast.error(`Game Over! The word was: ${word.toUpperCase()}`);
          updatestats(userId!, false);
        } else {
          setGameStatus("playing");
        }
      }, 1500);
    },
    [currentLine, word, guesses, gameStatus]
  );

  useEffect(() => {
    if (gameStatus === "won" || gameStatus === "lost") {
      toast.success(
        "You have completed today's challenge come back tomorrow 😇",
        {
          className: "!bg-green-100 !text-green-800",
          duration: 6000,
        }
      );
      return;
    }
    const res = getTodaysWord();
    setWord(res);
    const { frequencyMap, hint } = countFrequency(res, Hint);
    setFrequencyMap(frequencyMap);
    SetHint(hint);
        if (guesses && res) {
          guesses.slice(0, currentLine).forEach((guess) => {
            if (guess) {
              updateKeyState(guess, res);
            }
          });
        }

    //check if uuid exist in local storage
  }, [isInitialized]);

  useEffect(() => {
    if (gameStatus !== "playing" && gameStatus !== "paused") return;

    const handleType = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Enter":
          if (currentGuess.length === 5) {
            handleEnter(currentGuess);
            setGameStatus("paused");
          }
          break;

        case "Backspace":
          setCurrentGuess(currentGuess.slice(0, -1));
          break;

        default:
          if (
            currentGuess.length < 5 &&
            /^[a-zA-Z]$/.test(event.key) &&
            gameStatus === "playing"
          ) {
            setCurrentGuess(currentGuess + event.key);
          }
          break;
      }
    };
    window.addEventListener("keydown", handleType);

    return () => {
      window.removeEventListener("keydown", handleType);
    };
  }, [currentGuess, gameStatus, currentLine]);

  if (!isInitialized) {
    return <ShimmerGrid />;
  }
  return (
    <div>
      <HowToPlay />
      <Grid
      ref={gridRef}
        guesses={guesses}
        Hint={Hint}
        word={word}
        currentLine={currentLine}
        currentGuess={currentGuess}
        frequencyMap={frequencyMap}
      />
    </div>
  );
})

Board.displayName = "Board";
