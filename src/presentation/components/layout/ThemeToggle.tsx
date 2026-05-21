"use client";

import { useTheme } from "@/presentation/providers/ThemeProvider";
import { cn } from "@/presentation/lib/cn";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
      onClick={toggle}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-soft bg-surface text-strong transition-colors hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-200",
        className,
      )}
    >
      <Moon className={cn("h-5 w-5", isDark && "hidden")} />
      <Sun className={cn("h-5 w-5", !isDark && "hidden")} />
    </button>
  );
}
