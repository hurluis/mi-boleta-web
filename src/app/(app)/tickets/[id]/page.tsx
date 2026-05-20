"use client";

import Link from "next/link";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/presentation/components/layout/Container";
import { PageHeader } from "@/presentation/components/layout/PageHeader";
import { Card, CardBody } from "@/presentation/components/ui/Card";
import { Skeleton } from "@/presentation/components/ui/Skeleton";
import { Alert } from "@/presentation/components/ui/Alert";
import { Button } from "@/presentation/components/ui/Button";
import { Modal } from "@/presentation/components/ui/Modal";
import {
  GameTypeBadge,
  StatusBadge,
} from "@/presentation/components/ui/Badge";
import {
  formatCurrency,
  formatDate,
  formatRelative,
} from "@/presentation/lib/formatters";
import {
  useDeleteTicketMutation,
  useTicketQuery,
} from "@/presentation/hooks/useTickets";
import { useToast } from "@/presentation/providers/ToastProvider";

export default function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { push } = useToast();
  const { data: ticket, isLoading, isError, error } = useTicketQuery(id);
  const deleteMutation = useDeleteTicketMutation();
  const [confirming, setConfirming] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      push("Boleta eliminada", "success");
      router.replace("/tickets");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "No se pudo eliminar la boleta.";
      push(message, "error");
    }
  };

  return (
    <Container size="narrow" className="space-y-6">
      <PageHeader
        eyebrow="Detalle"
        title={ticket?.title ?? "Boleta"}
        description={ticket ? `Registrada ${formatRelative(ticket.createdAt)}` : ""}
        actions={
          ticket && (
            <>
              <Link
                href={`/tickets/${ticket.id}/edit`}
                className="inline-flex h-11 items-center rounded-xl border border-soft bg-surface px-4 text-sm font-medium text-strong transition-colors hover:border-brand-400/60"
              >
                Editar
              </Link>
              <Button variant="danger" onClick={() => setConfirming(true)}>
                Eliminar
              </Button>
            </>
          )
        }
      />

      {isError && (
        <Alert variant="error">
          {error instanceof Error ? error.message : "No se pudo cargar la boleta."}
        </Alert>
      )}

      {isLoading || !ticket ? (
        <Card>
          <CardBody className="space-y-3">
            <Skeleton className="h-6 w-3/5" />
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-32 w-full" />
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardBody className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <GameTypeBadge gameType={ticket.gameType} />
              <StatusBadge status={ticket.status} />
              {ticket.gameNumber && (
                <span className="rounded-lg border border-dashed border-brand-400/40 bg-brand-500/5 px-3 py-1 font-mono text-sm font-semibold text-brand-700 dark:text-brand-200">
                  #{ticket.gameNumber}
                </span>
              )}
            </div>

            <dl className="grid gap-4 sm:grid-cols-2">
              <Detail label="Fecha del sorteo" value={formatDate(ticket.gameDate)} />
              <Detail label="Valor apostado" value={formatCurrency(ticket.amount)} />
              <Detail label="Lugar de compra" value={ticket.place ?? "—"} />
              <Detail label="Última actualización" value={formatRelative(ticket.updatedAt)} />
            </dl>

            {ticket.notes && (
              <div>
                <p className="text-xs uppercase tracking-wider text-muted">Notas</p>
                <p className="mt-1 whitespace-pre-line text-sm text-strong">
                  {ticket.notes}
                </p>
              </div>
            )}
          </CardBody>
        </Card>
      )}

      <Modal
        open={confirming}
        onClose={() => setConfirming(false)}
        title="Eliminar boleta"
        description={ticket ? `¿Seguro que quieres eliminar "${ticket.title}"?` : ""}
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirming(false)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              loading={deleteMutation.isPending}
              onClick={handleDelete}
            >
              Sí, eliminar
            </Button>
          </>
        }
      />
    </Container>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-muted">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-strong">{value}</dd>
    </div>
  );
}
