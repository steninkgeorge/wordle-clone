import { useEffect } from "react";
import { getTodaysWord } from "../constants/word-list";
import { useGameState } from "../hooks/game-state";
import { useKeyboardState } from "../hooks/keyboard-state";
import { DeleteIcon } from "lucide-react";

const KEYBOARD_LAYOUT = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace"],
];

export const OnScreenKeyboard = () => {
  const {
    currentGuess,
    setCurrentGuess,
    gameStatus,
    makeGuess,
  } = useGameState();

  const word = getTodaysWord();
  const { correct, present, absent, updateKeyState, resetKey } =
    useKeyboardState();

  const handleKeyClick = (key: string) => {
    if (gameStatus !== "playing") return;

    if (key === "Enter") {
      if (currentGuess.length === 5) {
        makeGuess(currentGuess);
        updateKeyState(currentGuess, word);
      }
    } else if (key === "Backspace") {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (currentGuess.length < 5 && /^[A-Z]$/.test(key)) {
      setCurrentGuess(currentGuess + key.toLowerCase());
    }
    console.log(key);
  };

  const getKeyStatus = (key: string) => {
    if (correct.includes(key)) return "correct";
    if (present.includes(key)) return "present";
    if (absent.includes(key)) return "absent";
    return "unused";
  };

  useEffect(() => {
    resetKey();
  }, [word]);

  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-lg mx-auto mt-8 px-2 ">
      {KEYBOARD_LAYOUT.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1 w-full justify-center">
          {row.map((key) => {
            const status = getKeyStatus(key.toLowerCase());

            const isSpecialKey = key === "Enter" || key === "Backspace";

            return (
              <button
                key={key}
                onClick={() => handleKeyClick(key)}
                className={`
  flex items-center justify-center 
  h-12 md:h-14 
  ${isSpecialKey ? "px-2 md:px-4 text-xs md:text-sm" : "px-1 md:px-2 text-lg"} 
  rounded font-medium
  ${
    status === "correct"
      ? "bg-[rgb(var(--color-correct))] text-white"
      : status === "present"
      ? "bg-[rgb(var(--color-present))] text-white"
      : status === "absent"
      ? "bg-[rgb(var(--color-absent))] text-white"
      : "bg-transparent text-[rgb(var(--color-foreground))] border border-[rgb(var(--color-border))]"
  }
  ${
    isSpecialKey
      ? "flex-1 max-w-[80px] md:max-w-[100px]"
      : "flex-1 max-w-[40px] md:max-w-[50px]"
  }
  active:scale-95 transition-transform
  ${status === "unused" ? "opacity-90 hover:opacity-100" : ""}
`}
                disabled={gameStatus !== "playing"}
              >
                {key === "Backspace" ? <DeleteIcon className="w-4 h-4" /> : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};
