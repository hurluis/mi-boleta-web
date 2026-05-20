"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCases } from "@/infrastructure/di/container";
import type {
  CreateTicketInput,
  TicketFilters,
  UpdateTicketInput,
} from "@/domain/repositories/TicketRepository";

export const ticketKeys = {
  all: ["tickets"] as const,
  list: (filters: TicketFilters) => ["tickets", "list", filters] as const,
  detail: (id: string) => ["tickets", "detail", id] as const,
};

export function useTicketsQuery(filters: TicketFilters) {
  return useQuery({
    queryKey: ticketKeys.list(filters),
    queryFn: () => useCases.listTickets.execute(filters),
  });
}

export function useTicketQuery(id: string) {
  return useQuery({
    queryKey: ticketKeys.detail(id),
    queryFn: () => useCases.getTicket.execute(id),
    enabled: Boolean(id),
  });
}

export function useCreateTicketMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTicketInput) => useCases.createTicket.execute(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ticketKeys.all });
    },
  });
}

export function useUpdateTicketMutation(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateTicketInput) =>
      useCases.updateTicket.execute(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ticketKeys.all });
      qc.invalidateQueries({ queryKey: ticketKeys.detail(id) });
    },
  });
}

export function useDeleteTicketMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => useCases.deleteTicket.execute(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ticketKeys.all });
    },
  });
}
