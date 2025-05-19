import { create } from "zustand";

interface KeyboardStateProps {
  correct: string;
  present: string;
  absent: string;
  updateKeyState: (guess: string, word: string) => void;
  resetKey: () => void;
}

export const useKeyboardState = create<KeyboardStateProps>((set) => ({
  correct: "",
  present: "",
  absent: "",

  updateKeyState: (guess, word) => {

    const targetLetters = word.split("");
    const guessLetters = guess.split("");
    const newCorrect = new Set<string>();
    const newPresent = new Set<string>();
    const newAbsent = new Set<string>();

    // Create a frequency map of letters not yet matched
    const availableLetters = new Map<string, number>();
    for (const letter of targetLetters) {
      availableLetters.set(letter, (availableLetters.get(letter) || 0) + 1);
    }

    for (let i = 0; i < guessLetters.length; i++) {
      const letter = guessLetters[i];
      if (guessLetters[i].toLowerCase() === targetLetters[i]) {
        newCorrect.add(letter);
        availableLetters.set(letter, availableLetters.get(letter)! - 1);
      }
    }

    for (let i = 0; i < guessLetters.length; i++) {
      const letter = guessLetters[i];

      // Skip if already marked correct
      if (newCorrect.has(letter)) continue;

      if (
        targetLetters.includes(letter.toLowerCase()) &&
        (availableLetters.get(letter) || 0) > 0
      ) {
        newPresent.add(letter);
        availableLetters.set(letter, availableLetters.get(letter)! - 1);
      } else {
        newAbsent.add(letter);
      }
    }

    set((state) => ({
      correct: Array.from(new Set([...state.correct, ...newCorrect])).join(""),

      present: Array.from(new Set([...state.present, ...newPresent])).join(""),

      absent: Array.from(new Set([...state.absent, ...newAbsent])).join(""),
    }));
  },
  resetKey: () => {
    set({
      correct: "",
      present: "",
      absent: "",
    });
  },
}));
