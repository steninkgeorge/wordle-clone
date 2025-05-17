import { Board } from "./app-components/board";
import { Navbar } from "./app-components/navbar";

export default function Home() {
  return (
    <div>
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <div className="flex flex-grow item-center justify-center p-2 ">
          <Board />
        </div>
      </div>
    </div>
  );
}
