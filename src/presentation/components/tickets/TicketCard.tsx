"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Ticket } from "@/domain/entities/Ticket";
import {
  GameTypeBadge,
  StatusBadge,
} from "@/presentation/components/ui/Badge";
import { Button } from "@/presentation/components/ui/Button";
import {
  formatCurrency,
  formatDateShort,
} from "@/presentation/lib/formatters";
import { cn } from "@/presentation/lib/cn";

type TicketCardProps = {
  ticket: Ticket;
  onDelete: (ticket: Ticket) => void;
};

const statusAccent: Record<Ticket["status"], string> = {
  Pendiente: "border-l-brand-500",
  Ganado: "border-l-emerald-500",
  Perdido: "border-l-rose-500",
};

const statusGlow: Record<Ticket["status"], string> = {
  Pendiente:
    "group-hover:shadow-[0_0_0_1px_rgb(124_77_255/0.12),0_12px_40px_-12px_rgb(124_77_255/0.35)]",
  Ganado:
    "group-hover:shadow-[0_0_0_1px_rgb(16_185_129/0.15),0_12px_40px_-12px_rgb(16_185_129/0.25)]",
  Perdido:
    "group-hover:shadow-[0_0_0_1px_rgb(244_63_94/0.12),0_12px_40px_-12px_rgb(244_63_94/0.2)]",
};

const statusTopBar: Record<Ticket["status"], string> = {
  Pendiente: "from-brand-400 via-brand-500 to-gold-400",
  Ganado: "from-emerald-400 via-emerald-500 to-teal-400",
  Perdido: "from-rose-400 via-rose-500 to-pink-400",
};

const numberBall: Record<Ticket["status"], string> = {
  Pendiente:
    "border-brand-400/50 bg-brand-500/8 text-brand-700 dark:text-brand-200",
  Ganado:
    "border-emerald-400/60 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  Perdido:
    "border-rose-400/40 bg-rose-500/8 text-rose-600 dark:text-rose-300 opacity-60",
};

function useCountdown(targetDate: Date): string | null {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  useEffect(() => {
    function compute() {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft(null);
        return;
      }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      if (days > 0) setTimeLeft(days + "d " + hours + "h");
      else if (hours > 0) setTimeLeft(hours + "h " + mins + "m");
      else setTimeLeft(mins + "m");
    }
    compute();
    const id = setInterval(compute, 30000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}

const linkClass =
  "inline-flex h-9 items-center justify-center rounded-xl px-3 text-xs font-medium transition-colors ring-focus";

export function TicketCard({ ticket, onDelete }: TicketCardProps) {
  const [now] = useState(Date.now);
  const countdown = useCountdown(ticket.gameDate);
  const isFuture = ticket.gameDate.getTime() > now;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-soft border-l-4 bg-surface shadow-card transition-all duration-200 hover:-translate-y-0.5",
        statusAccent[ticket.status],
        statusGlow[ticket.status],
      )}
    >
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r opacity-0 transition-opacity duration-200 group-hover:opacity-100",
          statusTopBar[ticket.status],
        )}
        aria-hidden="true"
      />

      <div className="flex items-start justify-between gap-3 p-5 pb-3">
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-strong">
            {ticket.title}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <GameTypeBadge gameType={ticket.gameType} />
            <StatusBadge status={ticket.status} />
          </div>
        </div>

        {ticket.gameNumber && (
          <div
            aria-label={"Numero jugado: " + ticket.gameNumber}
            className={cn(
              "relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 font-mono text-xs font-bold shadow-inner",
              numberBall[ticket.status],
            )}
          >
            <span className="leading-none truncate max-w-[38px] text-center px-0.5">
              {ticket.gameNumber}
            </span>
            <span
              aria-hidden="true"
              className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-white/60 dark:bg-white/25 blur-[1px]"
            />
          </div>
        )}
      </div>

      {isFuture && ticket.status === "Pendiente" && countdown && (
        <div className="mx-5 mb-3 flex items-center gap-1.5 rounded-xl bg-brand-500/8 px-3 py-2 dark:bg-brand-500/12">
          <svg
            viewBox="0 0 16 16"
            className="h-3.5 w-3.5 flex-shrink-0 text-brand-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            aria-hidden="true"
          >
            <circle cx="8" cy="8" r="6.5" />
            <path strokeLinecap="round" d="M8 5v3l2 1.5" />
          </svg>
          <span className="font-mono text-xs font-semibold text-brand-700 dark:text-brand-200">
            Sortea en {countdown}
          </span>
        </div>
      )}

      <dl className="grid flex-1 grid-cols-2 gap-x-4 gap-y-3 border-t border-soft px-5 py-4 text-sm">
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-widest text-muted">
            Fecha
          </dt>
          <dd className="mt-0.5 font-medium tabular-nums text-strong">
            {formatDateShort(ticket.gameDate)}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-widest text-muted">
            Apostado
          </dt>
          <dd className="mt-0.5 font-medium tabular-nums text-strong">
            {formatCurrency(ticket.amount)}
          </dd>
        </div>
        {ticket.place && (
          <div className="col-span-2">
            <dt className="text-[10px] font-semibold uppercase tracking-widest text-muted">
              Lugar
            </dt>
            <dd className="mt-0.5 truncate font-medium text-strong">
              {ticket.place}
            </dd>
          </div>
        )}
      </dl>

      {ticket.notes && (
        <p className="line-clamp-2 border-t border-soft px-5 py-2.5 text-xs italic text-muted">
          &ldquo;{ticket.notes}&rdquo;
        </p>
      )}

      <div className="flex items-center justify-end gap-2 border-t border-soft px-5 py-3">
        <Link
          href={"/tickets/" + ticket.id}
          className={linkClass + " text-muted hover:bg-ink-100 hover:text-strong dark:hover:bg-white/5"}
        >
          Ver
        </Link>
        <Link
          href={"/tickets/" + ticket.id + "/edit"}
          className={linkClass + " border border-soft text-strong hover:border-brand-400/60 hover:text-brand-700 dark:hover:text-brand-200"}
        >
          Editar
        </Link>
        <Button
          variant="danger"
          size="sm"
          className="text-xs"
          onClick={() => onDelete(ticket)}
        >
          Eliminar
        </Button>
      </div>
    </article>
  );
}
