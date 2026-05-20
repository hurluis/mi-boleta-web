import type { Ticket } from "@/domain/entities/Ticket";
import type {
  CreateTicketInput,
  TicketRepository,
} from "@/domain/repositories/TicketRepository";

export class CreateTicket {
  constructor(private readonly ticketRepository: TicketRepository) {}

  execute(input: CreateTicketInput): Promise<Ticket> {
    return this.ticketRepository.create(input);
  }
}
