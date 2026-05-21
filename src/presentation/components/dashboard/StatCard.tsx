import type { ReactNode } from "react";
import { cn } from "@/presentation/lib/cn";

type StatCardProps = {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
  tone?: "brand" | "gold" | "emerald" | "rose";
};

const toneConfig: Record<
  NonNullable<StatCardProps["tone"]>,
  { blob: string; icon: string; border: string }
> = {
  brand: {
    blob: "from-brand-500/30 to-brand-700/10",
    icon: "bg-brand-500/10 text-brand-600 dark:text-brand-300 ring-1 ring-brand-400/20",
    border: "group-hover:border-brand-400/40",
  },
  gold: {
    blob: "from-gold-400/30 to-gold-600/10",
    icon: "bg-gold-400/10 text-gold-600 dark:text-gold-300 ring-1 ring-gold-400/20",
    border: "group-hover:border-gold-400/40",
  },
  emerald: {
    blob: "from-emerald-400/30 to-emerald-600/10",
    icon: "bg-emerald-400/10 text-emerald-600 dark:text-emerald-300 ring-1 ring-emerald-400/20",
    border: "group-hover:border-emerald-400/40",
  },
  rose: {
    blob: "from-rose-400/30 to-rose-600/10",
    icon: "bg-rose-400/10 text-rose-600 dark:text-rose-300 ring-1 ring-rose-400/20",
    border: "group-hover:border-rose-400/40",
  },
};

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "brand",
}: StatCardProps) {
  const cfg = toneConfig[tone];

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border border-soft bg-surface p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5",
        cfg.border,
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gradient-to-br blur-2xl opacity-70",
          cfg.blob,
        )}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">
            {label}
          </p>
          <p className="mt-2 font-display text-3xl font-bold tabular-nums text-strong">
            {value}
          </p>
          {hint && (
            <p className="mt-1 text-xs text-muted">{hint}</p>
          )}
        </div>

        {icon && (
          <div
            aria-hidden="true"
            className={cn(
              "grid h-11 w-11 flex-shrink-0 place-items-center rounded-lg transition-transform duration-200 group-hover:scale-110",
              cfg.icon,
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
