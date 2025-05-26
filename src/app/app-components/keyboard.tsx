import { toast } from "sonner";
import {
  getFailMessage,
  getToast,
  getTodaysWord,
} from "../constants/word-list";
import { useGameState } from "../hooks/game-state";
import { useKeyboardState } from "../hooks/keyboard-state";
import { DeleteIcon } from "lucide-react";
import { updatestats } from "@/lib/fetch-data";
import { useGameStats } from "../hooks/gameStats";

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
    setGameStatus,
    currentLine,
    userId,
  } = useGameState();

  const word = getTodaysWord();
  const stats = useGameStats();

  const { correct, present, absent, updateKeyState } = useKeyboardState();
  const styledWord = `The word was "<span class="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-bold">${word.toUpperCase()}</span>`;

  const handleKeyClick = (key: string) => {
    if (gameStatus !== "playing") return;

    if (key === "Enter") {
      if (currentGuess.length === 5) {
        makeGuess(currentGuess);
        updateKeyState(currentGuess, word);
        const message = getToast(currentLine);
        const failmessage = getFailMessage();
        setTimeout(() => {
          if (currentGuess === word) {
            setGameStatus("won");
            toast.success(`You've guessed it right!🎉`, {
              description: (
                <span>
                  <span className="bg-gradient-to-r from-green-500 to-cyan-600 bg-clip-text text-transparent font-medium text-[14px] italic">
                    {message.replace(
                      /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu,
                      ""
                    )}
                  </span>
                  <span>
                    {message
                      .match(
                        /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu
                      )
                      ?.join(" ")}
                  </span>
                </span>
              ),
              className: "!text-green-800 !bg-green-50",
              duration: 8000,
            });
            updatestats(userId!, true);
            stats.updateGameStat();
          } else if (currentLine + 1 >= 6) {
            setGameStatus("lost");
            toast.error(failmessage, {
              description: (
                <span
                  className="italic"
                  dangerouslySetInnerHTML={{ __html: styledWord }}
                />
              ),
              className:
                "!bg-gradient-to-br !from-amber-50 !to-yellow-100 !text-gray-800 !border !border-amber-200 shadow-md",
              duration: 8000,
              icon: false,
            });
            updatestats(userId!, false);
            stats.updateGameStat();
          } else {
            setGameStatus("playing");
          }
        }, 1500);
      }
    } else if (key === "Backspace") {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (currentGuess.length < 5 && /^[A-Z]$/.test(key)) {
      setCurrentGuess(currentGuess + key.toLowerCase());
    }
  };

  const getKeyStatus = (key: string) => {
    if (correct.includes(key)) return "correct";
    if (present.includes(key)) return "present";
    if (absent.includes(key)) return "absent";
    return "unused";
  };

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
