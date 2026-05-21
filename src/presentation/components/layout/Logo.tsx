import { cn } from "@/presentation/lib/cn";
import { Ticket } from "lucide-react";

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
        className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-lg bg-gradient-to-br from-brand-500 via-teal-500 to-gold-500 text-white shadow-glow"
      >
        <Ticket className="relative h-5 w-5" strokeWidth={2.2} />
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
