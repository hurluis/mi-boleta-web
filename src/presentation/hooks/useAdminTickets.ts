"use client";

import { useQuery } from "@tanstack/react-query";
import { useCases } from "@/infrastructure/di/container";
import type { AdminTicketFilters } from "@/domain/repositories/AdminTicketRepository";

export const adminTicketKeys = {
  list: (filters: AdminTicketFilters) =>
    ["admin", "tickets", filters] as const,
};

export function useAdminTicketsQuery(filters: AdminTicketFilters) {
  return useQuery({
    queryKey: adminTicketKeys.list(filters),
    queryFn: () => useCases.listAdminTickets.execute(filters),
  });
}
