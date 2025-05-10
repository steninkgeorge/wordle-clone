
import {  LightbulbIcon, MedalIcon, MenuIcon, SettingsIcon } from "lucide-react"

export const Navbar = () => (
  <div className="flex justify-around items-center pt-2 border-b border-neutral-300 pb-4">
    <div>
      <MenuIcon className="w-8 h-8 cursor-pointer" />
    </div>
    <div className="flex gap-x-8">
      <LightbulbIcon className="w-8 h-8 cursor-pointer" />
      <MedalIcon className="w-8 h-8 cursor-pointer" />
      <SettingsIcon className="w-8 h-8 cursor-pointer" />
    </div>
  </div>
);