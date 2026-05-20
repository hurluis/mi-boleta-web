"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/presentation/components/layout/Container";
import { PageHeader } from "@/presentation/components/layout/PageHeader";
import { Card } from "@/presentation/components/ui/Card";
import { Skeleton } from "@/presentation/components/ui/Skeleton";
import { Alert } from "@/presentation/components/ui/Alert";
import { TicketForm } from "@/presentation/components/forms/TicketForm";
import {
  useTicketQuery,
  useUpdateTicketMutation,
} from "@/presentation/hooks/useTickets";
import { useToast } from "@/presentation/providers/ToastProvider";
import type { UpdateTicketInput } from "@/domain/repositories/TicketRepository";

export default function EditTicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { push } = useToast();
  const { data: ticket, isLoading, isError, error } = useTicketQuery(id);
  const updateMutation = useUpdateTicketMutation(id);

  return (
    <Container size="narrow" className="space-y-6">
      <PageHeader
        eyebrow="Editar"
        title="Actualiza tu boleta"
        description="Modifica los datos del sorteo."
      />

      {isError && (
        <Alert variant="error">
          {error instanceof Error ? error.message : "No se pudo cargar."}
        </Alert>
      )}

      <Card className="p-6 sm:p-8">
        {isLoading || !ticket ? (
          <div className="space-y-4">
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <TicketForm
            mode="edit"
            initialValue={ticket}
            onSubmit={async (values) => {
              await updateMutation.mutateAsync(values as UpdateTicketInput);
              push("Cambios guardados", "success");
              router.replace(`/tickets/${id}`);
            }}
          />
        )}
      </Card>
    </Container>
  );
}
