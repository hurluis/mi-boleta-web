"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  CalendarPlus,
  Flame,
  Radar,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { Ticket } from "@/domain/entities/Ticket";
import { Button } from "@/presentation/components/ui/Button";
import { formatCurrency, formatDateShort } from "@/presentation/lib/formatters";
import {
  buildTicketIntelligence,
  buildTicketsCalendar,
  type PriorityLevel,
} from "@/presentation/lib/ticketIntelligence";
import { useColombiaHolidaysQuery } from "@/presentation/hooks/useColombiaHolidays";
import { cn } from "@/presentation/lib/cn";

type Props = {
  tickets: Ticket[];
};

const levelStyles: Record<PriorityLevel, string> = {
  Alta: "bg-rose-500/12 text-rose-600 ring-rose-400/25 dark:text-rose-200",
  Media: "bg-gold-400/12 text-gold-700 ring-gold-400/25 dark:text-gold-200",
  Baja: "bg-teal-500/12 text-teal-700 ring-teal-400/25 dark:text-teal-200",
};

function downloadTextFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function TicketIntelligencePanel({ tickets }: Props) {
  const { data } = useColombiaHolidaysQuery();
  const intelligence = buildTicketIntelligence(tickets, data?.data ?? []);
  const topInsights = intelligence.insights.slice(0, 4);

  const handleExport = () => {
    if (intelligence.exportableTickets.length === 0) return;
    downloadTextFile(
      "mi-boleta-agenda.ics",
      buildTicketsCalendar(intelligence.exportableTickets),
      "text/calendar;charset=utf-8",
    );
  };

  return (
    <section
      className="overflow-hidden rounded-lg border border-soft bg-surface shadow-card"
      aria-label="Radar inteligente de boletas"
    >
      <div className="border-b border-soft px-5 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-brand-500/10 text-brand-600 ring-1 ring-brand-400/20 dark:text-brand-200">
              <Radar className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-500 dark:text-brand-300">
                Radar inteligente
              </p>
              <h2 className="font-display text-lg font-semibold text-strong">
                Prioridad y agenda automática
              </h2>
              <p className="max-w-2xl text-xs text-muted">
                Analiza tus boletas pendientes con fechas, montos y festivos de Colombia.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={intelligence.exportableTickets.length === 0}
            title="Descargar agenda para Google Calendar, Outlook o Apple Calendar"
            leftIcon={<CalendarPlus className="h-4 w-4" />}
          >
            Exportar agenda
          </Button>
        </div>
      </div>

      <div className="grid gap-4 p-5 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <Metric
            icon={<Flame className="h-4 w-4" />}
            label="Alta prioridad"
            value={intelligence.urgentCount}
            tone="rose"
          />
          <Metric
            icon={<Sparkles className="h-4 w-4" />}
            label="En festivos"
            value={intelligence.holidayCollisionCount}
            tone="gold"
          />
          <Metric
            icon={<ShieldCheck className="h-4 w-4" />}
            label="Pendiente"
            value={formatCurrency(intelligence.pendingAmount)}
            tone="teal"
          />
        </div>

        <div className="rounded-lg border border-soft bg-elevated p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                Cola de atención
              </p>
              <p className="mt-1 text-sm text-muted">
                {topInsights.length > 0
                  ? "Ordenada por urgencia, monto y cruces especiales."
                  : "Sin boletas pendientes para analizar."}
              </p>
            </div>
            {intelligence.overdueCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-600 dark:text-rose-200">
                <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                {intelligence.overdueCount} vencida
              </span>
            )}
          </div>

          <div className="mt-4 space-y-3">
            {topInsights.map((insight) => (
              <Link
                key={insight.ticket.id}
                href={`/tickets/${insight.ticket.id}`}
                className="block rounded-lg border border-soft bg-surface p-3 ring-focus transition hover:border-brand-400/50"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-strong">
                        {insight.ticket.title}
                      </p>
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1",
                          levelStyles[insight.level],
                        )}
                      >
                        {insight.level}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted">
                      {formatDateShort(insight.ticket.gameDate)}
                      {insight.daysLeft >= 0
                        ? ` · faltan ${insight.daysLeft} días`
                        : ` · vencida hace ${Math.abs(insight.daysLeft)} días`}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {insight.reasons.map((reason) => (
                        <span
                          key={reason}
                          className="rounded-full bg-ink-100/70 px-2 py-0.5 text-[11px] font-medium text-muted dark:bg-white/5"
                        >
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="min-w-[92px]">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-muted">
                      <span>Score</span>
                      <span>{insight.score}/100</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink-100 dark:bg-white/10">
                      <span
                        className="block h-full rounded-full bg-gradient-to-r from-brand-500 via-teal-500 to-gold-400"
                        style={{ width: `${insight.score}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {topInsights.length === 0 && (
              <div className="rounded-lg border border-dashed border-soft px-4 py-6 text-center text-sm text-muted">
                Cuando tengas boletas pendientes, el radar calculará prioridades.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  tone: "rose" | "gold" | "teal";
}) {
  const toneClass = {
    rose: "text-rose-600 bg-rose-500/10 dark:text-rose-200",
    gold: "text-gold-700 bg-gold-400/10 dark:text-gold-200",
    teal: "text-teal-700 bg-teal-500/10 dark:text-teal-200",
  }[tone];

  return (
    <div className="rounded-lg border border-soft bg-elevated p-4">
      <div className="flex items-center gap-2">
        <span className={cn("grid h-8 w-8 place-items-center rounded-lg", toneClass)}>
          {icon}
        </span>
        <span className="text-xs font-semibold uppercase tracking-widest text-muted">
          {label}
        </span>
      </div>
      <p className="mt-3 font-display text-2xl font-bold text-strong">{value}</p>
    </div>
  );
}
