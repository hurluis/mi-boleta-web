import type { TicketWithOwner } from "@/domain/entities/Ticket";
import type {
  AdminTicketFilters,
  AdminTicketRepository,
} from "@/domain/repositories/AdminTicketRepository";
import type { PaginatedResult } from "@/domain/value-objects/Pagination";

export class ListAllTicketsAdmin {
  constructor(private readonly adminTicketRepository: AdminTicketRepository) {}

  execute(
    filters: AdminTicketFilters = {},
  ): Promise<PaginatedResult<TicketWithOwner>> {
    return this.adminTicketRepository.listAll(filters);
  }
}
