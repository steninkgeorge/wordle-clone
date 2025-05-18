"use client";

import { cn } from "@/lib/utils";

export const ShimmerGrid = () => {
  return (
    <div className="board w-full mx-auto md:mx-0 items-center pt-10">
      {Array.from({ length: 6 }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-x-1">
          {Array.from({ length: 5 }).map((_, cellIndex) => (
            <div
              key={cellIndex}
              className={cn(
                "h-14 w-14  rounded-md", // Increased height and rounding
                "bg-gradient-to-r from-neutral-300 via-neutral-300/70 to-neutral-300",
                "animate-pulse border border-gray-300/40 bg-transparent",
                "shadow-sm shadow-gray-400/30" // Added subtle shadow
              )}
              style={{
                animationDelay: `${(rowIndex * 5 + cellIndex) * 40}ms`,
                animationDuration: "2.5s",
              }}
            />
          ))}
        </div>
      ))}
      <span className="font-bold text-neutral-300 text-lg mt-1">loading game....</span>
    </div>
  );
};
