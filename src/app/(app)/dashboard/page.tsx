"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Container } from "@/presentation/components/layout/Container";
import { PageHeader } from "@/presentation/components/layout/PageHeader";
import { StatCard } from "@/presentation/components/dashboard/StatCard";
import { SmartCalendarPanel } from "@/presentation/components/dashboard/SmartCalendarPanel";
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
        eyebrow={`Hola, ${user?.name?.split(" ")[0] ?? ""} 👋`}
        title="Tu dashboard de la suerte"
        description="Un vistazo rápido a tus boletas activas, sorteos próximos y tu historial."
        actions={
          <Link
            href="/tickets/new"
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 px-5 text-sm font-medium text-white shadow-glow transition-all hover:brightness-110"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
              <path d="M10 3a1 1 0 0 1 1 1v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H4a1 1 0 1 1 0-2h5V4a1 1 0 0 1 1-1Z" />
            </svg>
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

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Resumen">
        <StatCard
          label="Total registradas"
          value={isLoading ? "—" : stats.tickets.length}
          hint={`Acumulado en tu cuenta`}
          tone="brand"
          icon={
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h10" />
            </svg>
          }
        />
        <StatCard
          label="Próximos sorteos"
          value={isLoading ? "—" : stats.upcoming.length}
          hint="Fechas a futuro"
          tone="gold"
          icon={
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path strokeLinecap="round" d="M8 3v4M16 3v4M3 11h18" />
            </svg>
          }
        />
        <StatCard
          label="Pendientes"
          value={isLoading ? "—" : stats.pending.length}
          hint="Esperando resultado"
          tone="emerald"
          icon={
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="9" />
              <path strokeLinecap="round" d="M12 7v5l3 2" />
            </svg>
          }
        />
        <StatCard
          label="Ganados"
          value={isLoading ? "—" : stats.won.length}
          hint={`${stats.lost.length} perdidos`}
          tone="rose"
          icon={
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8M12 17v4M7 4h10v3a5 5 0 0 1-10 0V4Zm10 1h3a3 3 0 0 1-3 3M7 5H4a3 3 0 0 0 3 3" />
            </svg>
          }
        />
      </section>

      <SmartCalendarPanel upcomingTickets={stats.upcoming} />

      <section className="grid gap-6 lg:grid-cols-2" aria-label="Listados">
        <div className="rounded-2xl border border-soft bg-surface shadow-card">
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
              Ver todo →
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
                      className="inline-flex h-10 items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 px-4 text-sm font-medium text-white shadow-glow"
                    >
                      Registrar boleta
                    </Link>
                  }
                />
              </li>
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-soft bg-surface shadow-card">
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
              Ver todo →
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
                      className="inline-flex h-10 items-center rounded-xl bg-brand-500/10 px-4 text-sm font-medium text-brand-700 dark:text-brand-200"
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
