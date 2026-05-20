import type { ReactNode } from "react";
import type { TicketStatus, GameType } from "@/domain/entities/Ticket";
import { cn } from "@/presentation/lib/cn";

const STATUS_STYLES: Record<TicketStatus, string> = {
  Pendiente:
    "bg-amber-400/15 text-amber-700 ring-1 ring-amber-400/30 dark:text-amber-200",
  Ganado:
    "bg-emerald-400/15 text-emerald-700 ring-1 ring-emerald-400/30 dark:text-emerald-200",
  Perdido:
    "bg-rose-400/15 text-rose-700 ring-1 ring-rose-400/30 dark:text-rose-200",
};

const GAME_TYPE_EMOJI: Record<GameType, string> = {
  Lotería: "🎰",
  Rifa: "🎟️",
  Sorteo: "🎁",
  Boleta: "🎫",
  "Juego ocasional": "🎲",
};

export function StatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        STATUS_STYLES[status],
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "Pendiente" && "bg-amber-500",
          status === "Ganado" && "bg-emerald-500",
          status === "Perdido" && "bg-rose-500",
        )}
      />
      {status}
    </span>
  );
}

export function GameTypeBadge({ gameType }: { gameType: GameType }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-100/70 px-2.5 py-1 text-xs font-medium text-strong dark:bg-white/5">
      <span aria-hidden="true">{GAME_TYPE_EMOJI[gameType]}</span>
      {gameType}
    </span>
  );
}

export function Chip({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-ink-100/70 px-2.5 py-1 text-xs font-medium text-strong dark:bg-white/5",
        className,
      )}
    >
      {children}
    </span>
  );
}
