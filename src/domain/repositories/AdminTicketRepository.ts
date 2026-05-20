import type { TicketWithOwner } from "../entities/Ticket";
import type { PaginatedResult } from "../value-objects/Pagination";
import type { TicketFilters } from "./TicketRepository";

export type AdminTicketFilters = TicketFilters & {
  userId?: string;
};

export interface AdminTicketRepository {
  listAll(filters: AdminTicketFilters): Promise<PaginatedResult<TicketWithOwner>>;
}
