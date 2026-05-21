"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  BadgeCheck,
  ClipboardCheck,
  DatabaseZap,
  RefreshCcw,
  SearchCheck,
  ShieldQuestion,
  Trophy,
} from "lucide-react";
import type { Ticket } from "@/domain/entities/Ticket";
import { Button } from "@/presentation/components/ui/Button";
import { useLotteryResultsQuery } from "@/presentation/hooks/useLotteryResults";
import {
  buildLotteryVerifierSummary,
  type LotteryMatchKind,
} from "@/presentation/lib/lotteryVerifier";
import { cn } from "@/presentation/lib/cn";

type Props = {
  tickets: Ticket[];
};

const kindStyles: Record<LotteryMatchKind, string> = {
  Exacta: "bg-emerald-500/12 text-emerald-700 ring-emerald-400/25 dark:text-emerald-200",
  "Últimos 3": "bg-teal-500/12 text-teal-700 ring-teal-400/25 dark:text-teal-200",
  "Últimos 2": "bg-brand-500/12 text-brand-700 ring-brand-400/25 dark:text-brand-200",
  Casi: "bg-gold-400/12 text-gold-700 ring-gold-400/25 dark:text-gold-200",
  "Sin coincidencia": "bg-ink-500/10 text-muted ring-ink-400/20",
  "Sin resultados": "bg-rose-500/10 text-rose-600 ring-rose-400/20 dark:text-rose-200",
};

export function LotteryVerifierPanel({ tickets }: Props) {
  const query = useLotteryResultsQuery(tickets);
  const summary = buildLotteryVerifierSummary(tickets, query.data?.data ?? []);
  const topVerifications = summary.verifications.slice(0, 5);

  return (
    <section
      className="overflow-hidden rounded-lg border border-soft bg-surface shadow-card"
      aria-label="Verificador oficial de resultados"
    >
      <div className="border-b border-soft px-5 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-400/20 dark:text-emerald-200">
              <SearchCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-300">
                API de resultados reales
              </p>
              <h2 className="font-display text-lg font-semibold text-strong">
                Verificador de loterías y chances
              </h2>
              <p className="max-w-2xl text-xs text-muted">
                Cruza tus números guardados con resultados publicados por fecha.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => query.refetch()}
            loading={query.isFetching}
            leftIcon={<RefreshCcw className="h-4 w-4" />}
          >
            Verificar ahora
          </Button>
        </div>
      </div>

      <div className="grid gap-4 p-5 lg:grid-cols-[0.78fr_1.22fr]">
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <Metric
            icon={<ClipboardCheck className="h-4 w-4" />}
            label="Por revisar"
            value={summary.dueCount}
          />
          <Metric
            icon={<Trophy className="h-4 w-4" />}
            label="Coincidencias"
            value={summary.strongMatchCount}
          />
          <Metric
            icon={<DatabaseZap className="h-4 w-4" />}
            label="Resultados API"
            value={summary.latestDraws.length}
          />
        </div>

        <div className="rounded-lg border border-soft bg-elevated p-4">
          {query.isLoading ? (
            <div className="space-y-3">
              <div className="h-5 w-48 animate-pulse rounded bg-ink-100 dark:bg-white/10" />
              <div className="h-20 animate-pulse rounded-lg bg-ink-100 dark:bg-white/10" />
              <div className="h-20 animate-pulse rounded-lg bg-ink-100 dark:bg-white/10" />
            </div>
          ) : query.isError ? (
            <div className="flex items-start gap-3 rounded-lg border border-rose-400/25 bg-rose-500/10 p-4 text-sm text-rose-700 dark:text-rose-200">
              <ShieldQuestion className="mt-0.5 h-5 w-5 flex-shrink-0" />
              <div>
                No se pudieron consultar los resultados externos.
                <button
                  type="button"
                  className="ml-2 font-semibold underline"
                  onClick={() => query.refetch()}
                >
                  Reintentar
                </button>
              </div>
            </div>
          ) : topVerifications.length > 0 ? (
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                    Auditoría de tus números
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    Fuente: {query.data?.source ?? "api-resultadosloterias.com"}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-200">
                  {summary.checkedCount} verificadas
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {topVerifications.map((item) => (
                  <Link
                    key={item.ticket.id}
                    href={`/tickets/${item.ticket.id}`}
                    className="block rounded-lg border border-soft bg-surface p-3 ring-focus transition hover:border-emerald-400/50"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-sm font-semibold text-strong">
                            {item.ticket.title}
                          </p>
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1",
                              kindStyles[item.kind],
                            )}
                          >
                            {item.kind}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-muted">
                          Número #{item.ticket.gameNumber} · fecha {item.date}
                        </p>
                        <p className="mt-2 text-sm text-strong">{item.explanation}</p>
                      </div>

                      {item.matchedDraw && (
                        <div className="rounded-lg border border-soft bg-elevated px-3 py-2 text-right">
                          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">
                            {item.matchedDraw.lottery}
                          </p>
                          <p className="font-mono text-lg font-bold text-strong">
                            {item.matchedDraw.result}
                          </p>
                          {item.matchedDraw.series && (
                            <p className="text-xs text-muted">
                              Serie {item.matchedDraw.series}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                    Monitor preparado
                  </p>
                  <h3 className="mt-2 font-display text-xl font-semibold text-strong">
                    No hay boletas vencidas por verificar
                  </h3>
                  <p className="mt-1 text-sm text-muted">
                    {summary.futureWatchCount > 0
                      ? `${summary.futureWatchCount} boleta pendiente quedará lista para verificación cuando llegue su fecha.`
                      : "Registra una boleta con número y fecha para activar el cruce automático."}
                  </p>
                </div>
                <BadgeCheck className="h-6 w-6 text-emerald-500" aria-hidden="true" />
              </div>

              <div className="mt-4 rounded-lg border border-soft bg-surface p-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                  Resultados recientes consultados
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {summary.latestDraws.slice(0, 4).map((draw) => (
                    <div
                      key={`${draw.slug}-${draw.result}-${draw.series ?? ""}`}
                      className="flex items-center justify-between gap-3 rounded-lg bg-elevated px-3 py-2"
                    >
                      <span className="truncate text-xs font-medium text-strong">
                        {draw.lottery}
                      </span>
                      <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-300">
                        {draw.result}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-soft bg-elevated p-4">
      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-300">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-widest text-muted">
          {label}
        </span>
      </div>
      <p className="mt-3 font-display text-2xl font-bold text-strong">{value}</p>
    </div>
  );
}
