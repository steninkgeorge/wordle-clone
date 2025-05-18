'use client'
import { useRef } from "react";
import { Board } from "./app-components/board";
import { Navbar } from "./app-components/navbar";

export default function Home() {
  const boardRef = useRef<{ scrollToHint: () => void }>(null);

  const scrollToHint = () => {
    boardRef.current?.scrollToHint();
  };
  return (
    <div>
      <div className="flex flex-col md:h-screen md:overflow-hidden min-h-screen">
        <Navbar scrollToHint={scrollToHint} />

        <div className="flex flex-grow item-center justify-center p-2 ">
          <Board ref={boardRef} />
        </div>
      </div>
    </div>
  );
}
