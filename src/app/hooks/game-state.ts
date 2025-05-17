

import { CreateUser, getGameData, postGuess, postStats, updateguess, updateStatus } from "@/lib/fetch-data";
import { create } from "zustand";

//maybe create an error state as well

interface GameState {
  userId: string | null;
  isInitialized : boolean;
  guesses: string[];
  currentLine: number;
  currentGuess: string;
  gameStatus: "playing" | "won" | "lost" | "paused";
  increaseCurrentLine: () => void;
  setCurrentGuess: (guess: string) => void;
  makeGuess: (guess: string) => Promise<void>;
  setGameStatus: (status: "playing" | "won" | "lost" | "paused") => Promise<void>;
  initializeUser: () => Promise<void>;
  loadGameState: () => Promise<void>;
  setUserId: (userId: string) => void;
}

export const useGameState = create<GameState>((set, get) => ({
  userId: null,
  isInitialized:false,
  guesses: Array(6).fill(""),
  currentLine: 0,
  currentGuess: "",
  gameStatus: "playing",
  setUserId:(userId)=>set({userId}),
  increaseCurrentLine:()=>{const state = get()
        set({currentLine: state.currentLine+1})
  },
  setCurrentGuess: (guess) => set({ currentGuess: guess }),
  makeGuess: async (guess) => {
    const state = get();
    const newGuesses = [...state.guesses];
    newGuesses[state.currentLine] = guess;
    set({ guesses: newGuesses, currentLine: state.currentLine+1, currentGuess: "" });

    //update the db
    updateguess(state.userId!, newGuesses, state.currentLine + 1);
  },
  setGameStatus: async(status) => {
    const state= get()
    set({ gameStatus: status })

    if(status==='lost' ||  status==='won'){
        updateStatus(state.userId!, status);
    }
      },
  initializeUser: async () => {
    try {
      const user = localStorage.getItem("user");
      if (user) {
        const parsedUser = JSON.parse(user);
        set({ userId: parsedUser });
        await get().loadGameState();
        return;
      }
      const newUser = await CreateUser();
      if (newUser) {
        localStorage.setItem("user", JSON.stringify(newUser.id));
        postGuess(newUser.id)
        postStats(newUser.id)
        set({ userId: newUser.id });
      }
    } catch (error) {
      console.error("Error initializing user:", error);
    }finally{
        set({isInitialized:true})
    }

  },
  loadGameState: async () => {
    const { userId } = get();
    if (!userId) return;
    try {
      const gameData = await getGameData(userId);
      if(gameData){
        set({
            guesses: gameData.guesses,
            currentLine: gameData.currentLine, 
            currentGuess: gameData.currentGuess,
            gameStatus: gameData.gameStatus
        })
      }
    } catch (error) {
      console.error("Error loading game data:", error);
    }
  },
}));

interface onboardingStateprops{
  open: boolean, 
  setOpen:(value: boolean)=>void
}

export const useOnboardingState = create<onboardingStateprops>((set)=>({
open:true, 
setOpen:(value)=>set({open:value})
}))
