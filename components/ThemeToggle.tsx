"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="p-2.5 rounded-md border border-[#D7DFCF] dark:border-[#2A362E] bg-white dark:bg-[#16201A] text-[#5B6B5F] dark:text-[#8FA090] hover:bg-[#F7F9F4] dark:hover:bg-[#1C271F] transition-colors focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#2F6B4F]"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
