'use client'

import {  LightbulbIcon, MedalIcon, MenuIcon, MoonIcon, SettingsIcon, SunIcon } from "lucide-react"
import { useEffect, useState } from "react";

export const Navbar = () => {
    const [darkMode, setDarkMode] = useState(false);
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
    <div className="flex justify-around items-center pt-2 border-b border-neutral-300 dark:border-neutral-600 pb-4">
      <div>
        <MenuIcon className="w-8 h-8 cursor-pointer" />
      </div>
      <div className="flex gap-x-8">
        <button onClick={toggleTheme} className="focus:outline-none">
          {darkMode ? (
            <SunIcon className="w-8 h-8 cursor-pointer" />
          ) : (
            <MoonIcon className="w-8 h-8 cursor-pointer" />
          )}
        </button>
        <LightbulbIcon className="w-8 h-8 cursor-pointer" />
        <MedalIcon className="w-8 h-8 cursor-pointer" />
        <SettingsIcon className="w-8 h-8 cursor-pointer" />
      </div>
    </div>
  );

}