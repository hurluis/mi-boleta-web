import type { ReactNode } from "react";
import { cn } from "@/presentation/lib/cn";

type Variant = "error" | "success" | "info" | "warning";

const styles: Record<Variant, string> = {
  error:
    "border-rose-400/30 bg-rose-50 text-rose-900 dark:bg-rose-500/10 dark:text-rose-200",
  success:
    "border-emerald-400/30 bg-emerald-50 text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-200",
  info: "border-brand-400/30 bg-brand-50 text-brand-900 dark:bg-brand-500/10 dark:text-brand-100",
  warning:
    "border-amber-400/30 bg-amber-50 text-amber-900 dark:bg-amber-500/10 dark:text-amber-100",
};

export function Alert({
  variant = "info",
  children,
  className,
}: {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-xl border px-4 py-3 text-sm font-medium animate-in",
        styles[variant],
        className,
      )}
    >
      {children}
    </div>
  );
}
