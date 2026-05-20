"use client";

import { useTheme } from "@/presentation/providers/ThemeProvider";
import { cn } from "@/presentation/lib/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
      onClick={toggle}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-xl border border-soft bg-surface text-strong transition-colors hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-200",
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className={cn("h-5 w-5", isDark && "hidden")}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
        />
      </svg>
      <svg
        viewBox="0 0 24 24"
        className={cn("h-5 w-5", !isDark && "hidden")}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="12" cy="12" r="4" />
        <path
          strokeLinecap="round"
          d="M12 3v1.5M12 19.5V21M3 12h1.5M19.5 12H21M5.6 5.6l1.1 1.1M17.3 17.3l1.1 1.1M5.6 18.4l1.1-1.1M17.3 6.7l1.1-1.1"
        />
      </svg>
    </button>
  );
}
