"use client";

//TODO : mobile device usage as well 
//TODO : fetch user stats from server , or local storage for now
//TODO : provide hint
//TODO : provide words per day
//TODO : artificial coins , streaks and many more 
//TODO : add more games 

import { useCallback, useEffect, useState } from "react";
import { wordList } from "../constants/word-list";
import { toast } from "sonner";
import { Grid } from "./grid";


interface Stats {
  maxStreak: number;
  currentLine: number;
}

interface HintProps{
  consonant: string | undefined,
  vowel : string | undefined
}

const defaultStats: Stats = {
  maxStreak: 0,
  currentLine: 0,
};

const vowels = ['a','e','i','o','u']

function countFrequency(word: string, hint: HintProps) {
  const frequencyMap: Map<string, number> = new Map();
  const wordLower = word.toLowerCase()
  
  for (let i = 0; i < word.length; i++) {
    const char = wordLower[i];
    if (char === undefined) continue;
    if(vowels.includes(char) && hint.vowel===undefined){
      hint.vowel=char
    }

    if(!vowels.includes(char) && hint.consonant===undefined){
      hint.consonant=char
    }

    const current = frequencyMap.get(char) || 0;
    frequencyMap.set(char, current + 1);
  }

  return {frequencyMap, hint};
}

export const Board = () => {
  const [guesses, setGuesses] = useState<string[]>(Array(6).fill(""));
  const [currentGuess, setCurrentGuess] = useState("");
  const [currentLine, setCurrentLine] = useState(0);
  const [word, setWord] = useState("");
  const [frequencyMap, setFrequencyMap] = useState(new Map<string, number>());
  const [stats, setStats] = useState(defaultStats);
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">(
    "playing"
  );
  const [Hint , SetHint]=useState<HintProps>({vowel:undefined, consonant:undefined})

  const handleEnter = useCallback(
    (guess: string) => {
      if (gameStatus !== "playing") return;
      const newGuess = [...guesses];
      newGuess[currentLine] = guess;

      setGuesses(newGuess);
      // Continue to next guess
      setCurrentGuess("");
      setCurrentLine((prev) => prev + 1);
      setTimeout(() => {
        if (guess === word) {
          setGameStatus("won");
          toast.success("You guessed it! 🎉", {
            className: "!bg-green-100 !text-green-800",
          });
          const updatedStats = {
            ...stats,
            maxStreak: stats.maxStreak + 1,
          };
          setStats(updatedStats);
          localStorage.setItem("stats", JSON.stringify(updatedStats));
        } else if (currentLine + 1 >= 6) {
          setGameStatus("lost");
          toast.error(`Game Over! The word was: ${word.toUpperCase()}`);
          const updatedStats = { ...stats, maxStreak: 0 };
          setStats(updatedStats);
          localStorage.setItem("stats", JSON.stringify(updatedStats));
        }
      }, 1500);
    },
    [currentLine, word, guesses, gameStatus, stats]
  );

  useEffect(() => {
    const Index = Math.floor(Math.random() * wordList.length);
    setWord(wordList[Index]);
    console.log(wordList[Index])
    const {frequencyMap, hint } = countFrequency(wordList[Index], Hint);
    setFrequencyMap(frequencyMap);
    SetHint(hint)
    const storedStats = localStorage.getItem("stats");
    if (!storedStats) {
      localStorage.setItem("stats", JSON.stringify(stats));
    } else {
      const parsedStats = JSON.parse(storedStats);
      setStats(parsedStats);
      setCurrentLine(parsedStats.currentLine);
    }
  }, []);

  useEffect(() => {
    if (gameStatus !== "playing") return;

    const handleType = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Enter":
          if (currentGuess.length === 5) {
            handleEnter(currentGuess);
          }
          break;

        case "Backspace":
          setCurrentGuess((prev) => prev.slice(0, -1));
          break;

        default:
         if (currentGuess.length < 5 && /^[a-zA-Z]$/.test(event.key)) {
           setCurrentGuess((prev) => prev + event.key);
         }
         break;
          break;
      }
    };
    window.addEventListener("keydown", handleType);

    return () => {
      window.removeEventListener("keydown", handleType);
    };
  }, [currentGuess]);

  return (
    <Grid guesses={guesses} Hint={Hint} word={word} currentLine={currentLine} currentGuess={currentGuess} frequencyMap={frequencyMap} />
  );
};

