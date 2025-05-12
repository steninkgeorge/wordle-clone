import { Board } from "./components/board";
import { Navbar } from "./components/navbar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar/>
<div className="flex flex-grow item-center justify-center p-2 ">
  <Board/>
</div>
    </div>
  );
}
