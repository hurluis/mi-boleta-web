import type { GameType, Ticket, TicketStatus } from "../entities/Ticket";
import type { PaginatedResult } from "../value-objects/Pagination";

export type TicketFilters = {
  status?: TicketStatus;
  gameType?: GameType;
  q?: string;
  page?: number;
  pageSize?: number;
};

export type CreateTicketInput = {
  title: string;
  gameType: GameType;
  gameNumber?: string | null;
  gameDate: Date;
  amount?: number | null;
  place?: string | null;
  status: TicketStatus;
  notes?: string | null;
};

export type UpdateTicketInput = Partial<CreateTicketInput>;

export interface TicketRepository {
  list(filters: TicketFilters): Promise<PaginatedResult<Ticket>>;
  getById(id: string): Promise<Ticket>;
  create(input: CreateTicketInput): Promise<Ticket>;
  update(id: string, input: UpdateTicketInput): Promise<Ticket>;
  delete(id: string): Promise<void>;
}
