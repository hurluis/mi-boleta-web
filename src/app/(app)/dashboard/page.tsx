"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  ListChecks,
  Plus,
  Trophy,
} from "lucide-react";
import { Container } from "@/presentation/components/layout/Container";
import { PageHeader } from "@/presentation/components/layout/PageHeader";
import { StatCard } from "@/presentation/components/dashboard/StatCard";
import { SmartCalendarPanel } from "@/presentation/components/dashboard/SmartCalendarPanel";
import { TicketIntelligencePanel } from "@/presentation/components/dashboard/TicketIntelligencePanel";
import { LotteryVerifierPanel } from "@/presentation/components/dashboard/LotteryVerifierPanel";
import { TicketCardSkeleton } from "@/presentation/components/tickets/TicketCardSkeleton";
import { EmptyState } from "@/presentation/components/ui/EmptyState";
import { Alert } from "@/presentation/components/ui/Alert";
import {
  GameTypeBadge,
  StatusBadge,
} from "@/presentation/components/ui/Badge";
import {
  formatCurrency,
  formatDateShort,
  formatRelative,
} from "@/presentation/lib/formatters";
import { useTicketsQuery } from "@/presentation/hooks/useTickets";
import { useAuth } from "@/presentation/hooks/useAuth";

export default function DashboardPage() {
  const { user } = useAuth();
  const [now] = useState(() => Date.now());
  const { data, isLoading, isError, error, refetch } = useTicketsQuery({
    pageSize: 100,
  });

  const stats = useMemo(() => {
    const tickets = data?.items ?? [];
    const upcoming = tickets
      .filter((t) => t.gameDate.getTime() > now)
      .sort((a, b) => a.gameDate.getTime() - b.gameDate.getTime());
    const pending = tickets.filter((t) => t.status === "Pendiente");
    const won = tickets.filter((t) => t.status === "Ganado");
    const lost = tickets.filter((t) => t.status === "Perdido");
    return { tickets, upcoming, pending, won, lost };
  }, [data, now]);

  return (
    <Container size="wide" className="space-y-8">
      <PageHeader
        eyebrow={`Hola, ${user?.name?.split(" ")[0] ?? ""}`}
        title="Tu dashboard de la suerte"
        description="Un vistazo rápido a tus boletas activas, sorteos próximos y tu historial."
        actions={
          <Link
            href="/tickets/new"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-gradient-to-br from-brand-500 via-teal-500 to-brand-700 px-5 text-sm font-medium text-white shadow-glow transition-all hover:brightness-110"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Nueva boleta
          </Link>
        }
      />

      {isError && (
        <Alert variant="error">
          {error instanceof Error ? error.message : "No se pudo cargar la información."}{" "}
          <button
            type="button"
            className="ml-2 font-semibold underline"
            onClick={() => refetch()}
          >
            Reintentar
          </button>
        </Alert>
      )}

      <section
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        aria-label="Resumen"
      >
        <StatCard
          label="Total registradas"
          value={isLoading ? "..." : stats.tickets.length}
          hint="Acumulado en tu cuenta"
          tone="brand"
          icon={<ListChecks className="h-5 w-5" />}
        />
        <StatCard
          label="Próximos sorteos"
          value={isLoading ? "..." : stats.upcoming.length}
          hint="Fechas a futuro"
          tone="gold"
          icon={<CalendarDays className="h-5 w-5" />}
        />
        <StatCard
          label="Pendientes"
          value={isLoading ? "..." : stats.pending.length}
          hint="Esperando resultado"
          tone="emerald"
          icon={<Clock3 className="h-5 w-5" />}
        />
        <StatCard
          label="Ganados"
          value={isLoading ? "..." : stats.won.length}
          hint={`${stats.lost.length} perdidos`}
          tone="rose"
          icon={<Trophy className="h-5 w-5" />}
        />
      </section>

      <TicketIntelligencePanel tickets={stats.tickets} />

      <LotteryVerifierPanel tickets={stats.tickets} />

      <SmartCalendarPanel upcomingTickets={stats.upcoming} />

      <section className="grid gap-6 lg:grid-cols-2" aria-label="Listados">
        <div className="rounded-lg border border-soft bg-surface shadow-card">
          <div className="flex items-center justify-between border-b border-soft px-5 py-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-strong">
                Próximos sorteos
              </h2>
              <p className="text-xs text-muted">Ordenados por fecha</p>
            </div>
            <Link
              href="/tickets"
              className="text-xs font-semibold text-brand-600 hover:underline dark:text-brand-300"
            >
              <span className="inline-flex items-center gap-1">
                Ver todo <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </Link>
          </div>
          <ul className="divide-y divide-soft">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <li key={i} className="px-5 py-4">
                    <TicketCardSkeleton />
                  </li>
                ))
              : stats.upcoming.slice(0, 5).map((t) => (
                  <li key={t.id} className="px-5 py-4">
                    <Link
                      href={`/tickets/${t.id}`}
                      className="flex items-center justify-between gap-3 rounded-lg ring-focus"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium text-strong">{t.title}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                          <GameTypeBadge gameType={t.gameType} />
                          <span className="text-xs text-muted">
                            {formatRelative(t.gameDate)}
                          </span>
                        </div>
                      </div>
                      <span className="rounded-lg bg-brand-500/10 px-2.5 py-1.5 text-xs font-semibold text-brand-700 dark:text-brand-200">
                        {formatDateShort(t.gameDate)}
                      </span>
                    </Link>
                  </li>
                ))}
            {!isLoading && stats.upcoming.length === 0 && (
              <li className="px-5 py-10">
                <EmptyState
                  title="Sin sorteos próximos"
                  description="Cuando agregues una boleta con fecha futura aparecerá aquí."
                  action={
                    <Link
                      href="/tickets/new"
                      className="inline-flex h-10 items-center rounded-lg bg-gradient-to-br from-brand-500 via-teal-500 to-brand-700 px-4 text-sm font-medium text-white shadow-glow"
                    >
                      Registrar boleta
                    </Link>
                  }
                />
              </li>
            )}
          </ul>
        </div>

        <div className="rounded-lg border border-soft bg-surface shadow-card">
          <div className="flex items-center justify-between border-b border-soft px-5 py-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-strong">
                Boletas pendientes
              </h2>
              <p className="text-xs text-muted">Aún por revisar</p>
            </div>
            <Link
              href="/tickets"
              className="text-xs font-semibold text-brand-600 hover:underline dark:text-brand-300"
            >
              <span className="inline-flex items-center gap-1">
                Ver todo <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </Link>
          </div>
          <ul className="divide-y divide-soft">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <li key={i} className="px-5 py-4">
                    <TicketCardSkeleton />
                  </li>
                ))
              : stats.pending.slice(0, 5).map((t) => (
                  <li key={t.id} className="px-5 py-4">
                    <Link
                      href={`/tickets/${t.id}`}
                      className="flex items-center justify-between gap-3 rounded-lg ring-focus"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium text-strong">{t.title}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                          <StatusBadge status={t.status} />
                          {t.gameNumber && (
                            <span className="font-mono text-xs text-muted">
                              #{t.gameNumber}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs font-medium text-strong">
                        {formatCurrency(t.amount)}
                      </span>
                    </Link>
                  </li>
                ))}
            {!isLoading && stats.pending.length === 0 && (
              <li className="px-5 py-10">
                <EmptyState
                  title="No hay pendientes"
                  description="Cuando registres una boleta con estado Pendiente aparecerá aquí."
                  action={
                    <Link
                      href="/tickets/new"
                      className="inline-flex h-10 items-center rounded-lg bg-brand-500/10 px-4 text-sm font-medium text-brand-700 dark:text-brand-200"
                    >
                      Registrar boleta
                    </Link>
                  }
                />
              </li>
            )}
          </ul>
        </div>
      </section>
    </Container>
  );
}
