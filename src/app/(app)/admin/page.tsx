"use client";

import { useMemo, useState } from "react";
import { Container } from "@/presentation/components/layout/Container";
import { PageHeader } from "@/presentation/components/layout/PageHeader";
import {
  TicketFiltersBar,
  type TicketFilterValues,
} from "@/presentation/components/tickets/TicketFilters";
import { Pagination } from "@/presentation/components/tickets/Pagination";
import { EmptyState } from "@/presentation/components/ui/EmptyState";
import { Alert } from "@/presentation/components/ui/Alert";
import { Skeleton } from "@/presentation/components/ui/Skeleton";
import { Input } from "@/presentation/components/ui/Input";
import { Label } from "@/presentation/components/ui/Label";
import {
  GameTypeBadge,
  StatusBadge,
} from "@/presentation/components/ui/Badge";
import {
  formatCurrency,
  formatDateShort,
} from "@/presentation/lib/formatters";
import { useDebouncedValue } from "@/presentation/hooks/useDebouncedValue";
import { useAdminTicketsQuery } from "@/presentation/hooks/useAdminTickets";

const PAGE_SIZE = 12;

export default function AdminPage() {
  const [filters, setFilters] = useState<TicketFilterValues>({
    q: "",
    status: "",
    gameType: "",
  });
  const [userId, setUserId] = useState("");
  const [page, setPage] = useState(1);

  const debouncedQ = useDebouncedValue(filters.q, 350);
  const debouncedUserId = useDebouncedValue(userId, 350);

  const apiFilters = useMemo(
    () => ({
      q: debouncedQ || undefined,
      status: filters.status || undefined,
      gameType: filters.gameType || undefined,
      userId: debouncedUserId || undefined,
      page,
      pageSize: PAGE_SIZE,
    }),
    [debouncedQ, filters.status, filters.gameType, debouncedUserId, page],
  );

  const { data, isLoading, isError, error, refetch, isFetching } =
    useAdminTicketsQuery(apiFilters);

  const handleFiltersChange = (next: TicketFilterValues) => {
    setFilters(next);
    setPage(1);
  };

  return (
    <Container size="wide" className="space-y-6">
      <PageHeader
        eyebrow="Administrador"
        title="Vista global de boletas"
        description="Consulta todas las boletas de la plataforma. Filtra por usuario, estado, tipo o búsqueda."
      />

      <div className="space-y-3">
        <TicketFiltersBar
          value={filters}
          onChange={handleFiltersChange}
          searchPlaceholder="Buscar por título, número, nombre o email..."
        />
        <div className="rounded-lg border border-soft bg-surface p-4 shadow-card">
          <Label htmlFor="filter-userId">Filtrar por usuario (id)</Label>
          <Input
            id="filter-userId"
            placeholder="uuid del usuario"
            value={userId}
            onChange={(e) => {
              setUserId(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {isError && (
        <Alert variant="error">
          {error instanceof Error ? error.message : "Error al cargar."}
          <button
            type="button"
            className="ml-2 font-semibold underline"
            onClick={() => refetch()}
          >
            Reintentar
          </button>
        </Alert>
      )}

      <div className="overflow-hidden rounded-lg border border-soft bg-surface shadow-card">
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead className="bg-ink-100/60 text-left text-xs uppercase tracking-wider text-muted dark:bg-white/5">
              <tr>
                <th className="px-4 py-3 font-semibold">Dueño</th>
                <th className="px-4 py-3 font-semibold">Boleta</th>
                <th className="px-4 py-3 font-semibold">Tipo</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold">Fecha</th>
                <th className="px-4 py-3 font-semibold text-right">Apostado</th>
              </tr>
            </thead>
            <tbody
              className="divide-y divide-soft"
              aria-busy={isFetching || undefined}
            >
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-4 py-4">
                        <Skeleton className="h-4 w-32" />
                      </td>
                      <td className="px-4 py-4">
                        <Skeleton className="h-4 w-40" />
                      </td>
                      <td className="px-4 py-4">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="px-4 py-4">
                        <Skeleton className="h-6 w-24 rounded-full" />
                      </td>
                      <td className="px-4 py-4">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Skeleton className="ml-auto h-4 w-16" />
                      </td>
                    </tr>
                  ))
                : data?.items.map((t) => (
                    <tr
                      key={t.id}
                      className="hover:bg-ink-100/40 dark:hover:bg-white/[0.03]"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-strong">{t.owner.name}</p>
                        <p className="text-xs text-muted">{t.owner.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-strong">{t.title}</p>
                        {t.gameNumber && (
                          <span className="font-mono text-xs text-muted">
                            #{t.gameNumber}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <GameTypeBadge gameType={t.gameType} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={t.status} />
                      </td>
                      <td className="px-4 py-3 text-strong">
                        {formatDateShort(t.gameDate)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-strong">
                        {formatCurrency(t.amount)}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        <ul className="divide-y divide-soft md:hidden">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <li key={i} className="space-y-2 p-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </li>
              ))
            : data?.items.map((t) => (
                <li key={t.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-strong">{t.title}</p>
                      <p className="text-xs text-muted">
                        {t.owner.name} · {t.owner.email}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-strong">
                      {formatCurrency(t.amount)}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                    <GameTypeBadge gameType={t.gameType} />
                    <StatusBadge status={t.status} />
                    {t.gameNumber && (
                      <span className="font-mono text-muted">#{t.gameNumber}</span>
                    )}
                    <span className="text-muted">{formatDateShort(t.gameDate)}</span>
                  </div>
                </li>
              ))}
        </ul>

        {!isLoading && (data?.items.length ?? 0) === 0 && (
          <div className="p-8">
            <EmptyState
              title="Sin resultados"
              description="Prueba ajustando los filtros para encontrar boletas."
            />
          </div>
        )}
      </div>

      {data?.meta && <Pagination meta={data.meta} onPageChange={setPage} />}
    </Container>
  );
}
