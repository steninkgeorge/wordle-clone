"use client";

import { useCallback, useEffect, useState } from "react";
import { wordList } from "../constants/word-list";
import { toast } from "sonner";


interface Stats {
  maxStreak: number;
  currentLine: number;
}

const defaultStats: Stats = {
  maxStreak: 0,
  currentLine: 0,
};

function countFrequency(word: string) {
  const frequencyMap: Map<string, number> = new Map();
  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    if (char === undefined) continue;

    const current = frequencyMap.get(char) || 0;
    frequencyMap.set(char, current + 1);
  }

  return frequencyMap;
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
    const fmap = countFrequency(wordList[Index]);
    setFrequencyMap(fmap);
    const storedStats = localStorage.getItem("stats");
    console.log(wordList[Index]);
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
          if (currentGuess.length < 5) {
            setCurrentGuess((prev) => prev + event.key);
          }
          break;
      }
    };
    window.addEventListener("keydown", handleType);

    return () => {
      window.removeEventListener("keydown", handleType);
    };
  }, [currentGuess, gameStatus, handleEnter]);

  return (
    <div className="board">
      {guesses.map((guess, index) => (
        <Line
          key={index}
          guessItem={index === currentLine ? currentGuess : guess}
          word={word}
          isSubmitted={index < currentLine}
          frequencyMap={frequencyMap}
        />
      ))}
    </div>
  );
};

function Line({
  guessItem,
  word,
  isSubmitted,
  frequencyMap,
}: {
  isSubmitted: boolean;
  guessItem: string;
  word: string;
  frequencyMap: Map<string, number>;
}) {
  const tile = [];
  const localMap = new Map<string, number>(frequencyMap);

  let state = "absent";
  let animate: undefined | "flip";
  for (let i = 0; i < 5; i++) {
    const char = guessItem[i];

    let isEmpty = false;

    if (char === undefined) {
      isEmpty = true;
    }

    if (char && isSubmitted) {
      if (localMap.has(char) && word[i] === char) {
        state = "correct";
        const current = localMap.get(char) || 0;
        if (current <= 1) {
          localMap.delete(char);
        } else {
          localMap.set(char, current - 1);
        }
      } else if (localMap.has(char)) {
        state = "present";
        const current = localMap.get(char) || 0;
        if (current <= 1) {
          localMap.delete(char);
        } else {
          localMap.set(char, current - 1);
        }
      } else {
        state = "incorrect";
      }

      animate = "flip";
    }

    tile.push(
      <div
        key={i}
        className={`tile ${isEmpty ? "empty" : null} ${state} ${animate} ${
          animate ? `flip-${i}` : null
        }`}
      >
        {char}
      </div>
    );
  }

  return <div className="line">{tile}</div>;
}
