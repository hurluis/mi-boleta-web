import type { TicketWithOwner } from "@/domain/entities/Ticket";
import type {
  AdminTicketFilters,
  AdminTicketRepository,
} from "@/domain/repositories/AdminTicketRepository";
import type { PaginatedResult } from "@/domain/value-objects/Pagination";
import { httpClient } from "@/infrastructure/http/httpClient";
import type { ApiSuccess } from "@/infrastructure/http/types";
import {
  reviveTicketWithOwner,
  stripUndefined,
} from "@/infrastructure/http/mappers";

type RawTicketWithOwner = Parameters<typeof reviveTicketWithOwner>[0];

export class HttpAdminTicketRepository implements AdminTicketRepository {
  async listAll(
    filters: AdminTicketFilters,
  ): Promise<PaginatedResult<TicketWithOwner>> {
    const params = stripUndefined({
      status: filters.status,
      gameType: filters.gameType,
      q: filters.q,
      userId: filters.userId,
      page: filters.page,
      pageSize: filters.pageSize,
    });
    const { data } = await httpClient.get<ApiSuccess<RawTicketWithOwner[]>>(
      "/admin/tickets",
      { params },
    );
    return {
      items: data.data.map(reviveTicketWithOwner),
      meta: data.meta ?? {
        total: data.data.length,
        page: filters.page ?? 1,
        pageSize: filters.pageSize ?? data.data.length,
        totalPages: 1,
      },
    };
  }
}
