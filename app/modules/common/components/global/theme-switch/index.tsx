"use client";
import { HugeiconsIcon } from "@hugeicons/react";
import { Moon01Icon, Sun01Icon } from "@hugeicons/core-free-icons";
import { useTheme } from "next-themes";

export default function ThemeSwitch() {
  const { theme, setTheme, systemTheme } = useTheme();

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <div className="flex items-center w-fit rounded-xl bg-primary-accent dark:bg-sidebar-accent/30">
      <div
        className={`h-10 px-3 rounded-full flex cursor-pointer items-center justify-center gap-2 ${
          currentTheme === "light" ? "bg-sidebar-accent" : ""
        }`}
        onClick={() => setTheme("light")}
      >
        <HugeiconsIcon icon={Sun01Icon} />
        Light
      </div>
      <div
        className={`h-10 px-3 rounded-full flex cursor-pointer items-center justify-center gap-2 ${
          currentTheme === "dark" ? "bg-sidebar-accent" : ""
        }`}
        onClick={() => setTheme("dark")}
      >
        <HugeiconsIcon icon={Moon01Icon} />
        Dark
      </div>
    </div>
  );
}
