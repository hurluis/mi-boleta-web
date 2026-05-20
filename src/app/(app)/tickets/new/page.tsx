"use client";

import { useRouter } from "next/navigation";
import { Container } from "@/presentation/components/layout/Container";
import { PageHeader } from "@/presentation/components/layout/PageHeader";
import { Card } from "@/presentation/components/ui/Card";
import { TicketForm } from "@/presentation/components/forms/TicketForm";
import { useCreateTicketMutation } from "@/presentation/hooks/useTickets";
import { useToast } from "@/presentation/providers/ToastProvider";
import type { CreateTicketInput } from "@/domain/repositories/TicketRepository";

export default function NewTicketPage() {
  const router = useRouter();
  const { push } = useToast();
  const createMutation = useCreateTicketMutation();

  return (
    <Container size="narrow" className="space-y-6">
      <PageHeader
        eyebrow="Nueva boleta"
        title="Registra un nuevo juego"
        description="Completa los datos del sorteo. Podrás editarlos en cualquier momento."
      />
      <Card className="p-6 sm:p-8">
        <TicketForm
          mode="create"
          onSubmit={async (values) => {
            await createMutation.mutateAsync(values as CreateTicketInput);
            push("Boleta creada correctamente", "success");
            router.replace("/tickets");
          }}
        />
      </Card>
    </Container>
  );
}
