"use client";

import Link from "next/link";
import { differenceInCalendarDays, format, isValid, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarDays, Sparkles } from "lucide-react";
import type { Ticket } from "@/domain/entities/Ticket";
import { useColombiaHolidaysQuery } from "@/presentation/hooks/useColombiaHolidays";
import { formatDateShort } from "@/presentation/lib/formatters";

type SmartCalendarPanelProps = {
  upcomingTickets: Ticket[];
};

function dateKey(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatHolidayDate(value: string): string {
  const date = parseISO(value);
  if (!isValid(date)) return value;
  return format(date, "d MMM yyyy", { locale: es });
}

export function SmartCalendarPanel({ upcomingTickets }: SmartCalendarPanelProps) {
  const { data, isLoading, isError } = useColombiaHolidaysQuery();
  const todayKey = dateKey(new Date());
  const holidays = data?.data ?? [];
  const upcomingHolidays = holidays
    .filter((holiday) => holiday.date >= todayKey)
    .sort((a, b) => a.date.localeCompare(b.date));
  const holidayByDate = new Map(holidays.map((holiday) => [holiday.date, holiday]));
  const ticketsOnHoliday = upcomingTickets.filter((ticket) =>
    holidayByDate.has(dateKey(ticket.gameDate)),
  );
  const nextHoliday = upcomingHolidays[0];
  const daysToNextHoliday = nextHoliday
    ? differenceInCalendarDays(parseISO(nextHoliday.date), new Date())
    : null;

  return (
    <section
      className="overflow-hidden rounded-lg border border-soft bg-surface shadow-card"
      aria-label="Calendario inteligente"
    >
      <div className="flex flex-col gap-3 border-b border-soft px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-300">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-500 dark:text-brand-300">
              Plus con API externa
            </p>
            <h2 className="font-display text-lg font-semibold text-strong">
              Calendario inteligente
            </h2>
            <p className="text-xs text-muted">
              Cruza tus sorteos con festivos oficiales de Colombia.
            </p>
          </div>
        </div>
        <span className="inline-flex w-fit rounded-full border border-gold-400/25 bg-gold-400/10 px-3 py-1 text-xs font-semibold text-gold-700 dark:text-gold-200">
          Fuente: {data?.source ?? "Nager.Date"}
        </span>
      </div>

      <div className="grid gap-4 p-5 md:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-soft bg-elevated p-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-teal-500" aria-hidden="true" />
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">
              Próximo festivo
            </p>
          </div>
          {isLoading ? (
            <div className="mt-4 h-20 animate-pulse rounded-lg bg-muted/10" />
          ) : isError || !nextHoliday ? (
            <p className="mt-3 text-sm text-muted">
              No se pudo cargar el calendario por ahora.
            </p>
          ) : (
            <>
              <p className="mt-3 font-display text-2xl font-bold text-strong">
                {nextHoliday.localName}
              </p>
              <p className="mt-1 text-sm text-muted">
                {formatHolidayDate(nextHoliday.date)}
                {daysToNextHoliday !== null && daysToNextHoliday >= 0
                  ? ` · en ${daysToNextHoliday} días`
                  : ""}
              </p>
            </>
          )}
        </div>

        <div className="rounded-lg border border-soft bg-elevated p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                Alertas de sorteo
              </p>
              <p className="mt-2 text-sm text-muted">
                {ticketsOnHoliday.length > 0
                  ? "Tienes sorteos que caen en festivo. Vale la pena revisarlos con lupa."
                  : "No hay sorteos futuros en festivos nacionales."}
              </p>
            </div>
            <span className="rounded-lg bg-brand-500/10 px-3 py-2 font-display text-2xl font-bold text-brand-700 dark:text-brand-200">
              {ticketsOnHoliday.length}
            </span>
          </div>

          <div className="mt-4 space-y-2">
            {ticketsOnHoliday.slice(0, 3).map((ticket) => {
              const holiday = holidayByDate.get(dateKey(ticket.gameDate));
              return (
                <Link
                  key={ticket.id}
                  href={`/tickets/${ticket.id}`}
                  className="flex items-center justify-between gap-3 rounded-lg border border-soft bg-surface px-3 py-2 ring-focus transition hover:border-brand-400/40"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-strong">
                      {ticket.title}
                    </span>
                    <span className="block truncate text-xs text-muted">
                      {holiday?.localName ?? "Festivo"} · {formatDateShort(ticket.gameDate)}
                    </span>
                  </span>
                  <span className="font-mono text-xs text-muted">
                    {ticket.gameNumber ? `#${ticket.gameNumber}` : ticket.gameType}
                  </span>
                </Link>
              );
            })}

            {ticketsOnHoliday.length === 0 && (
              <div className="rounded-lg border border-dashed border-soft px-3 py-4 text-sm text-muted">
                Los próximos festivos aparecerán aquí como referencia para planear tus revisiones.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
