import type { TicketRepository } from "@/domain/repositories/TicketRepository";

export class DeleteTicket {
  constructor(private readonly ticketRepository: TicketRepository) {}

  execute(id: string): Promise<void> {
    return this.ticketRepository.delete(id);
  }
}
