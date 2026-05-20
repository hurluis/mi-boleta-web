import { cn } from "@/presentation/lib/cn";

export function Logo({
  className,
  withText = true,
}: {
  className?: string;
  withText?: boolean;
}) {
  return (
    <div className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        aria-hidden="true"
        className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 text-white shadow-glow"
      >
        <span className="absolute -top-3 -right-3 h-7 w-7 rounded-full bg-gold-400/70 blur-md" />
        <svg
          viewBox="0 0 24 24"
          className="relative h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="2 2"
            d="M12 7v10"
          />
        </svg>
      </span>
      {withText && (
        <div className="flex flex-col leading-tight">
          <span className="font-display text-sm font-semibold text-strong">
            Mi Boleta
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted">
            ¿Y si sí me lo gané?
          </span>
        </div>
      )}
    </div>
  );
}
