import type { Ticket } from "@/domain/entities/Ticket";
import type {
  CreateTicketInput,
  TicketFilters,
  TicketRepository,
  UpdateTicketInput,
} from "@/domain/repositories/TicketRepository";
import type { PaginatedResult } from "@/domain/value-objects/Pagination";
import { httpClient } from "@/infrastructure/http/httpClient";
import type { ApiSuccess } from "@/infrastructure/http/types";
import { reviveTicket, stripUndefined } from "@/infrastructure/http/mappers";

type RawTicket = Parameters<typeof reviveTicket>[0];

function serializeTicket(
  input: CreateTicketInput | UpdateTicketInput,
): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (input.title !== undefined) body.title = input.title;
  if (input.gameType !== undefined) body.gameType = input.gameType;
  if (input.gameNumber !== undefined)
    body.gameNumber = input.gameNumber === "" ? null : input.gameNumber;
  if (input.gameDate !== undefined) body.gameDate = input.gameDate.toISOString();
  if (input.amount !== undefined) body.amount = input.amount;
  if (input.place !== undefined)
    body.place = input.place === "" ? null : input.place;
  if (input.status !== undefined) body.status = input.status;
  if (input.notes !== undefined)
    body.notes = input.notes === "" ? null : input.notes;
  return body;
}

export class HttpTicketRepository implements TicketRepository {
  async list(filters: TicketFilters): Promise<PaginatedResult<Ticket>> {
    const params = stripUndefined({
      status: filters.status,
      gameType: filters.gameType,
      q: filters.q,
      page: filters.page,
      pageSize: filters.pageSize,
    });
    const { data } = await httpClient.get<ApiSuccess<RawTicket[]>>(
      "/tickets",
      { params },
    );
    return {
      items: data.data.map(reviveTicket),
      meta: data.meta ?? {
        total: data.data.length,
        page: filters.page ?? 1,
        pageSize: filters.pageSize ?? data.data.length,
        totalPages: 1,
      },
    };
  }

  async getById(id: string): Promise<Ticket> {
    const { data } = await httpClient.get<ApiSuccess<RawTicket>>(`/tickets/${id}`);
    return reviveTicket(data.data);
  }

  async create(input: CreateTicketInput): Promise<Ticket> {
    const { data } = await httpClient.post<ApiSuccess<RawTicket>>(
      "/tickets",
      serializeTicket(input),
    );
    return reviveTicket(data.data);
  }

  async update(id: string, input: UpdateTicketInput): Promise<Ticket> {
    const { data } = await httpClient.put<ApiSuccess<RawTicket>>(
      `/tickets/${id}`,
      serializeTicket(input),
    );
    return reviveTicket(data.data);
  }

  async delete(id: string): Promise<void> {
    await httpClient.delete(`/tickets/${id}`);
  }
}
