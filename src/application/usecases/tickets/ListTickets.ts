import type { Ticket } from "@/domain/entities/Ticket";
import type {
  TicketFilters,
  TicketRepository,
} from "@/domain/repositories/TicketRepository";
import type { PaginatedResult } from "@/domain/value-objects/Pagination";

export class ListTickets {
  constructor(private readonly ticketRepository: TicketRepository) {}

  execute(filters: TicketFilters = {}): Promise<PaginatedResult<Ticket>> {
    return this.ticketRepository.list(filters);
  }
}
