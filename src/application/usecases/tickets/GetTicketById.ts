import type { Ticket } from "@/domain/entities/Ticket";
import type { TicketRepository } from "@/domain/repositories/TicketRepository";

export class GetTicketById {
  constructor(private readonly ticketRepository: TicketRepository) {}

  execute(id: string): Promise<Ticket> {
    return this.ticketRepository.getById(id);
  }
}
