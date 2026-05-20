import type { Ticket } from "@/domain/entities/Ticket";
import type {
  TicketRepository,
  UpdateTicketInput,
} from "@/domain/repositories/TicketRepository";

export class UpdateTicket {
  constructor(private readonly ticketRepository: TicketRepository) {}

  execute(id: string, input: UpdateTicketInput): Promise<Ticket> {
    return this.ticketRepository.update(id, input);
  }
}
