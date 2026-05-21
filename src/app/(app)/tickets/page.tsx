"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ListChecks, Plus } from "lucide-react";
import { Container } from "@/presentation/components/layout/Container";
import { PageHeader } from "@/presentation/components/layout/PageHeader";
import {
  TicketFiltersBar,
  type TicketFilterValues,
} from "@/presentation/components/tickets/TicketFilters";
import { TicketCard } from "@/presentation/components/tickets/TicketCard";
import { TicketCardSkeleton } from "@/presentation/components/tickets/TicketCardSkeleton";
import { Pagination } from "@/presentation/components/tickets/Pagination";
import { EmptyState } from "@/presentation/components/ui/EmptyState";
import { Alert } from "@/presentation/components/ui/Alert";
import { Modal } from "@/presentation/components/ui/Modal";
import { Button } from "@/presentation/components/ui/Button";
import {
  useDeleteTicketMutation,
  useTicketsQuery,
} from "@/presentation/hooks/useTickets";
import { useDebouncedValue } from "@/presentation/hooks/useDebouncedValue";
import { useToast } from "@/presentation/providers/ToastProvider";
import type { Ticket } from "@/domain/entities/Ticket";

const PAGE_SIZE = 9;

export default function TicketsPage() {
  const { push } = useToast();
  const [filters, setFilters] = useState<TicketFilterValues>({
    q: "",
    status: "",
    gameType: "",
  });
  const [page, setPage] = useState(1);
  const debouncedQ = useDebouncedValue(filters.q, 350);

  const apiFilters = useMemo(
    () => ({
      q: debouncedQ || undefined,
      status: filters.status || undefined,
      gameType: filters.gameType || undefined,
      page,
      pageSize: PAGE_SIZE,
    }),
    [debouncedQ, filters.status, filters.gameType, page],
  );

  const { data, isLoading, isError, error, refetch, isFetching } =
    useTicketsQuery(apiFilters);
  const deleteMutation = useDeleteTicketMutation();
  const [pendingDelete, setPendingDelete] = useState<Ticket | null>(null);

  const handleFiltersChange = (next: TicketFilterValues) => {
    setFilters(next);
    setPage(1);
  };

  const handleDeleteConfirm = async () => {
    if (!pendingDelete) return;
    try {
      await deleteMutation.mutateAsync(pendingDelete.id);
      push(`"${pendingDelete.title}" eliminada`, "success");
      setPendingDelete(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "No se pudo eliminar la boleta.";
      push(message, "error");
    }
  };

  return (
    <Container size="wide" className="space-y-6">
      <PageHeader
        eyebrow="Mis boletas"
        title="Tus juegos registrados"
        description="Filtra, busca y mantén al día todos tus sorteos."
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

      <TicketFiltersBar value={filters} onChange={handleFiltersChange} />

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

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <TicketCardSkeleton key={i} />
          ))}
        </div>
      ) : (data?.items.length ?? 0) === 0 ? (
        <EmptyState
          title="Aún no hay resultados"
          description={
            filters.q || filters.status || filters.gameType
              ? "Prueba a quitar algún filtro o cambiar tu búsqueda."
              : "Registra tu primera boleta para empezar a llevar el control."
          }
          icon={<ListChecks className="h-6 w-6" />}
          action={
            <Link
              href="/tickets/new"
              className="inline-flex h-11 items-center rounded-lg bg-gradient-to-br from-brand-500 via-teal-500 to-brand-700 px-5 text-sm font-medium text-white shadow-glow"
            >
              Registrar boleta
            </Link>
          }
        />
      ) : (
        <>
          <div
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            aria-busy={isFetching || undefined}
          >
            {data?.items.map((t) => (
              <TicketCard
                key={t.id}
                ticket={t}
                onDelete={(ticket) => setPendingDelete(ticket)}
              />
            ))}
          </div>
          {data?.meta && (
            <Pagination meta={data.meta} onPageChange={setPage} />
          )}
        </>
      )}

      <Modal
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        title="Eliminar boleta"
        description={
          pendingDelete
            ? `¿Seguro que quieres eliminar "${pendingDelete.title}"? Esta acción no se puede deshacer.`
            : ""
        }
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setPendingDelete(null)}
              disabled={deleteMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              loading={deleteMutation.isPending}
              onClick={handleDeleteConfirm}
            >
              Sí, eliminar
            </Button>
          </>
        }
      />
    </Container>
  );
}
