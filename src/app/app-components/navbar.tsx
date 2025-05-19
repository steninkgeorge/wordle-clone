'use client'

import {  HelpCircleIcon, LightbulbIcon, MoonIcon, SettingsIcon, SunIcon } from "lucide-react"
import { useEffect, useState } from "react";
import { useOnboardingState } from "../hooks/game-state";
import { toast } from "sonner";

interface NavbarProps {
  scrollToHint?: () => void;
}


export const Navbar = ({scrollToHint}:NavbarProps) => {
    const [darkMode, setDarkMode] = useState(false);
    const {  setOpen } = useOnboardingState();

    useEffect(() => {
      // Check system preference and local storage
      const isDark =
        localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      setDarkMode(isDark);
      document.documentElement.classList.toggle("dark", isDark);
    }, []);

    const toggleTheme = () => {
      const newMode = !darkMode;
      setDarkMode(newMode);
      localStorage.setItem("theme", newMode ? "dark" : "light");
      document.documentElement.classList.toggle("dark", newMode);
    };


  return (
    <div className="flex justify-around items-center pt-4  border-neutral-300 dark:border-neutral-600 pb-4 shadow-md ">

      <div className="flex gap-x-8">
        <button onClick={toggleTheme} className="focus:outline-none">
          {darkMode ? (
            <SunIcon className="w-8 h-8 cursor-pointer" />
          ) : (
            <MoonIcon className="w-8 h-8 cursor-pointer" />
          )}
        </button>
        <HelpCircleIcon onClick={()=>setOpen(true)} className="w-8 h-8 cursor-pointer"/>
<LightbulbIcon onClick={scrollToHint} className="w-8 h-8 cursor-pointer"/>
<SettingsIcon onClick={()=>toast.success('heyy')}/>
      </div>
    </div>
  );

}