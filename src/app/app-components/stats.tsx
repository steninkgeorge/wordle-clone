import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MedalIcon } from "lucide-react";
import { useState } from "react";
import { useGameStats } from "../hooks/gameStats";

export const StatsCard = () => {
    const [open , setOpen ]=useState(false)
    const stat=useGameStats()
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="">
          <MedalIcon className="w-8 h-8 cursor-pointer" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px bg-white dark:bg-neutral-900 border-none">
        <DialogHeader>
          <DialogTitle>STATS</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col my-10 gap-y-8 text-neutral-300 text-lg ">
          <div className="flex justify-between px-20 ">
            <span>
              Games Played <span className="ml-1">🎮</span>
            </span>
            <span>{stat.GamesPlayed}</span>
          </div>
          <div className="flex justify-between px-20 ">
            <span>
              Games Won <span className="ml-1">🎯</span>
            </span>
            <span>{stat.GamesWon}</span>
          </div>
          <div className="flex justify-between px-20 ">
            <span>
              {" "}
              Streak <span className="ml-1">🔥</span>
            </span>
            <span>{stat.CurrentStreak}</span>
          </div>
          <div className="flex justify-between px-20 ">
            <span>
              Max Streak <span className="ml-1">🤓</span>
            </span>
            <span>{stat.MaxStreak}</span>
          </div>
          <div className="flex justify-between px-20 ">
            <span>
              Win Ratio <span className="ml-1">✅</span>
            </span>
            <span>{stat.WinRatio} %</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
